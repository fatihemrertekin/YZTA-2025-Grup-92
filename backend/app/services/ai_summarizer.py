"""
AI Summarizer Servisi
Google Gemini API kullanarak makale özetleri oluşturur
"""
import asyncio
import time
from typing import List, Dict, Optional
import google.generativeai as genai
from loguru import logger

from app.core.config import settings


class AISummarizer:
    """Google Gemini ile makale özetleme servisi"""
    
    def __init__(self):
        # Gemini API'yi yapılandır
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(settings.gemini_model)
        
        # Rate limiting için
        self.last_request_time = 0
        self.min_request_interval = 2.0  # En az 2 saniye bekle
        self.daily_request_count = 0
        self.daily_limit = 40  # Güvenli limit (50'nin altında)
        self.last_reset_date = time.strftime("%Y-%m-%d")
        
        # Özet için sistem prompt'u
        self.system_prompt = """
Sen teknoloji haberlerini özetleyen bir yapay zeka asistanısın. 
Görevin, verilen makaleyi Türkçe olarak 2-3 cümlelik kısa ve öz bir şekilde özetlemek.

Özet kuralları:
1. Maksimum 150 kelime kullan
2. Ana konuyu ve önemli detayları vurgula
3. Açık ve anlaşılır Türkçe kullan
4. Teknik terimleri gerekirse açıkla
5. Clickbait ifadeler kullanma, objektif ol

Örnek özet formatı:
"[Şirket/Teknoloji] hakkında [ana konu]. [Önemli detay 1]. [Önemli detay 2 veya etki]."

Lütfen sadece özet metnini döndür, başka açıklama ekleme.
"""
    
    def _check_daily_limit(self) -> bool:
        """Günlük limiti kontrol et ve gerekirse sıfırla"""
        current_date = time.strftime("%Y-%m-%d")
        if current_date != self.last_reset_date:
            self.daily_request_count = 0
            self.last_reset_date = current_date
            logger.info(f"📅 Günlük quota sıfırlandı: {self.daily_limit} request")
        
        if self.daily_request_count >= self.daily_limit:
            logger.warning(f"⚠️ Günlük limit aşıldı: {self.daily_request_count}/{self.daily_limit}")
            return False
        return True
    
    async def _wait_for_rate_limit(self):
        """Rate limiting için bekle"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.min_request_interval:
            wait_time = self.min_request_interval - time_since_last
            logger.info(f"⏱️ Rate limiting: {wait_time:.1f}s bekleniyor...")
            await asyncio.sleep(wait_time)
        
        self.last_request_time = time.time()
    
    async def summarize_article(self, title: str, content: str, max_retries: int = 3) -> Optional[str]:
        """Tek bir makaleyi özetle"""
        if not content or len(content.strip()) < 50:
            return f"Bu makale {title} hakkında kısa bir haber içeriyor."
        
        prompt = f"""
{self.system_prompt}

Makale Başlığı: {title}

İçerik:
{content[:2000]}

