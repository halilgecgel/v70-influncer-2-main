# Influencer Marketing Site

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/halilurf22-9772s-projects/v0-influencer-marketing-site)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/RaoHVluq9X9)

## Overview

Bu proje, influencer marketing platformu için geliştirilmiş modern bir web uygulamasıdır. MySQL veritabanı entegrasyonu ile dinamik slider yönetimi özelliği içerir.

## Özellikler

- 🎯 **Dinamik Slider**: MySQL veritabanından çekilen verilerle çalışan slider
- 🎨 **Modern UI**: Tailwind CSS ile tasarlanmış responsive arayüz
- 🔄 **Otomatik Geçiş**: Slider otomatik olarak resimler arasında geçiş yapar
- 📱 **Mobil Uyumlu**: Touch gesture desteği ile mobil cihazlarda kullanım
- 🛠️ **Admin API**: Slider yönetimi için RESTful API endpoints

## Kurulum

### Gereksinimler

- Node.js 18+
- MySQL 8.0+
- npm veya pnpm

### Adımlar

1. **Projeyi klonlayın:**
   ```bash
   git clone <repository-url>
   cd v70-influncer-2-main
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   # veya
   pnpm install
   ```

3. **Environment variables dosyası oluşturun:**
   ```bash
   # .env.local dosyası oluşturun
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=influencer_db
   DB_PORT=3306
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **MySQL veritabanını kurun:**
   ```bash
   # MySQL'de veritabanı oluşturun
   CREATE DATABASE influencer_db;
   ```

5. **Veritabanı tablolarını oluşturun:**
   ```bash
   npm run setup-db
   ```

6. **Uygulamayı başlatın:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Slider Yönetimi

- `GET /api/slider` - Tüm aktif slider resimlerini getir
- `POST /api/slider` - Yeni slider resmi ekle
- `PUT /api/slider` - Slider resmini güncelle
- `DELETE /api/slider?id={id}` - Slider resmini sil

### Örnek Kullanım

```javascript
// Slider verilerini çek
const response = await fetch('/api/slider')
const data = await response.json()

// Yeni resim ekle
const newImage = await fetch('/api/slider', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image_url: '/new-image.jpg',
    title: 'Yeni Başlık',
    description: 'Açıklama metni',
    sort_order: 1
  })
})
```

## Veritabanı Yapısı

### slider_images Tablosu

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | INT | Otomatik artan birincil anahtar |
| image_url | VARCHAR(500) | Resim dosyasının yolu |
| title | VARCHAR(255) | Resim başlığı |
| description | TEXT | Resim açıklaması |
| sort_order | INT | Sıralama düzeni |
| is_active | BOOLEAN | Aktiflik durumu |
| created_at | TIMESTAMP | Oluşturulma tarihi |
| updated_at | TIMESTAMP | Güncellenme tarihi |

## Deployment

Your project is live at:

**[https://vercel.com/halilurf22-9772s-projects/v0-influencer-marketing-site](https://vercel.com/halilurf22-9772s-projects/v0-influencer-marketing-site)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/RaoHVluq9X9](https://v0.app/chat/projects/RaoHVluq9X9)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
