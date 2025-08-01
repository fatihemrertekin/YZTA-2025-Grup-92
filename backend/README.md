# 🚀 Tech News Digest Backend

Teknoloji haberlerini RSS kaynaklarından toplayan, AI ile özetleyen ve e-posta ile gönderen FastAPI tabanlı backend sistemi.

## 📋 Özellikler

- 🔄 **RSS Crawler**: Otomatik haber toplama
- 🤖 **AI Özetleme**: Google Gemini AI ile makale özetleme
- 📧 **E-posta Gönderimi**: Gmail SMTP
- 👥 **Kullanıcı Yönetimi**: Abonelik ve tercih yönetimi
- 📅 **Scheduler**: Günlük otomatik görevler
- 💾 **Çift Veritabanı**: PostgreSQL
- 🏷️ **Kategori Filtresi**: AI, Yazılım, Donanım kategorileri

## 🛠️ Teknoloji Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL
- **Scheduler**: APScheduler
- **AI**: Google Gemini 1.5 Flash (Ücretsiz! 🎉)
- **Email**: Gmail SMTP
- **Container**: Docker & Docker Compose

## 🚀 Hızlı Başlangıç

### 1. Repo'yu Klonlayın
```bash
git clone <repo-url>
cd backend
```

### 2. Çevre Değişkenlerini Ayarlayın
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

**ÖNEMLİ**: Google Gemini API key almayı unutmayın! [Detaylı rehber için GEMINI_SETUP.md dosyasını okuyun](./GEMINI_SETUP.md)

### 3. Docker ile Başlatın
```bash
docker-compose up -d
```

### 4. API'yi Test Edin
```bash
curl http://localhost:8000/health
```

## ⚙️ Konfigürasyon

### Çevre Değişkenleri (.env)

```env
# Veritabanı
DATABASE_TYPE=postgresql  # postgresql
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Google Gemini AI (ÜCRETSIZ!)
GEMINI_API_KEY=your-gemini-api-key  # Google AI Studio'dan alın
GEMINI_MODEL=gemini-1.5-flash

# RSS Kaynakları
RSS_SOURCES=https://techcrunch.com/feed/,https://www.theverge.com/rss/index.xml
```

### 🔑 Gemini API Key Alma

**Google Gemini tamamen ücretsiz!** API key almak için:

