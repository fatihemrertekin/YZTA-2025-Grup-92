# Vercel Deployment Rehberi

## 1. Vercel'de Proje Oluşturma

1. **Vercel Dashboard'a gidin**: https://vercel.com/dashboard
2. **New Project** butonuna tıklayın
3. **Import Git Repository** seçin
4. GitHub repository'nizi seçin
5. **Framework Preset**: Vite seçin
6. **Root Directory**: `frontend` olarak ayarlayın

## 2. Environment Variables Ayarlama

Vercel'de proje ayarlarında **Environment Variables** bölümünde:

```
VITE_API_URL=https://tech-news-digest-backend.onrender.com
VITE_APP_NAME=Tech News Digest
VITE_APP_VERSION=1.0.0
```

## 3. Build Ayarları

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 4. Deploy

1. **Deploy** butonuna tıklayın
2. Build sürecini bekleyin
3. Deployment URL'yi not alın

## 5. Custom Domain (Opsiyonel)

1. **Settings** → **Domains**
2. **Add Domain** butonuna tıklayın
3. Domain adınızı girin
4. DNS ayarlarını yapın

## 6. Environment Kontrolü

### Development:
```bash
# Local development
npm run dev
# API URL: http://localhost:8000
```

### Production:
```bash
# Vercel'de otomatik deploy
# API URL: https://tech-news-digest-backend.onrender.com
```

## 7. Troubleshooting

### Build Hatası:
- Node.js versiyonunu kontrol edin (18+)
- Dependencies'leri kontrol edin
- Build loglarını inceleyin

### API Bağlantı Hatası:
- `VITE_API_URL` environment variable'ını kontrol edin
- Backend'in çalıştığından emin olun
- CORS ayarlarını kontrol edin

### CORS Hatası:
- Backend'de CORS ayarlarını kontrol edin
- Frontend URL'sini backend CORS listesine ekleyin

## 8. Monitoring

### Vercel Analytics:
- **Analytics** sekmesinde trafiği izleyin
- **Functions** sekmesinde API çağrılarını kontrol edin

### Error Tracking:
- Console'da hataları kontrol edin
- Network tab'ında API çağrılarını izleyin

## 9. Performance

### Optimizasyonlar:
- ✅ Code splitting aktif
- ✅ Lazy loading
- ✅ Image optimization
- ✅ CDN kullanımı

### Bundle Size:
- Vendor chunks ayrı
- UI library'ler optimize edildi
- Tree shaking aktif 