"""
API Dependencies
Ortak bağımlılıklar ve yardımcı fonksiyonlar
"""
from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import db_manager
from app.core.config import settings


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """Async database dependency"""
    async for db in db_manager.get_async_db():
        yield db


def verify_admin_access():
    """Admin erişim kontrolü - development amaçlı basit kontrol"""
    # PRODUCTION: Bu fonksiyon JWT token doğrulaması ile değiştirilmeli!
    # Development ortamında sadece debug=True ise admin erişimi ver
    if not settings.debug:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin erişimi production'da kısıtlanmıştır"
        )
    return True


async def get_database_type() -> str:
    """Aktif veritabanı türünü döndür"""
    return settings.database_type 