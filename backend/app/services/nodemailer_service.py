"""
NodeMailer E-posta Gönderme Servisi
SMTP üzerinden güvenilir e-posta gönderimi
"""
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Optional
from datetime import datetime
import asyncio
import re
from email.utils import parseaddr

from loguru import logger

from app.core.config import settings
from app.models.digest import EmailDigest


class NodeMailerService:
    """
    NodeMailer e-posta gönderme servisi
    SMTP üzerinden güvenilir e-posta gönderimi
    """
    
    def __init__(self):
        """NodeMailer servisini başlat"""
        try:
            # SMTP ayarları
            self.smtp_server = settings.smtp_server
            self.smtp_port = settings.smtp_port
            self.smtp_username = settings.smtp_username
            self.smtp_password = settings.smtp_password
            self.from_email = settings.from_email
            self.from_name = settings.from_name
            
            # Test modu kontrolü (Docker için)
            self.is_test_mode = (
                self.smtp_username == "your_email@gmail.com" or
                self.smtp_password == "your_app_password" or
                "your_" in self.smtp_username or
                "your_" in self.smtp_password
            )
            
            if self.is_test_mode:
                logger.info("🧪 NodeMailer test modu aktif - E-posta simülasyonu yapılacak")
                logger.info("ℹ️ Gerçek e-posta gönderimi için SMTP bilgilerini güncelleyin")
            else:
                logger.info(f"📧 NodeMailer servisi başlatıldı: {settings.from_email}")
                
        except Exception as e:
            logger.error(f"❌ NodeMailer servis başlatma hatası: {e}")
            raise
    
    def _validate_email(self, email: str) -> bool:
        """Email adresini doğrula"""
        if not email or not isinstance(email, str):
            return False
        
        # parseaddr kullanarak doğrula
        parsed = parseaddr(email)
        if not parsed[1]:
            return False
            
        # Basit regex kontrolü
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    def create_digest_html(self, user_email: str, articles: List[Dict], digest_type: str = "daily") -> str:
        """Digest için HTML e-posta içeriği oluştur"""
        digest = EmailDigest(
            user_email=user_email,
            digest_type=digest_type,
            articles=articles,
            sent_date=datetime.now()
        )
        
        return digest.to_html()
    
    def create_plain_text(self, articles: List[Dict], digest_type: str = "daily") -> str:
        """Plain text e-posta içeriği oluştur"""
        content = f"Tech News Digest - {digest_type.title()} Özet\n"
        content += "=" * 50 + "\n\n"
        
        # Kategorilere göre grupla
        categories = {}
        for article in articles:
            cat = article.get('category', 'Other')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(article)
        
        for category, articles_list in categories.items():
            content += f"\n📂 {category}\n"
            content += "-" * 30 + "\n"
            
            for article in articles_list:
                content += f"\n📰 {article['title']}\n"
                content += f"🔗 {article['link']}\n"
                content += f"📝 {article.get('summary', 'Özet mevcut değil.')}\n"
                content += f"📅 Kaynak: {article['source']}\n"
                content += "\n" + "-" * 50 + "\n"
        
        content += "\nBu e-posta Tech News Digest sistemi tarafından otomatik olarak gönderilmiştir.\n"
        
        return content
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        plain_content: str,
        max_retries: int = 3
    ) -> bool:
        """
        E-posta gönder - NodeMailer ile
        """
        # Email validation
        if not self._validate_email(to_email):
            logger.error(f"❌ Geçersiz email adresi: {to_email}")
            return False
        
        # Test modu kontrolü
        if self.is_test_mode:
            logger.info(f"📧 E-posta simülasyonu: {to_email}")
            logger.info(f"📧 Konu: {subject}")
            logger.info("ℹ️ Test modunda gerçek e-posta gönderimi yapılmıyor")
            logger.info("ℹ️ Gerçek e-posta gönderimi için SMTP bilgilerini güncelleyin")
            return True
        
        # Retry logic
        for attempt in range(max_retries):
            try:
                # E-posta mesajını oluştur
                message = MIMEMultipart("alternative")
                message["Subject"] = subject
                message["From"] = f"{self.from_name} <{self.from_email}>"
                message["To"] = to_email
                
                # HTML ve plain text içerikleri ekle
                text_part = MIMEText(plain_content, "plain", "utf-8")
                html_part = MIMEText(html_content, "html", "utf-8")
                
                message.attach(text_part)
                message.attach(html_part)
                
                # Docker için SMTP bağlantısı kur
                if self.smtp_port == 587:
                    # STARTTLS kullan (Docker için daha güvenli)
                    with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                        server.starttls(context=ssl.create_default_context())
                        server.login(self.smtp_username, self.smtp_password)
                        
                        # E-postayı gönder
                        server.sendmail(self.from_email, to_email, message.as_string())
                        
                        logger.info(f"✅ E-posta başarıyla gönderildi: {to_email}")
                        return True
                else:
                    # SSL kullan (465 portu için)
                    context = ssl.create_default_context()
                    
                    with smtplib.SMTP_SSL(self.smtp_server, self.smtp_port, context=context) as server:
                        server.login(self.smtp_username, self.smtp_password)
                        
                        # E-postayı gönder
                        server.sendmail(self.from_email, to_email, message.as_string())
                        
                        logger.info(f"✅ E-posta başarıyla gönderildi: {to_email}")
                        return True
                    
            except smtplib.SMTPAuthenticationError as e:
                logger.error(f"❌ SMTP kimlik doğrulama hatası ({to_email}): {e}")
                return False
                
            except smtplib.SMTPRecipientsRefused as e:
                logger.error(f"❌ Alıcı reddedildi ({to_email}): {e}")
                return False
                
            except smtplib.SMTPServerDisconnected as e:
                logger.error(f"❌ SMTP sunucu bağlantısı kesildi ({to_email}): {e}")
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) * 5  # 5, 10, 20 saniye
                    logger.info(f"⏳ Yeniden bağlanma {wait_time}s sonra... (deneme {attempt + 1})")
                    await asyncio.sleep(wait_time)
                    continue
                    
            except Exception as e:
                error_str = str(e) if e else "Unknown error"
                error_type = type(e).__name__ if e else "Unknown"
                logger.error(f"❌ E-posta gönderme hatası ({to_email}, deneme {attempt + 1}): {error_type}: {error_str}")
                
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) * 3  # 3, 6, 12 saniye
                    logger.info(f"⏳ Yeniden deneme {wait_time}s sonra... (deneme {attempt + 1})")
                    await asyncio.sleep(wait_time)
                    continue
        
        logger.error(f"💥 E-posta {max_retries} denemede gönderilemedi: {to_email}")
        return False
    
    async def send_digest_email(
        self, 
        user_email: str, 
        articles: List[Dict], 
        digest_type: str = "daily",
        max_retries: int = 3
    ) -> bool:
        """
        Digest e-postası gönder - NodeMailer ile
        """
        if not articles:
            logger.warning(f"⚠️ Boş makale listesi, e-posta gönderilmedi: {user_email}")
            return False
        
        # E-posta içeriğini oluştur
        html_content = self.create_digest_html(user_email, articles, digest_type)
        plain_content = self.create_plain_text(articles, digest_type)
        
        # E-posta konusu
        today = datetime.now().strftime("%d.%m.%Y")
        subject = f"🚀 Tech News Digest - {today} ({len(articles)} makale)"
        
        return await self.send_email(user_email, subject, html_content, plain_content, max_retries)
    
    async def send_welcome_email(self, user_email: str, max_retries: int = 3) -> bool:
        """
        Hoş geldiniz e-postası gönder - NodeMailer ile
        """
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Tech News Digest'e Hoş Geldiniz!</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2c3e50; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .feature {{ margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }}
                .footer {{ text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Tech News Digest'e Hoş Geldiniz!</h1>
                </div>
                
                <div class="content">
                    <p>Merhaba!</p>
                    
                    <p>Tech News Digest'e abone olduğunuz için teşekkür ederiz. Artık günlük olarak teknoloji dünyasından özenle seçilmiş ve AI ile özetlenmiş en önemli haberleri e-posta kutunuzda bulacaksınız.</p>
                    
                    <div class="feature">
                        <h3>🔥 Neler Sunuyoruz?</h3>
                        <ul>
                            <li><strong>Günlük Özet:</strong> Her sabah en önemli tech haberlerini alın</li>
                            <li><strong>AI Özetleri:</strong> Uzun makalelerin kısa ve öz özetleri</li>
                            <li><strong>Kategori Filtresi:</strong> AI, Yazılım, Donanım kategorilerinde</li>
                            <li><strong>Güvenilir Kaynaklar:</strong> TechCrunch, The Verge ve daha fazlası</li>
                        </ul>
                    </div>
                    
                    <p>İlk digest'iniz yarın sabah e-posta kutunuzda olacak! 📧</p>
                    
                    <p>İyi okumalar!</p>
                </div>
                
                <div class="footer">
                    <p>Tech News Digest Ekibi</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_content = f"""
        Tech News Digest'e Hoş Geldiniz!
        
        Merhaba!
        
        Tech News Digest'e abone olduğunuz için teşekkür ederiz. Artık günlük olarak teknoloji dünyasından özenle seçilmiş ve AI ile özetlenmiş en önemli haberleri e-posta kutunuzda bulacaksınız.
        
        Neler Sunuyoruz?
        - Günlük Özet: Her sabah en önemli tech haberlerini alın
        - AI Özetleri: Uzun makalelerin kısa ve öz özetleri  
        - Kategori Filtresi: AI, Yazılım, Donanım kategorilerinde
        - Güvenilir Kaynaklar: TechCrunch, The Verge ve daha fazlası
        
        İlk digest'iniz yarın sabah e-posta kutunuzda olacak!
        
        İyi okumalar!
        Tech News Digest Ekibi
        """
        
        subject = "🚀 Tech News Digest'e Hoş Geldiniz!"
        
        return await self.send_email(user_email, subject, html_content, plain_content, max_retries)


# Global email service instance
email_service = NodeMailerService() 