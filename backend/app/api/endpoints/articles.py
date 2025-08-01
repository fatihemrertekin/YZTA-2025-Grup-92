"""
Makale API Endpoints
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_
from loguru import logger

from app.api.deps import get_async_db, get_database_type
from app.models.article import Article, ArticleResponse, ArticleSummary
from app.services.rss_crawler import crawler
from app.services.ai_summarizer import summarizer
from app.services.scheduler import scheduler_service

router = APIRouter()


@router.get("/", response_model=List[ArticleResponse])
async def get_articles(
    category: Optional[str] = Query(None, description="Kategori filtresi"),
    limit: int = Query(20, le=100, description="Makale sayısı limiti"),
    offset: int = Query(0, description="Atlama sayısı"),
    hours: int = Query(24, le=168, description="Son X saatteki makaleler"),
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """Makaleleri listele"""
    try:
        if db_type == "postgresql":
            return await get_articles_postgresql(category, limit, offset, hours, db)
        elif db_type == "firestore":
            return await get_articles_firestore(category, limit, offset, hours, db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
    except Exception as e:
        logger.error(f"Makale listeleme hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Makale listeleme sırasında hata oluştu"
        )


async def get_articles_postgresql(
    category: Optional[str], 
    limit: int, 
    offset: int, 
    hours: int, 
    db: AsyncSession
) -> List[ArticleResponse]:
    """PostgreSQL'den makaleleri al"""
    cutoff_date = datetime.now() - timedelta(hours=hours)
    
    query = select(Article).where(
        and_(
            Article.published_at >= cutoff_date,
            Article.processed == 1
        )
    )
    
    if category:
        query = query.where(Article.category == category)
    
    query = query.order_by(desc(Article.published_at)).offset(offset).limit(limit)
    
    result = await db.execute(query)
    articles = result.scalars().all()
    
    return [ArticleResponse.from_orm(article) for article in articles]


async def get_articles_firestore(
    category: Optional[str], 
    limit: int, 
    offset: int, 
    hours: int, 
    db
) -> List[Dict[str, Any]]:
    """Firestore'dan makaleleri al"""
    cutoff_date = datetime.now() - timedelta(hours=hours)
    
    articles_ref = db.collection('articles')
    query = articles_ref.where('published_at', '>=', cutoff_date).where('processed', '==', 1)
    
    if category:
        query = query.where('category', '==', category)
    
    query = query.order_by('published_at', direction='DESCENDING').offset(offset).limit(limit)
    
    docs = query.stream()
    articles = []
    
    for doc in docs:
        article_data = doc.to_dict()
        article_data['id'] = doc.id
        articles.append(article_data)
    
    return articles


@router.get("/categories", response_model=List[str])
async def get_categories():
    """Mevcut kategorileri listele"""
    return ["AI", "Software", "Hardware", "Other"]


