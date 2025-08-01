"""
Kullanıcı API Endpoints
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from loguru import logger

from app.api.deps import get_async_db, get_database_type
from app.models.user import User, UserCreate, UserUpdate, UserResponse, UserFirestore
from app.services.nodemailer_service import email_service
from app.core.config import settings

router = APIRouter()


@router.get("/find/{email}", response_model=Dict[str, Any])
async def find_user_by_email(
    email: str,
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """E-posta ile kullanıcı bul"""
    try:
        if db_type == "postgresql":
            return await find_user_postgresql(email, db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
    except Exception as e:
        logger.error(f"Kullanıcı bulma hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Kullanıcı bulma sırasında hata oluştu"
        )


async def find_user_postgresql(email: str, db: AsyncSession) -> Dict[str, Any]:
    """PostgreSQL ile kullanıcı bulma"""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kullanıcı bulunamadı"
        )
    
    return {
        "message": "Kullanıcı bulundu",
        "user": UserResponse.from_orm(user).dict()
    }


@router.post("/subscribe", response_model=Dict[str, Any])
async def subscribe_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """Yeni kullanıcı kaydı"""
    try:
        if db_type == "postgresql":
            return await subscribe_user_postgresql(user_data, db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
    except Exception as e:
        logger.error(f"Kullanıcı kaydı hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Kullanıcı kaydı sırasında hata oluştu"
        )


async def subscribe_user_postgresql(user_data: UserCreate, db: AsyncSession) -> Dict[str, Any]:
    """PostgreSQL ile kullanıcı kaydı"""
    # Mevcut kullanıcı kontrolü
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        if existing_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu e-posta adresi zaten kayıtlı"
            )
        else:
            # Pasif kullanıcıyı aktif et
            existing_user.is_active = True
            existing_user.selected_categories = user_data.selected_categories
            existing_user.frequency = user_data.frequency
            await db.commit()
            await db.refresh(existing_user)
            
            user_response = UserResponse.from_orm(existing_user)
    else:
        # Yeni kullanıcı oluştur
        new_user = User(**user_data.dict())
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        user_response = UserResponse.from_orm(new_user)
    
    # Hoş geldiniz e-postası gönder
    try:
        await email_service.send_welcome_email(user_data.email)
    except Exception as e:
        logger.warning(f"Hoş geldiniz e-postası gönderilemedi: {e}")
    
    return {
        "message": "Başarıyla abone oldunuz!",
        "user": user_response.dict()
    }

@router.put("/{user_id}", response_model=Dict[str, Any])
async def update_user_preferences(
    user_id: str,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """Kullanıcı tercihlerini güncelle"""
    try:
        if db_type == "postgresql":
            return await update_user_postgresql(int(user_id), user_update, db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz kullanıcı ID"
        )
    except Exception as e:
        logger.error(f"Kullanıcı güncelleme hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Kullanıcı güncelleme sırasında hata oluştu"
        )


async def update_user_postgresql(user_id: int, user_update: UserUpdate, db: AsyncSession) -> Dict[str, Any]:
    """PostgreSQL ile kullanıcı güncelleme"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kullanıcı bulunamadı"
        )
    
    # Güncelleme verilerini uygula
    update_data = user_update.dict(exclude_unset=True)
    
    # Türkçe frequency değerlerini İngilizce'ye çevir
    if 'frequency' in update_data and update_data['frequency']:
        frequency_map = {
            'günlük': 'daily',
            'haftalık': 'weekly'
        }
        if update_data['frequency'] in frequency_map:
            update_data['frequency'] = frequency_map[update_data['frequency']]
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    return {
        "message": "Kullanıcı tercihleri güncellendi",
        "user": UserResponse.from_orm(user).dict()
    }

@router.delete("/{user_id}")
async def unsubscribe_user(
    user_id: str,
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """Kullanıcı aboneliğini iptal et"""
    logger.info(f"Abonelik iptal isteği alındı, user_id: {user_id}")
    try:
        if db_type == "postgresql":
            return await unsubscribe_user_postgresql(int(user_id), db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
    except ValueError:
        logger.error(f"Geçersiz kullanıcı ID: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz kullanıcı ID"
        )
    except Exception as e:
        logger.error(f"Abonelik iptali hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Abonelik iptali sırasında hata oluştu"
        )


async def unsubscribe_user_postgresql(user_id: int, db: AsyncSession) -> Dict[str, str]:
    """PostgreSQL ile abonelik iptali"""
    logger.info(f"PostgreSQL abonelik iptali başlatıldı, user_id: {user_id}")
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        logger.error(f"Kullanıcı bulunamadı, user_id: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kullanıcı bulunamadı"
        )
    
    logger.info(f"Kullanıcı bulundu, email: {user.email}, is_active: {user.is_active}")
    user.is_active = False
    await db.commit()
    logger.info(f"Kullanıcı aboneliği iptal edildi, user_id: {user_id}")
    
    return {"message": "Aboneliğiniz başarıyla iptal edildi"}


@router.get("/stats", response_model=Dict[str, Any])
async def get_user_stats(
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """Kullanıcı istatistikleri"""
    try:
        if db_type == "postgresql":
            return await get_user_stats_postgresql(db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
    except Exception as e:
        logger.error(f"İstatistik alma hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="İstatistik alma sırasında hata oluştu"
        )


async def get_user_stats_postgresql(db: AsyncSession) -> Dict[str, Any]:
    """PostgreSQL kullanıcı istatistikleri"""
    from sqlalchemy import func
    
    # Toplam kullanıcı sayısı
    total_result = await db.execute(select(func.count(User.id)))
    total_users = total_result.scalar()
    
    # Aktif kullanıcı sayısı
    active_result = await db.execute(select(func.count(User.id)).where(User.is_active == True))
    active_users = active_result.scalar()
    
    # Kategori tercihleri
    category_result = await db.execute(select(User.selected_categories).where(User.is_active == True))
    categories = category_result.scalars().all()
    
    category_stats = {}
    for user_categories in categories:
        if user_categories:
            for category in user_categories:
                category_stats[category] = category_stats.get(category, 0) + 1
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": total_users - active_users,
        "category_preferences": category_stats
    }