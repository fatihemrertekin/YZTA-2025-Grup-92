"""
E-posta digest geçmişi modeli
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from app.core.database import Base


# SQLAlchemy Model
class DigestHistory(Base):
    __tablename__ = "digest_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_ids = Column(JSON, default=list)  # Gönderilen makale ID'leri
    digest_type = Column(String, default="daily")  # "daily" veya "weekly"
    sent_at = Column(DateTime, default=datetime.utcnow)
    email_status = Column(String, default="sent")  # "sent", "failed", "pending"
    
    # Relationships
    user = relationship("User", back_populates="digest_history")


# Pydantic Schemas
class DigestHistoryBase(BaseModel):
    user_id: int
    article_ids: List[int] = Field(default=[])
    digest_type: str = Field(default="daily", pattern="^(daily|weekly)$")


# E-posta için Digest Modeli
class EmailDigest(BaseModel):
    """E-posta gönderimi için digest yapısı"""
    user_email: str
    digest_type: str
    articles: List[dict]  # Article summary'leri
    sent_date: datetime
    
    def to_html(self) -> str:
        """HTML e-posta formatına çevir"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Tech News Digest - {self.sent_date.strftime('%d.%m.%Y')}</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2c3e50; color: white; padding: 20px; text-align: center; }}
                .article {{ border-bottom: 1px solid #eee; padding: 20px 0; }}
                .article h3 {{ color: #2c3e50; margin-bottom: 10px; }}
                .article .meta {{ color: #666; font-size: 0.9em; margin-bottom: 10px; }}
                .article .summary {{ margin-bottom: 10px; }}
                .read-more {{ color: #3498db; text-decoration: none; }}
                .footer {{ text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; }}
                .category {{ background: #3498db; color: white; padding: 3px 8px; border-radius: 3px; font-size: 0.8em; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Tech News Digest</h1>
                    <p>{self.sent_date.strftime('%d %B %Y')} - {self.digest_type.title()} Özet</p>
                </div>
                
                <div class="content">
        """
        
        # Kategorilere göre makaleleri grupla
        categories = {}
        for article in self.articles:
            cat = article.get('category', 'Other')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(article)
        
        # Her kategori için makaleleri ekle
        for category, articles in categories.items():
            html_content += f"""
                <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                    📂 {category}
                </h2>
            """
            
            for article in articles:
                html_content += f"""
                <div class="article">
                    <h3><a href="{article['link']}" style="color: #2c3e50; text-decoration: none;">{article['title']}</a></h3>
                    <div class="meta">
                        <span class="category">{article['category']}</span> | 
                        📰 {article['source']} | 
                        📅 {article.get('published_at', '').split('T')[0] if article.get('published_at') else ''}
                    </div>
                    <div class="summary">{article.get('summary', 'Özet mevcut değil.')}</div>
                    <a href="{article['link']}" class="read-more">Devamını Oku →</a>
                </div>
                """
        
        html_content += """
                </div>
                
                <div class="footer">
                    <p>Bu e-posta Tech News Digest sistemi tarafından otomatik olarak gönderilmiştir.</p>
                    <p>📧 Aboneliğinizi yönetmek için <a href="#">buraya tıklayın</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html_content


# Firestore Document Schema
class DigestHistoryFirestore(BaseModel):
    """Firestore için digest history document yapısı"""
    user_id: str  # Firestore'da string ID kullanırız
    article_ids: List[str]
    digest_type: str
    sent_at: datetime
    email_status: str = "sent"
    
    def to_dict(self) -> dict:
        """Firestore'a kaydetmek için dict'e çevir"""
        data = self.dict()
        data["sent_at"] = self.sent_at
        return data
    
 