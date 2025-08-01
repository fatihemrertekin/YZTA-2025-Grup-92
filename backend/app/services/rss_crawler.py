"""
RSS Crawler Servisi
RSS kaynaklarından içerik çeker ve kategorilere ayırır
"""
import asyncio
import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from urllib.parse import urlparse

import aiohttp
import feedparser
import requests
from bs4 import BeautifulSoup
from loguru import logger

from app.core.config import settings


class RSSCrawler:
    """RSS kaynaklarını tarayan servis"""
    
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        
        # Kategori anahtar kelimeleri
        self.category_keywords = {
            "Yapay Zeka": [
                "artificial intelligence", "machine learning", "deep learning", "neural network",
                "chatgpt", "openai", "ai", "automation", "robot", "computer vision",
                "natural language", "nlp", "yapay zeka", "makine öğrenmesi"
            ],
            "Yazılım": [
                "software", "programming", "code", "developer", "framework", "library",
                "javascript", "python", "react", "nodejs", "api", "database",
                "yazılım", "programlama", "geliştirici", "uygulama", "app"
            ],
            "Donanım": [
                "hardware", "processor", "cpu", "gpu", "memory", "storage", "chip",
                "semiconductor", "intel", "amd", "nvidia", "apple silicon", "m1", "m2",
                "donanım", "işlemci", "bellek", "grafik kartı"
            ]
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    def categorize_content(self, title: str, content: str = "") -> str:
        """İçeriği kategorilere ayır"""
        text = f"{title} {content}".lower()
        
        category_scores = {}
        for category, keywords in self.category_keywords.items():
            score = sum(1 for keyword in keywords if keyword.lower() in text)
            if score > 0:
                category_scores[category] = score
        
        if category_scores:
            return max(category_scores.items(), key=lambda x: x[1])[0]
        
        return "Other"
    
    def clean_html(self, html_content: str) -> str:
        """HTML içeriğini temizle"""
        if not html_content:
            return ""
        
        soup = BeautifulSoup(html_content, 'html.parser')
        # Script ve style etiketlerini kaldır
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Metni al ve temizle
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text[:1000]  # İlk 1000 karakteri al
    
    def extract_source_name(self, rss_url: str) -> str:
        """RSS URL'den kaynak adını çıkar"""
        domain = urlparse(rss_url).netloc
        source_names = {
            "techcrunch.com": "TechCrunch",
            "theverge.com": "The Verge",
            "arstechnica.com": "Ars Technica",
            "wired.com": "Wired",
            "engadget.com": "Engadget",
            "venturebeat.com": "VentureBeat",
            "thenextweb.com": "TNW",
            "techradar.com": "TechRadar"
        }
        
        return source_names.get(domain, domain.replace("www.", "").title())
    
    async def fetch_rss_content(self, rss_url: str) -> List[Dict]:
        """Tek bir RSS kaynağından içerik çek"""
        try:
            if not self.session:
                raise ValueError("Session başlatılmadı!")
            
            async with self.session.get(rss_url) as response:
                if response.status != 200:
                    logger.error(f"RSS fetch hatası {rss_url}: {response.status}")
                    return []
                
                content = await response.text()
            
            # feedparser ile parse et
            feed = feedparser.parse(content)
            
            if not hasattr(feed, 'entries'):
                logger.error(f"Geçersiz RSS formatı: {rss_url}")
                return []
            
            articles = []
            source_name = self.extract_source_name(rss_url)
            
            # Son 24 saatteki makaleleri al
            cutoff_date = datetime.now() - timedelta(days=1)
            
            for entry in feed.entries[:20]:  # Son 20 makaleyi kontrol et
                try:
                    # Yayın tarihini parse et
                    published_at = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        published_at = datetime(*entry.published_parsed[:6])
                    elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                        published_at = datetime(*entry.updated_parsed[:6])
                    else:
                        published_at = datetime.now()
                    
                    # Son 24 saatte yayınlanmış mı kontrol et
                    if published_at < cutoff_date:
                        continue
                    
                    # İçeriği temizle
                    content = ""
                    if hasattr(entry, 'content') and entry.content:
                        content = self.clean_html(entry.content[0].value)
                    elif hasattr(entry, 'summary'):
                        content = self.clean_html(entry.summary)
                    
                    # Kategoriyi belirle
                    category = self.categorize_content(entry.title, content)
                    
                    article = {
                        "title": entry.title,
                        "link": entry.link,
                        "original_content": content,
                        "category": category,
                        "source": source_name,
                        "published_at": published_at
                    }
                    
                    articles.append(article)
                    
                except Exception as e:
                    logger.error(f"Makale parse hatası: {e}")
                    continue
            
            logger.info(f"{source_name}: {len(articles)} yeni makale bulundu")
            return articles
            
        except Exception as e:
            logger.error(f"RSS fetch hatası {rss_url}: {e}")
            return []
    
    async def crawl_all_sources(self) -> List[Dict]:
        """Tüm RSS kaynaklarını tara"""
        all_articles = []
        
        # Paralel olarak tüm RSS kaynaklarını tara
        tasks = [
            self.fetch_rss_content(rss_url) 
            for rss_url in settings.rss_sources_list
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"RSS crawling hatası: {result}")
                continue
            
            all_articles.extend(result)
        
        # Aynı linkleri filtrele
        seen_links = set()
        unique_articles = []
        
        for article in all_articles:
            if article["link"] not in seen_links:
                seen_links.add(article["link"])
                unique_articles.append(article)
        
        logger.info(f"Toplam {len(unique_articles)} benzersiz makale toplandı")
        return unique_articles
    
    def sync_fetch_rss(self, rss_url: str) -> List[Dict]:
        """Senkron RSS fetch (test için)"""
        try:
            response = requests.get(rss_url, timeout=30)
            response.raise_for_status()
            
            feed = feedparser.parse(response.content)
            articles = []
            source_name = self.extract_source_name(rss_url)
            
            for entry in feed.entries[:5]:  # Test için sadece 5 makale
                try:
                    content = ""
                    if hasattr(entry, 'summary'):
                        content = self.clean_html(entry.summary)
                    
                    category = self.categorize_content(entry.title, content)
                    
                    article = {
                        "title": entry.title,
                        "link": entry.link,
                        "original_content": content,
                        "category": category,
                        "source": source_name,
                        "published_at": datetime.now()
                    }
                    
                    articles.append(article)
                    
                except Exception as e:
                    logger.error(f"Makale parse hatası: {e}")
                    continue
            
            return articles
            
        except Exception as e:
            logger.error(f"Sync RSS fetch hatası {rss_url}: {e}")
            return []


# Global crawler instance
crawler = RSSCrawler() 