Bu makaleyi yukarıdaki kurallara göre özetle:
"""
        
        # Günlük limit kontrolü
        if not self._check_daily_limit():
            logger.error(f"🚫 Günlük quota aşıldı, orijinal içerik döndürülüyor: {title}")
            return content[:400] + "..." if len(content) > 400 else content
        
        for attempt in range(max_retries):
            try:
                # Rate limiting bekle
                await self._wait_for_rate_limit()
                
                # Request sayacını artır
                self.daily_request_count += 1
                logger.info(f"📊 API Request: {self.daily_request_count}/{self.daily_limit}")
                
                # Gemini API'ye senkron istek gönder
                response = await asyncio.to_thread(
                    self.model.generate_content,
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        max_output_tokens=200,
                        temperature=0.3,
                    )
                )
                
                if response.text and len(response.text.strip()) > 20:
                    summary = response.text.strip()
                    logger.info(f"Makale özetlendi: {title[:50]}...")
                    return summary
                else:
                    logger.warning(f"Çok kısa özet alındı, tekrar denenecek: {attempt + 1}")
                    
            except Exception as e:
                error_str = str(e)
                logger.error(f"Özet oluşturma hatası (deneme {attempt + 1}): {e}")
                
                # Quota aşımı hatası - hemen orijinal içerikle fallback'e geç
                if "429" in error_str or "quota" in error_str.lower():
                    logger.warning(f"Gemini API quota aşıldı, orijinal içerik döndürülüyor: {title}")
                    # Orijinal içeriği kısaltılmış halde döndür
                    if len(content) > 400:
                        return content[:400] + "..."
                    else:
                        return content
                    
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                
        # Genel fallback - orijinal içeriği döndür
        logger.info(f"AI özetleme başarısız, orijinal içerik döndürülüyor: {title}")
        if len(content) > 400:
            return content[:400] + "..."
        else:
            return content
    
    async def summarize_articles_batch(self, articles: List[Dict]) -> List[Dict]:
        """Makale listesini toplu olarak özetle"""
        if not articles:
            return []
        
        logger.info(f"{len(articles)} makale özetlenecek...")
        
        # Semafore ile eş zamanlı istek sayısını sınırla (Gemini için daha düşük)
        semaphore = asyncio.Semaphore(3)  # Maksimum 3 eş zamanlı istek
        
        async def summarize_with_semaphore(article: Dict) -> Dict:
            async with semaphore:
                try:
                    summary = await self.summarize_article(
                        article["title"], 
                        article.get("original_content", "")
                    )
                    
                    article["summary"] = summary
                    article["processed"] = 1
                    
                    # Gemini rate limit için kısa bekleme
                    await asyncio.sleep(0.5)
                    
                    return article
                    
                except Exception as e:
                    logger.error(f"Makale özet hatası: {e}")
                    article["summary"] = f"Bu makale {article['title']} hakkında önemli bilgiler içeriyor."
                    article["processed"] = 0
                    return article
        
        # Tüm makaleleri paralel olarak özetle
        tasks = [summarize_with_semaphore(article.copy()) for article in articles]
        summarized_articles = await asyncio.gather(*tasks)
        
        successful = sum(1 for article in summarized_articles if article["processed"] == 1)
        logger.info(f"{successful}/{len(articles)} makale başarıyla özetlendi")
        
        return summarized_articles
    

    def sync_summarize(self, title: str, content: str) -> str:
        """Senkron özet oluşturma (test için)"""
        try:
            prompt = f"""
{self.system_prompt}

Makale Başlığı: {title}

İçerik: {content[:1000]}

Bu makaleyi yukarıdaki kurallara göre özetle:
"""
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=150,
                    temperature=0.3,
                )
            )
            
            if response.text:
                return response.text.strip()
            else:
                raise Exception("Boş yanıt alındı")
            
        except Exception as e:
            error_str = str(e)
            logger.error(f"Sync özet hatası: {e}")
            
            # Quota aşımı durumunda orijinal içerik döndür
            if "429" in error_str or "quota" in error_str.lower():
                logger.warning(f"Gemini API quota aşıldı (sync test), orijinal içerik döndürülüyor")
                if len(content) > 300:
                    return content[:300] + "..."
                else:
                    return content
                
            # Genel fallback - orijinal içerik
            if len(content) > 300:
                return content[:300] + "..."
            else:
                return content
    



    def test_connection(self) -> bool:
        """Gemini API bağlantısını test et"""
        try:
            test_response = self.model.generate_content(
                "Merhaba, bu bir test mesajıdır. Kısaca 'Test başarılı' diye yanıtla.",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=10,
                    temperature=0.1,
                )
            )
            
            return bool(test_response.text and "test" in test_response.text.lower())
            
        except Exception as e:
            error_str = str(e)
            logger.error(f"Gemini bağlantı testi hatası: {e}")
            
            # Quota aşımı durumunda özel log
            if "429" in error_str or "quota" in error_str.lower():
                logger.warning("Gemini API quota aşıldı, bağlantı test edilemiyor")
                
            return False


# Global summarizer instance
summarizer = AISummarizer() 