"""
Veritabanı bağlantısı ve konfigürasyonu
"""
from typing import Optional, AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import settings
from loguru import logger

# SQLAlchemy Base
Base = declarative_base()

# PostgreSQL Configuration
class PostgreSQLDatabase:
    def __init__(self):
        self.engine = None
        self.async_engine = None
        self.SessionLocal = None
        self.AsyncSessionLocal = None
        
    def init_db(self):
        """PostgreSQL veritabanını başlat"""
        if not settings.database_url:
            raise ValueError("DATABASE_URL bulunamadı!")
            
        # Sync engine
        self.engine = create_engine(settings.database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Async engine
        async_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")
        self.async_engine = create_async_engine(async_url)
        self.AsyncSessionLocal = async_sessionmaker(
            self.async_engine, class_=AsyncSession, expire_on_commit=False
        )
        
        logger.info("PostgreSQL veritabanı bağlantısı kuruldu")
    
    def create_tables(self):
        """Tabloları oluştur"""
        Base.metadata.create_all(bind=self.engine)
        logger.info("Veritabanı tabloları oluşturuldu")
    
    def get_db(self) -> Session:
        """Sync database session"""
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    async def get_async_db(self) -> AsyncGenerator[AsyncSession, None]:
        """Async database session"""
        async with self.AsyncSessionLocal() as session:
            yield session


# Database Factory
class DatabaseManager:
    def __init__(self):
        self.postgresql_db: Optional[PostgreSQLDatabase] = None
        
    def init_database(self):
        """Konfigürasyona göre veritabanını başlat"""
        if settings.database_type == "postgresql":
            self.postgresql_db = PostgreSQLDatabase()
            self.postgresql_db.init_db()
        else:
            raise ValueError(f"Desteklenmeyen veritabanı türü: {settings.database_type}")
    
    def create_tables(self):
        """Tabloları oluştur (sadece PostgreSQL için)"""
        if self.postgresql_db:
            self.postgresql_db.create_tables()
    
    def get_db(self):
        """Aktif veritabanı session'ını döndür"""
        if settings.database_type == "postgresql":
            return self.postgresql_db.get_db()
    
    async def get_async_db(self):
        """Async veritabanı session'ını döndür"""
        if settings.database_type == "postgresql":
            async for session in self.postgresql_db.get_async_db():
                yield session


# Global database manager
db_manager = DatabaseManager() 