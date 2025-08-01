"""
Kullanıcı modeli
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from app.core.database import Base


# SQLAlchemy Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    selected_categories = Column(JSON, default=list)  # ["AI", "Hardware", "Software"]
    frequency = Column(String, default="daily")  # "daily" veya "weekly"
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    last_digest_sent = Column(DateTime, nullable=True)
    
    # Relationships
    digest_history = relationship("DigestHistory", back_populates="user")


# Pydantic Schemas
class UserBase(BaseModel):
    email: str
    selected_categories: List[str] = Field(default=["Yapay Zeka", "Yazılım", "Donanım"])
    frequency: str = Field(default="daily", pattern="^(daily|weekly)$")


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    selected_categories: Optional[List[str]] = None
    frequency: Optional[str] = Field(None, pattern="^(daily|weekly|günlük|haftalık)$")
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    subscribed_at: datetime
    last_digest_sent: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Firestore Document Schema
class UserFirestore(BaseModel):
    """Firestore için kullanıcı document yapısı"""
    email: str
    is_active: bool = True
    selected_categories: List[str] = ["Yapay Zeka", "Yazılım", "Donanım"]
    frequency: str = "daily"
    subscribed_at: datetime
    last_digest_sent: Optional[datetime] = None
    
    def to_dict(self) -> dict:
        """Firestore'a kaydetmek için dict'e çevir"""
        data = self.dict()
        # Datetime objelerini timestamp'e çevir
        data["subscribed_at"] = self.subscribed_at
        if self.last_digest_sent:
            data["last_digest_sent"] = self.last_digest_sent
        return data
    
 