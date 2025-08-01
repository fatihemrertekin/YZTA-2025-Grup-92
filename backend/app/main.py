"""
Tech News Digest Backend
FastAPI tabanlı haber toplama ve e-posta gönderme sistemi
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import settings
from app.core.database import db_manager
from app.services.scheduler import scheduler_service
from app.api.endpoints import users, articles, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Uygulama başlatma ve kapatma olayları"""
    # Başlatma
    logger.info(f"🚀 {settings.app_name} v{settings.app_version} başlatılıyor...")
    logger.info(f"🌍 Çevre: {settings.environment}")
    logger.info(f"💾 Veritabanı: {settings.database_type}")
    
    try:
        # Veritabanını başlat
        db_manager.init_database()
        
        # PostgreSQL için tabloları oluştur
        if settings.database_type == "postgresql":
            db_manager.create_tables()
        
        # Scheduler'ı başlat (her ortamda)
        scheduler_service.start_scheduler()
        logger.info("📅 Scheduler başlatıldı")
        
        logger.info("✅ Sistem başarıyla başlatıldı")
        
    except Exception as e:
        logger.error(f"❌ Sistem başlatma hatası: {e}")
        raise
    
    yield
    
    # Kapatma
    logger.info("🔄 Sistem kapatılıyor...")
    
    try:
        # Scheduler'ı durdur
        if scheduler_service.is_running:
            scheduler_service.stop_scheduler()
            logger.info("📅 Scheduler durduruldu")
        
        logger.info("✅ Sistem başarıyla kapatıldı")
        
    except Exception as e:
        logger.error(f"❌ Sistem kapatma hatası: {e}")


# FastAPI uygulaması
app = FastAPI(
    title=settings.app_name,
    description="""
    🚀 **Tech News Digest Backend**
    
    Teknoloji haberlerini toplar, AI ile özetler ve e-posta ile gönderir.
    
    ## 🔧 Özellikler
    - RSS kaynaklarından otomatik haber toplama
    - Google Gemini AI ile makale özetleme
    - SendGrid ile HTML e-posta gönderimi
    - Kullanıcı tercihlerine göre kategori filtresi
    - Günlük/haftalık digest seçenekleri
    - PostgreSQL ve Firestore desteği
    
    ## 📡 API Endpoints
    - **Users**: Kullanıcı yönetimi ve abonelik işlemleri
    - **Articles**: Makale listeleme ve RSS tarama
    - **Admin**: Sistem yönetimi ve monitoring
    """,
    version=settings.app_version,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan
)

# CORS Middleware
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.debug else ["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
"""

# CORS Middleware - Frontend URL'lerini ekleyin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "http://localhost:5173",  # Vite dev server
        "https://your-frontend-app.onrender.com",  # Frontend production URL
        "https://your-frontend-app.vercel.app",    # Vercel URL
        "https://your-frontend-app.netlify.app",   # Netlify URL
        "*" if settings.debug else []  # Development'da tüm origin'lere izin ver
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router'ları dahil et
app.include_router(
    users.router,
    prefix="/api/v1/users",
    tags=["👥 Users"],
    responses={404: {"description": "Not found"}}
)

app.include_router(
    articles.router,
    prefix="/api/v1/articles",
    tags=["📰 Articles"],
    responses={404: {"description": "Not found"}}
)

app.include_router(
    admin.router,
    prefix="/api/v1/admin",
    tags=["🔧 Admin"],
    responses={404: {"description": "Not found"}}
)


@app.get("/", response_model=dict)
async def root():
    """Ana sayfa - API bilgileri"""
    return {
        "message": f"🚀 {settings.app_name} API",
        "version": settings.app_version,
        "environment": settings.environment,
        "database": settings.database_type,
        "docs": "/docs" if settings.debug else "Disabled in production",
        "status": "✅ Active"
    }


@app.get("/health", response_model=dict)
async def health_check():
    """Sağlık kontrolü"""
    try:
        # Temel sistem kontrolleri
        health_status = {
            "status": "healthy",
            "database": "connected",
            "scheduler": "active" if scheduler_service.is_running else "inactive",
            "version": settings.app_version
        }
        
        return health_status
        
    except Exception as e:
        logger.error(f"Health check hatası: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")


@app.get("/api/v1", response_model=dict)
async def api_info():
    """API v1 bilgileri"""
    return {
        "version": "1.0",
        "endpoints": {
            "users": "/api/v1/users",
            "articles": "/api/v1/articles", 
            "admin": "/api/v1/admin"
        },
        "features": [
            "RSS crawling",
            "AI summarization",
            "Email notifications",
            "User management",
            "Scheduled tasks"
        ]
    }


# Hata yakalayıcıları
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "error": "Not Found",
        "message": "İstenen kaynak bulunamadı",
        "status_code": 404
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return {
        "error": "Internal Server Error",
        "message": "Sunucu hatası oluştu",
        "status_code": 500
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    ) 