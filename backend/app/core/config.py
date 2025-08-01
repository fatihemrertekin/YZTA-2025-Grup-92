"""
Uygulama konfigürasyon ayarları
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Uygulama ayarları"""
    
    # Uygulama Ayarları
    app_name: str = Field(default="Tech News Digest", env="APP_NAME")
    app_version: str = Field(default="1.0.0", env="APP_VERSION")
    debug: bool = Field(default=False, env="DEBUG")
    environment: str = Field(default="production", env="ENVIRONMENT")
    
    # Güvenlik
    secret_key: str = Field(default="dev-secret-key-change-in-production", env="SECRET_KEY")
    algorithm: str = Field(default="HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # Veritabanı
    database_type: str = Field(default="postgresql", env="DATABASE_TYPE")  # postgresql veya firestore
    database_url: Optional[str] = Field(default=None, env="DATABASE_URL")
    
    # Google Gemini AI
    gemini_api_key: str = Field(default="test-key", env="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-1.5-flash", env="GEMINI_MODEL")
    
    # E-posta (NodeMailer SMTP - Docker)
    smtp_server: str = Field(default="smtp.gmail.com", env="SMTP_SERVER")
    smtp_port: int = Field(default=587, env="SMTP_PORT")
    smtp_username: str = Field(default="your_email@gmail.com", env="SMTP_USERNAME")
    smtp_password: str = Field(default="your_app_password", env="SMTP_PASSWORD")
    from_email: str = Field(default="your_email@gmail.com", env="FROM_EMAIL")
    from_name: str = Field(default="Tech News Digest", env="FROM_NAME")
    
    # Scheduler
    daily_crawl_hour: int = Field(default=2, env="DAILY_CRAWL_HOUR")
    daily_crawl_minute: int = Field(default=4, env="DAILY_CRAWL_MINUTE")
    daily_digest_hour: int = Field(default=2, env="DAILY_DIGEST_HOUR")
    daily_digest_minute: int = Field(default=5, env="DAILY_DIGEST_MINUTE")
    
    # RSS Kaynakları
    rss_sources: str = Field(
        default="https://techcrunch.com/feed/,https://www.theverge.com/rss/index.xml",
        env="RSS_SOURCES"
    )
    
    @property
    def rss_sources_list(self) -> List[str]:
        """RSS kaynaklarını liste olarak döndür"""
        return [source.strip() for source in self.rss_sources.split(",") if source.strip()]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings() 