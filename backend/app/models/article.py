"""
Makale modeli
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Text, DateTime
from pydantic import BaseModel, HttpUrl, Field
from app.core.database import Base


# SQLAlchemy Model
class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    link = Column(String, unique=True, nullable=False)
    summary = Column(Text, nullable=True)
    original_content = Column(Text, nullable=True)
    category = Column(String, nullable=False, index=True)  # "AI", "Hardware", "Software"
    source = Column(String, nullable=False)  # RSS kaynağının adı
    published_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed = Column(Integer, default=0)  # 0: işlenmedi, 1: işlendi


# Pydantic Schemas
class ArticleBase(BaseModel):
    title: str = Field(..., max_length=500)
    link: str
    category: str = Field(..., pattern="^(AI|Yapay Zeka|Hardware|Donanım|Software|Yazılım|Other|Diğer)$")
    source: str
    published_at: datetime


class ArticleResponse(ArticleBase):
    id: int
    summary: Optional[str] = None
    created_at: datetime
    processed: int
    
    class Config:
        from_attributes = True


class ArticleSummary(BaseModel):
    """E-posta için makale özeti"""
    title: str
    link: str
    summary: str
    source: str
    published_at: datetime


# Firestore Document Schema
class ArticleFirestore(BaseModel):
    """Firestore için makale document yapısı"""
    title: str
    link: str
    summary: Optional[str] = None
    original_content: Optional[str] = None
    category: str
    source: str
    published_at: datetime
    created_at: datetime
    processed: int = 0
    
    def to_dict(self) -> dict:
        """Firestore'a kaydetmek için dict'e çevir"""
        data = self.dict()
        # Datetime objelerini timestamp'e çevir
        data["published_at"] = self.published_at
        data["created_at"] = self.created_at
        return data
    
 