1. [Google AI Studio](https://aistudio.google.com/) adresine gidin
2. Gmail hesabınızla giriş yapın
3. "Get API Key" → "Create API Key" 
4. API key'i kopyalayıp `.env` dosyasına ekleyin

📖 **Detaylı rehber**: [GEMINI_SETUP.md](./GEMINI_SETUP.md) dosyasını okuyun!

### Veritabanı Seçimi

#### PostgreSQL (Önerilen)
```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:pass@localhost:5432/tech_news_db
```

## 📡 API Endpoints

### 👥 Kullanıcı Yönetimi
- `POST /api/v1/users/subscribe` - Kullanıcı kaydı
- `PUT /api/v1/users/{user_id}` - Tercih güncelleme
- `DELETE /api/v1/users/{user_id}` - Abonelik iptali
- `GET /api/v1/users/stats` - Kullanıcı istatistikleri

### 📰 Makale Yönetimi
- `GET /api/v1/articles/` - Makale listesi
- `GET /api/v1/articles/summary` - E-posta digest formatı
- `POST /api/v1/articles/crawl` - Manuel RSS tarama
- `GET /api/v1/articles/stats` - Makale istatistikleri

### 🔧 Admin Paneli
- `GET /api/v1/admin/status` - Sistem durumu
- `POST /api/v1/admin/scheduler/start` - Scheduler başlat
- `POST /api/v1/admin/crawl/run` - Manuel tarama
- `POST /api/v1/admin/ai/test` - Gemini AI testi 🤖
- `POST /api/v1/admin/email/test` - E-posta testi

## 🔄 Scheduler Görevleri

Sistem otomatik olarak şu görevleri çalıştırır:

- **08:00** - RSS tarama ve makale işleme
- **08:10** - Günlük digest gönderimi

### Manuel Görev Çalıştırma
```python
from app.services.scheduler import scheduler_service

# Manuel RSS tarama
await scheduler_service.crawl_and_process_news()

# Manuel digest gönderimi
await scheduler_service.send_daily_digests()
```

## 🧪 Test Etme

### API Testleri
```bash
# Sağlık kontrolü
curl http://localhost:8000/health

# Makale listesi
curl http://localhost:8000/api/v1/articles/

# Kullanıcı kaydı
curl -X POST http://localhost:8000/api/v1/users/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "selected_categories": ["AI", "Software"]}'
```

### Gemini AI Testi 🤖
```bash
# Gemini AI özetleyiciyi test et
curl -X POST http://localhost:8000/api/v1/admin/ai/test \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yapay Zeka Haberi",
    "content": "Bu makale yapay zeka teknolojilerindeki son gelişmeler hakkında bilgi içerir."
  }'
```

### Admin Testleri
```bash
# RSS testi
curl -X POST "http://localhost:8000/api/v1/admin/rss/test?rss_url=https://techcrunch.com/feed/"

# E-posta testi
curl -X POST "http://localhost:8000/api/v1/admin/email/test?test_email=test@example.com"
```

## 🐳 Docker Servisleri

```yaml
services:
  backend:     # FastAPI uygulaması
  postgres:    # PostgreSQL veritabanı
  pgadmin:     # PostgreSQL yönetimi (localhost:5050)
```

### Servis URL'leri
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **pgAdmin**: http://localhost:5050 (admin@techdigest.com / admin123)

## 📊 Monitoring

### Sistem Durumu
```bash
curl http://localhost:8000/api/v1/admin/status
```

### Logs
```bash
# Docker logs
docker-compose logs backend

# Belirli servislerin logları
docker-compose logs postgres
```

## 🔧 Geliştirme

### Yerel Geliştirme
```bash
# Virtual environment oluştur
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Bağımlılıkları yükle
pip install -r requirements.txt

# Uygulamayı başlat
uvicorn app.main:app --reload
```

### Veritabanı Migrasyon
```bash
# PostgreSQL tabloları otomatik oluşturulur
# Manuel oluşturma için:
python -c "from app.core.database import db_manager; db_manager.init_database(); db_manager.create_tables()"
```

## 📁 Proje Yapısı

```
backend/
├── app/
│   ├── core/           # Konfigürasyon ve veritabanı
│   ├── models/         # Veri modelleri
│   ├── services/       # İş mantığı servisleri
│   ├── api/           # API endpoint'leri
│   ├── utils/         # Yardımcı fonksiyonlar
│   └── main.py        # Ana uygulama
├── requirements.txt    # Python bağımlılıkları
├── docker-compose.yml # Docker konfigürasyonu
├── Dockerfile         # Container tanımı
├── GEMINI_SETUP.md    # Gemini API kurulum rehberi
└── README.md          # Bu dosya
```

## 🆚 Neden Gemini? (vs OpenAI)

| Özellik | OpenAI GPT-4 | Google Gemini 1.5 Flash |
|---------|--------------|--------------------------|
| **💰 Maliyet** | Ücretli (~$50-100/ay) | ✅ **Tamamen Ücretsiz** |
| **⚡ Hız** | Orta | ✅ **Çok Hızlı** |
| **🏆 Kalite** | Yüksek | ✅ **Eşit Kalite** |
| **🇹🇷 Türkçe** | İyi | ✅ **Mükemmel** |
| **📊 Limit** | Ücrete göre | 1,500 istek/gün |

**Sonuç**: Gemini hem ücretsiz hem de harika! 🎉

## 🚨 Güvenlik

- API endpoint'leri için rate limiting eklenebilir
- Admin endpoint'leri için JWT authentication önerilir
- Production'da HTTPS kullanın
- Hassas bilgileri .env dosyasında saklayın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 License

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Sorun Giderme

### Yaygın Sorunlar

#### 1. Veritabanı Bağlantı Hatası
```bash
# PostgreSQL servisini kontrol edin
docker-compose logs postgres

# Bağlantı ayarlarını kontrol edin
echo $DATABASE_URL
```

#### 2. Gemini API Hatası
```bash
# API key'i kontrol edin
echo $GEMINI_API_KEY

# API limitini kontrol edin (ücretsiz: günde 1500 istek)
```

# From email doğrulamasını kontrol edin
```

### Debug Modu
```env
DEBUG=True
ENVIRONMENT=development
```

## 📞 İletişim

Sorular için issue açın veya iletişime geçin.

---

🚀 **Tech News Digest** - Gemini AI destekli haber sistemi ✨ 