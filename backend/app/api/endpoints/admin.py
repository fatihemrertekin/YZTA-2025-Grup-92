"""
Admin API Endpoints
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from pydantic import BaseModel

from app.api.deps import get_async_db, verify_admin_access
from app.services.scheduler import scheduler_service
from app.services.nodemailer_service import email_service
from app.services.rss_crawler import crawler
from app.services.ai_summarizer import summarizer
from app.core.config import settings

router = APIRouter()


class AITestRequest(BaseModel):
    title: str
    content: str


@router.get("/status", response_model=Dict[str, Any])
async def get_system_status(
    _: bool = Depends(verify_admin_access)
):
    """Sistem durumunu al"""
    try:
        scheduler_status = scheduler_service.get_job_status()
        
        return {
            "system": "Tech News Digest Backend",
            "version": "1.0.0",
            "environment": settings.environment,
            "database_type": settings.database_type,
            "scheduler": scheduler_status,
            "services": {
                "rss_crawler": "active",
                "ai_summarizer": "active",
                "email_service": "active",
                "scheduler": "active" if scheduler_status["running"] else "inactive"
            }
        }
    except Exception as e:
        logger.error(f"Sistem durumu alma hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sistem durumu alınamadı"
        )


@router.post("/scheduler/start", response_model=Dict[str, str])
async def start_scheduler(
    _: bool = Depends(verify_admin_access)
):
    """Scheduler'ı başlat"""
    try:
        scheduler_service.start_scheduler()
        return {"message": "Scheduler başarıyla başlatıldı"}
    except Exception as e:
        logger.error(f"Scheduler başlatma hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Scheduler başlatılamadı"
        )


@router.post("/scheduler/stop", response_model=Dict[str, str])
async def stop_scheduler(
    _: bool = Depends(verify_admin_access)
):
    """Scheduler'ı durdur"""
    try:
        scheduler_service.stop_scheduler()
        return {"message": "Scheduler başarıyla durduruldu"}
    except Exception as e:
        logger.error(f"Scheduler durdurma hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Scheduler durdurulamadı"
        )


@router.get("/scheduler/status", response_model=Dict[str, Any])
async def get_scheduler_status(
    _: bool = Depends(verify_admin_access)
):
    """Scheduler durumunu al"""
    return scheduler_service.get_job_status()


@router.post("/crawl/run", response_model=Dict[str, Any])
async def run_manual_crawl(
    _: bool = Depends(verify_admin_access)
):
    """Manuel RSS tarama ve işleme"""
    try:
        scheduler_service.trigger_crawl_now()
        return {"message": "Manuel RSS tarama başlatıldı"}
    except Exception as e:
        logger.error(f"Manuel crawl hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Manuel tarama hatası: {str(e)}"
        )


@router.post("/digest/send", response_model=Dict[str, Any])
async def send_manual_digest(
    _: bool = Depends(verify_admin_access)
):
    """Manuel digest gönderimi"""
    try:
        scheduler_service.trigger_digest_now()
        return {"message": "Manuel digest gönderimi başlatıldı"}
    except Exception as e:
        logger.error(f"Manuel digest hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Manuel digest hatası: {str(e)}"
        )


@router.post("/email/test", response_model=Dict[str, Any])
async def test_email_service(
    test_email: str,
    _: bool = Depends(verify_admin_access)
):
    """E-posta servisini test et"""
    try:
        # Test makaleleri oluştur
        test_articles = [
            {
                "title": "Test Haberi 1",
                "link": "https://example.com/test1",
                "summary": "Bu bir test haberidir. AI ve teknoloji hakkında önemli gelişmeler içerir.",
                "category": "AI",
                "source": "Test Source",
                "published_at": "2024-01-01T10:00:00"
            },
            {
                "title": "Test Haberi 2",
                "link": "https://example.com/test2",
                "summary": "Bu da başka bir test haberidir. Yazılım geliştirme konularını ele alır.",
                "category": "Software",
                "source": "Test Source",
                "published_at": "2024-01-01T11:00:00"
            }
        ]
        
        # Test e-postası gönder
        success = await email_service.send_digest_email(
            test_email, test_articles, "daily"
        )
        
        if success:
            return {"message": f"Test e-postası başarıyla gönderildi: {test_email}"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Test e-postası gönderilemedi"
            )
            
    except Exception as e:
        logger.error(f"E-posta test hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"E-posta test hatası: {str(e)}"
        )


@router.get("/config", response_model=Dict[str, Any])
async def get_config(
    _: bool = Depends(verify_admin_access)
):
    """Sistem konfigürasyonunu al"""
    return {
        "app_name": settings.app_name,
        "app_version": settings.app_version,
        "environment": settings.environment,
        "debug": settings.debug,
        "database_type": settings.database_type,
        "daily_digest_hour": settings.daily_digest_hour,
        "daily_digest_minute": settings.daily_digest_minute,
        "rss_sources": settings.rss_sources_list,
        "gemini_model": settings.gemini_model
    }


@router.post("/rss/test", response_model=Dict[str, Any])
async def test_rss_source(
    rss_url: str,
    _: bool = Depends(verify_admin_access)
):
    """Tek bir RSS kaynağını test et"""
    try:
        articles = crawler.sync_fetch_rss(rss_url)
        
        return {
            "rss_url": rss_url,
            "articles_found": len(articles),
            "articles": [
                {
                    "title": article["title"],
                    "category": article["category"],
                    "source": article["source"]
                }
                for article in articles
            ]
        }
    except Exception as e:
        logger.error(f"RSS test hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RSS test hatası: {str(e)}"
        )


@router.post("/ai/test", response_model=Dict[str, Any])
async def test_ai_summarizer(
    request: AITestRequest,
    _: bool = Depends(verify_admin_access)
):
    """Gemini AI özetleyiciyi test et"""
    try:
        summary = summarizer.sync_summarize(request.title, request.content)
        
        # Bağlantı testini de yap
        connection_test = summarizer.test_connection()
        
        return {
            "model": "Google Gemini 1.5 Flash",
            "connection_status": "✅ Başarılı" if connection_test else "❌ Başarısız",
            "original_title": request.title,
            "original_content": request.content[:200] + "..." if len(request.content) > 200 else request.content,
            "summary": summary,
            "summary_length": len(summary)
        }
    except Exception as e:
        logger.error(f"Gemini AI test hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gemini AI test hatası: {str(e)}"
        )


@router.get("/logs", response_model=List[str])
async def get_recent_logs(
    lines: int = 50,
    _: bool = Depends(verify_admin_access)
):
    """Son log kayıtlarını al"""
    try:
        # Bu basit bir implementasyon, gerçek projede log dosyalarından okuma yapılabilir
        return [
            f"[INFO] Sistem çalışıyor - {lines} satır log istendi",
            "[INFO] Bu özellik geliştirilme aşamasında",
            "[WARNING] Gerçek log implementasyonu için log dosyası konfigürasyonu gerekli"
        ]
    except Exception as e:
        logger.error(f"Log alma hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Log kayıtları alınamadı"
        ) 