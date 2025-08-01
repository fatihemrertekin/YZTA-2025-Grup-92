"""
Scheduler Servisi
APScheduler ile günlük digest gönderimi ve RSS tarama görevleri
"""
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import pytz

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from loguru import logger

from app.core.config import settings
from app.services.rss_crawler import crawler
from app.services.ai_summarizer import summarizer
from app.services.nodemailer_service import email_service
from app.core.database import db_manager


class SchedulerService:
    """Scheduler görev yönetimi servisi"""
    
    def __init__(self):
        # Türkiye zaman dilimini kullan
        timezone = pytz.timezone('Europe/Istanbul')
        self.scheduler = AsyncIOScheduler(timezone=timezone)
        self.is_running = False
    
    async def crawl_and_process_news(self):
        """RSS kaynaklarını tara ve işle"""
        try:
            current_time = datetime.now(pytz.timezone('Europe/Istanbul'))
            logger.info(f"🕐 Günlük RSS tarama başlatılıyor - {current_time.strftime('%Y-%m-%d %H:%M:%S %Z')}...")
            
            # RSS kaynaklarını tara
            async with crawler:
                articles = await crawler.crawl_all_sources()
            
            if not articles:
                logger.warning("Hiç makale bulunamadı")
                return
            
            # Makaleleri özetle
            summarized_articles = await summarizer.summarize_articles_batch(articles)
            
            # Veritabanına kaydet
            await self.save_articles_to_db(summarized_articles)
            
            logger.info(f"✅ {len(summarized_articles)} makale işlendi ve kaydedildi")
            
        except Exception as e:
            logger.error(f"RSS tarama ve işleme hatası: {e}")
    
    async def send_daily_digests(self):
        """Günlük digest e-postalarını gönder"""
        try:
            current_time = datetime.now(pytz.timezone('Europe/Istanbul'))
            logger.info(f"📧 Günlük digest gönderimi başlatılıyor - {current_time.strftime('%Y-%m-%d %H:%M:%S %Z')}...")
            
            # Aktif kullanıcıları al
            users = await self.get_active_users()
            
            if not users:
                logger.info("Aktif kullanıcı bulunamadı")
                return
            
            # Son 24 saatteki makaleleri al
            articles = await self.get_recent_articles()
            
            if not articles:
                logger.warning("Son 24 saatte makale bulunamadı")
                return
            
            # Her kullanıcı için digest gönder
            sent_count = 0
            failed_count = 0
            
            for user in users:
                try:
                    # Kullanıcının seçtiği kategorilere göre filtrele
                    user_articles = self.filter_articles_by_categories(
                        articles, user.get("selected_categories", [])
                    )
                    
                    if user_articles:
                        # E-posta gönder
                        success = await email_service.send_digest_email(
                            user["email"], user_articles, "daily"
                        )
                        
                        if success:
                            sent_count += 1
                            # Digest history'ye kaydet
                            await self.save_digest_history(user, user_articles, "daily")
                        else:
                            failed_count += 1
                    
                except Exception as e:
                    logger.error(f"Kullanıcı digest hatası {user['email']}: {e}")
                    failed_count += 1
            
            logger.info(f"✅ Digest gönderimi tamamlandı: {sent_count} başarılı, {failed_count} başarısız")
            
        except Exception as e:
            logger.error(f"Günlük digest gönderim hatası: {e}")
    
    async def save_articles_to_db(self, articles: List[Dict]):
        """Makaleleri veritabanına kaydet"""
        try:
            if settings.database_type == "postgresql":
                await self.save_articles_postgresql(articles)
                
        except Exception as e:
            logger.error(f"Makale kaydetme hatası: {e}")
    
    async def save_articles_postgresql(self, articles: List[Dict]):
        """PostgreSQL'e makale kaydet"""
        from sqlalchemy.dialects.postgresql import insert
        from app.models.article import Article
        
        async for db in db_manager.get_async_db():
            for article in articles:
                try:
                    # Upsert (insert or update on conflict)
                    stmt = insert(Article).values(**article)
                    stmt = stmt.on_conflict_do_update(
                        index_elements=['link'],
                        set_={
                            'summary': stmt.excluded.summary,
                            'processed': stmt.excluded.processed
                        }
                    )
                    
                    await db.execute(stmt)
                    
                except Exception as e:
                    logger.error(f"PostgreSQL makale kayıt hatası: {e}")
                    continue
            
            await db.commit()
    
    async def get_active_users(self) -> List[Dict]:
        """Aktif kullanıcıları al"""
        try:
            if settings.database_type == "postgresql":
                return await self.get_users_postgresql()
            return []
            
        except Exception as e:
            logger.error(f"Kullanıcı alma hatası: {e}")
            return []
    
    async def get_users_postgresql(self) -> List[Dict]:
        """PostgreSQL'den kullanıcıları al"""
        from sqlalchemy import select
        from app.models.user import User
        
        async for db in db_manager.get_async_db():
            result = await db.execute(
                select(User).where(User.is_active == True)
            )
            users = result.scalars().all()
            
            return [
                {
                    "id": user.id,
                    "email": user.email,
                    "selected_categories": user.selected_categories,
                    "frequency": user.frequency
                }
                for user in users
            ]
    
    async def get_recent_articles(self, hours: int = 24) -> List[Dict]:
        """Son X saatteki makaleleri al"""
        try:
            if settings.database_type == "postgresql":
                return await self.get_articles_postgresql(hours)
            return []
            
        except Exception as e:
            logger.error(f"Makale alma hatası: {e}")
            return []
    
    async def get_articles_postgresql(self, hours: int) -> List[Dict]:
        """PostgreSQL'den son makaleleri al"""
        from sqlalchemy import select
        from app.models.article import Article
        
        cutoff_date = datetime.now() - timedelta(hours=hours)
        
        async for db in db_manager.get_async_db():
            result = await db.execute(
                select(Article).where(
                    Article.published_at >= cutoff_date,
                    Article.processed == 1
                ).order_by(Article.published_at.desc())
            )
            articles = result.scalars().all()
            
            return [
                {
                    "id": article.id,
                    "title": article.title,
                    "link": article.link,
                    "summary": article.summary,
                    "category": article.category,
                    "source": article.source,
                    "published_at": article.published_at.isoformat()
                }
                for article in articles
            ]
    
    def filter_articles_by_categories(self, articles: List[Dict], categories: List[str]) -> List[Dict]:
        """Makaleleri kategorilere göre filtrele"""
        if not categories:
            return articles
        
        return [
            article for article in articles 
            if article.get('category') in categories
        ]
    
    async def save_digest_history(self, user: Dict, articles: List[Dict], digest_type: str):
        """Digest geçmişini kaydet"""
        try:
            article_ids = [article['id'] for article in articles]
            
            digest_data = {
                "user_id": user["id"],
                "article_ids": article_ids,
                "digest_type": digest_type,
                "sent_at": datetime.now(),
                "email_status": "sent"
            }
            
            if settings.database_type == "postgresql":
                await self.save_digest_postgresql(digest_data)
                
        except Exception as e:
            logger.error(f"Digest history kayıt hatası: {e}")
    
    async def save_digest_postgresql(self, digest_data: Dict):
        """PostgreSQL'e digest history kaydet"""
        from app.models.digest import DigestHistory
        
        async for db in db_manager.get_async_db():
            digest = DigestHistory(**digest_data)
            db.add(digest)
            await db.commit()
    
    def start_scheduler(self):
        """Scheduler'ı başlat"""
        if self.is_running:
            logger.warning("Scheduler zaten çalışıyor")
            return
        
        # Türkiye zaman dilimini kullan
        timezone = pytz.timezone('Europe/Istanbul')
        
        # Async fonksiyonları doğrudan çağır
        # Günlük RSS tarama
        self.scheduler.add_job(
            self.crawl_and_process_news,
            CronTrigger(hour=settings.daily_crawl_hour, minute=settings.daily_crawl_minute, timezone=timezone),
            id="daily_crawl",
            name="Günlük RSS Tarama",
            max_instances=1,
            misfire_grace_time=300  # 5 dakika tolerans
        )
        
        # Günlük digest gönderimi
        self.scheduler.add_job(
            self.send_daily_digests,
            CronTrigger(hour=settings.daily_digest_hour, minute=settings.daily_digest_minute, timezone=timezone),
            id="daily_digest",
            name="Günlük Digest Gönderimi",
            max_instances=1,
            misfire_grace_time=300  # 5 dakika tolerans
        )
        
        self.scheduler.start()
        self.is_running = True
        
        # Zamanlanmış görevleri logla
        jobs = self.scheduler.get_jobs()
        logger.info(f"✅ Scheduler başlatıldı - {len(jobs)} görev zamanlandı")
        
        for job in jobs:
            next_run = job.next_run_time
            if next_run:
                logger.info(f"📅 Görev '{job.name}' bir sonraki çalışma: {next_run.strftime('%Y-%m-%d %H:%M:%S %Z')}")
            else:
                logger.warning(f"⚠️ Görev '{job.name}' için çalışma zamanı bulunamadı")
    
    def stop_scheduler(self):
        """Scheduler'ı durdur"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            self.is_running = False
            logger.info("⏹️ Scheduler durduruldu")
    
    def get_job_status(self) -> Dict:
        """Scheduler görev durumunu al"""
        jobs = []
        current_time = datetime.now(pytz.timezone('Europe/Istanbul'))
        
        for job in self.scheduler.get_jobs():
            next_run = job.next_run_time
            next_run_str = None
            
            if next_run:
                # Scheduler zaten Türkiye saatini kullandığı için direkt formatla
                next_run_str = next_run.strftime('%Y-%m-%d %H:%M:%S %Z')
            
            jobs.append({
                "id": job.id,
                "name": job.name,
                "next_run": next_run_str,
                "next_run_utc": next_run.isoformat() if next_run else None,
                "trigger": str(job.trigger),
                "enabled": True
            })
        
        return {
            "running": self.is_running,
            "scheduler_timezone": str(self.scheduler.timezone),
            "current_time": current_time.strftime('%Y-%m-%d %H:%M:%S %Z'),
            "jobs_count": len(jobs),
            "jobs": jobs
        }
    
    def trigger_crawl_now(self):
        """RSS taramayı hemen başlat"""
        logger.info("🚀 Manuel RSS tarama tetikleniyor...")
        asyncio.create_task(self.crawl_and_process_news())
    
    def trigger_digest_now(self):
        """Digest gönderimini hemen başlat"""
        logger.info("📧 Manuel digest gönderimi tetikleniyor...")
        asyncio.create_task(self.send_daily_digests())


# Global scheduler instance
scheduler_service = SchedulerService() 