@router.get("/summary", response_model=List[ArticleSummary])
async def get_articles_summary(
    categories: Optional[str] = Query(None, description="Kategori filtresi (virgülle ayrılmış)"),
    hours: int = Query(24, le=168, description="Son X saatteki makaleler"),
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """Makale özetlerini al (e-posta digest formatında)"""
    try:
        # Kategori listesini parse et
        category_list = []
        if categories:
            category_list = [cat.strip() for cat in categories.split(",")]
        
        if db_type == "postgresql":
            articles = await get_summary_postgresql(category_list, hours, db)
        elif db_type == "firestore":
            articles = await get_summary_firestore(category_list, hours, db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
        
        return [
            ArticleSummary(
                title=article["title"],
                link=article["link"],
                summary=article.get("summary", "Özet mevcut değil"),
                source=article["source"],
                published_at=article["published_at"] if isinstance(article["published_at"], datetime) 
                         else datetime.fromisoformat(article["published_at"].replace('Z', '+00:00'))
            )
            for article in articles
        ]
        
    except Exception as e:
        logger.error(f"Özet alma hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Özet alma sırasında hata oluştu"
        )


async def get_summary_postgresql(category_list: List[str], hours: int, db: AsyncSession) -> List[Dict]:
    """PostgreSQL'den özet verilerini al"""
    cutoff_date = datetime.now() - timedelta(hours=hours)
    
    query = select(Article).where(
        and_(
            Article.published_at >= cutoff_date,
            Article.processed == 1
        )
    )
    
    if category_list:
        query = query.where(Article.category.in_(category_list))
    
    query = query.order_by(desc(Article.published_at))
    
    result = await db.execute(query)
    articles = result.scalars().all()
    
    return [
        {
            "id": article.id,
            "title": article.title,
            "link": article.link,
            "summary": article.summary,
            "source": article.source,
            "category": article.category,
            "published_at": article.published_at
        }
        for article in articles
    ]


async def get_summary_firestore(category_list: List[str], hours: int, db) -> List[Dict]:
    """Firestore'dan özet verilerini al"""
    cutoff_date = datetime.now() - timedelta(hours=hours)
    
    articles_ref = db.collection('articles')
    query = articles_ref.where('published_at', '>=', cutoff_date).where('processed', '==', 1)
    
    if category_list:
        query = query.where('category', 'in', category_list)
    
    query = query.order_by('published_at', direction='DESCENDING')
    
    docs = query.stream()
    articles = []
    
    for doc in docs:
        article_data = doc.to_dict()
        article_data['id'] = doc.id
        articles.append(article_data)
    
    return articles


@router.post("/crawl", response_model=Dict[str, Any])
async def trigger_crawl():
    """RSS taramayı manuel olarak başlat"""
    try:
        logger.info("Manuel RSS tarama başlatılıyor...")
        
        async with crawler:
            articles = await crawler.crawl_all_sources()
        
        if not articles:
            return {
                "message": "Hiç yeni makale bulunamadı",
                "articles_found": 0,
                "articles_processed": 0
            }
        
        # Makaleleri özetle
        summarized_articles = await summarizer.summarize_articles_batch(articles)
        
        # Veritabanına kaydet
        await scheduler_service.save_articles_to_db(summarized_articles)
        
        # Başarıyla işlenen makale sayısı
        processed_count = sum(1 for article in summarized_articles if article.get("processed") == 1)
        
        return {
            "message": "RSS tarama tamamlandı",
            "articles_found": len(articles),
            "articles_processed": processed_count,
            "articles": [
                {
                    "title": article["title"],
                    "category": article["category"],
                    "source": article["source"]
                }
                for article in summarized_articles[:10]  # İlk 10 makaleyi göster
            ]
        }
        
    except Exception as e:
        logger.error(f"Manuel crawl hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RSS tarama sırasında hata oluştu: {str(e)}"
        )


@router.get("/stats", response_model=Dict[str, Any])
async def get_article_stats(
    db: AsyncSession = Depends(get_async_db),
    db_type: str = Depends(get_database_type)
):
    """Makale istatistikleri"""
    try:
        if db_type == "postgresql":
            return await get_article_stats_postgresql(db)
        elif db_type == "firestore":
            return await get_article_stats_firestore(db)
        else:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Desteklenmeyen veritabanı türü"
            )
    except Exception as e:
        logger.error(f"Makale istatistik hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="İstatistik alma sırasında hata oluştu"
        )


async def get_article_stats_postgresql(db: AsyncSession) -> Dict[str, Any]:
    """PostgreSQL makale istatistikleri"""
    from sqlalchemy import func
    
    # Son 24 saatteki makaleler
    last_24h = datetime.now() - timedelta(hours=24)
    
    # Toplam makale sayısı
    total_result = await db.execute(select(func.count(Article.id)))
    total_articles = total_result.scalar()
    
    # Son 24 saatteki makale sayısı
    recent_result = await db.execute(
        select(func.count(Article.id)).where(Article.published_at >= last_24h)
    )
    recent_articles = recent_result.scalar()
    
    # İşlenmiş makale sayısı
    processed_result = await db.execute(
        select(func.count(Article.id)).where(Article.processed == 1)
    )
    processed_articles = processed_result.scalar()
    
    # Kategoriye göre dağılım
    category_result = await db.execute(
        select(Article.category, func.count(Article.id))
        .where(Article.published_at >= last_24h)
        .group_by(Article.category)
    )
    
    category_stats = {}
    for category, count in category_result.all():
        category_stats[category] = count
    
    return {
        "total_articles": total_articles,
        "recent_articles": recent_articles,
        "processed_articles": processed_articles,
        "processing_rate": round((processed_articles / total_articles * 100), 2) if total_articles > 0 else 0,
        "category_distribution": category_stats
    }


async def get_article_stats_firestore(db) -> Dict[str, Any]:
    """Firestore makale istatistikleri"""
    last_24h = datetime.now() - timedelta(hours=24)
    
    articles_ref = db.collection('articles')
    
    # Tüm makaleleri al
    all_articles = list(articles_ref.stream())
    total_articles = len(all_articles)
    
    # Son 24 saatteki ve işlenmiş makaleleri say
    recent_articles = 0
    processed_articles = 0
    category_stats = {}
    
    for article in all_articles:
        article_data = article.to_dict()
        
        # İşlenmiş makale kontrolü
        if article_data.get('processed') == 1:
            processed_articles += 1
        
        # Son 24 saat kontrolü
        published_at = article_data.get('published_at')
        if published_at and published_at >= last_24h:
            recent_articles += 1
            
            # Kategori sayımı
            category = article_data.get('category', 'Other')
            category_stats[category] = category_stats.get(category, 0) + 1
    
    return {
        "total_articles": total_articles,
        "recent_articles": recent_articles,
        "processed_articles": processed_articles,
        "processing_rate": round((processed_articles / total_articles * 100), 2) if total_articles > 0 else 0,
        "category_distribution": category_stats
    } 