import { 
  initializeDatabase, 
  testConnection, 
  closePool 
} from '../lib/database'

async function setupInfluencerDetailsDatabase() {
  console.log('🔧 Influencer detayları veritabanı kurulumu başlatılıyor...')
  
  try {
    // Veritabanı bağlantısını test et
    console.log('📡 Veritabanı bağlantısı test ediliyor...')
    const isConnected = await testConnection()
    
    if (!isConnected) {
      console.error('❌ Veritabanı bağlantısı başarısız!')
      return
    }
    
    console.log('✅ Veritabanı bağlantısı başarılı!')
    
    // Influencer detayları tablosunu oluştur
    console.log('📋 Influencer detayları tablosu oluşturuluyor...')
    await createInfluencerDetailsTable()
    console.log('✅ Influencer detayları tablosu oluşturuldu!')
    
    // Örnek detay verilerini ekle
    console.log('📝 Örnek influencer detay verileri ekleniyor...')
    await insertSampleInfluencerDetails()
    console.log('✅ Örnek detay verileri eklendi!')
    
    console.log('🎉 Influencer detayları veritabanı kurulumu tamamlandı!')
    console.log('📊 Artık /api/influencers/[id] endpoint\'ini kullanabilirsiniz.')
    
  } catch (error) {
    console.error('❌ Influencer detayları veritabanı kurulumu başarısız:', error)
  } finally {
    await closePool()
  }
}

async function createInfluencerDetailsTable() {
  const connection = await initializeDatabase().getConnection()
  
  try {
    // Influencer detayları tablosunu oluştur
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS influencer_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        influencer_id INT NOT NULL,
        bio TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        location VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        rating DECIMAL(3,2) DEFAULT 0.00,
        join_date VARCHAR(50),
        total_reach VARCHAR(50),
        campaigns_count INT DEFAULT 0,
        email VARCHAR(255),
        phone VARCHAR(50),
        portfolio JSON,
        achievements JSON,
        recent_campaigns JSON,
        engagement_rate VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    // İndeksler oluştur
    await connection.execute(`
      CREATE INDEX idx_influencer_details_influencer_id ON influencer_details(influencer_id)
    `)
    
    console.log('Influencer detayları tablosu başarıyla oluşturuldu')
  } catch (error) {
    console.error('Influencer detayları tablosu oluşturulurken hata:', error)
    throw error
  } finally {
    await connection.release()
  }
}

async function insertSampleInfluencerDetails() {
  const connection = await initializeDatabase().getConnection()
  
  try {
    const sampleDetails = [
      {
        influencer_id: 1,
        bio: 'Moda ve güzellik alanında 5 yıllık deneyime sahip content creator. Özgün içerikleri ve samimi yaklaşımıyla takipçilerinin gönlünde taht kurmuş bir influencer.',
        location: 'İstanbul',
        rating: 4.9,
        join_date: '2019',
        total_reach: '1.2M',
        campaigns_count: 45,
        email: 'ayse@kesifcollective.com',
        phone: '+90 555 123 4567',
        portfolio: JSON.stringify([
          '/fashion-post-1.png', '/placeholder-lkzbb.png', '/cozy-home-reading.png',
          '/fashion-post-2.png', '/makeup-tutorial.png', '/daily-routine.png'
        ]),
        achievements: JSON.stringify([
          'En İyi Moda İnfluencer 2023', '100K+ Takipçi Ödülü', 'Brand Partnership Excellence'
        ]),
        recent_campaigns: JSON.stringify([
          { brand: 'Zara', type: 'Moda Koleksiyonu', date: 'Aralık 2024' },
          { brand: 'L\'Oréal', type: 'Güzellik Kampanyası', date: 'Kasım 2024' },
          { brand: 'Nike', type: 'Spor Giyim', date: 'Ekim 2024' }
        ]),
        engagement_rate: '8.5%'
      },
      {
        influencer_id: 2,
        bio: 'Teknoloji uzmanı ve gaming içerik üreticisi. En son teknolojileri ve oyunları takipçileriyle paylaşan deneyimli bir influencer.',
        location: 'Ankara',
        rating: 4.8,
        join_date: '2020',
        total_reach: '2.1M',
        campaigns_count: 38,
        email: 'mehmet@kesifcollective.com',
        phone: '+90 555 234 5678',
        portfolio: JSON.stringify([
          '/turkish-tech-influencer.png', '/placeholder-qpm4f.png',
          '/digital-marketing-dashboard.png', '/digital-marketing-growth.png'
        ]),
        achievements: JSON.stringify([
          'En İyi Teknoloji İnfluencer 2023', '500K+ Takipçi Ödülü', 'Gaming Excellence Award'
        ]),
        recent_campaigns: JSON.stringify([
          { brand: 'Samsung', type: 'Telefon İncelemesi', date: 'Aralık 2024' },
          { brand: 'NVIDIA', type: 'Gaming Donanımı', date: 'Kasım 2024' },
          { brand: 'Steam', type: 'Oyun Lansmanı', date: 'Ekim 2024' }
        ]),
        engagement_rate: '12.3%'
      },
      {
        influencer_id: 3,
        bio: 'Profesyonel şef ve yemek blogger\'ı. Lezzetli tarifler ve restoran önerileriyle takipçilerini mutlu eden bir influencer.',
        location: 'İzmir',
        rating: 4.7,
        join_date: '2018',
        total_reach: '1.8M',
        campaigns_count: 52,
        email: 'zeynep@kesifcollective.com',
        phone: '+90 555 345 6789',
        portfolio: JSON.stringify([
          '/turkish-food-blogger-cooking.png', '/placeholder-rvppa.png',
          '/placeholder-3ckx3.png', '/placeholder-gl4lm.png'
        ]),
        achievements: JSON.stringify([
          'En İyi Yemek İnfluencer 2023', '300K+ Takipçi Ödülü', 'Culinary Excellence'
        ]),
        recent_campaigns: JSON.stringify([
          { brand: 'Domino\'s', type: 'Pizza Kampanyası', date: 'Aralık 2024' },
          { brand: 'Nestlé', type: 'Mutfak Ürünleri', date: 'Kasım 2024' },
          { brand: 'McDonald\'s', type: 'Fast Food', date: 'Ekim 2024' }
        ]),
        engagement_rate: '9.8%'
      },
      {
        influencer_id: 4,
        bio: 'Kişisel antrenör ve fitness motivatörü. Sağlıklı yaşam ve spor konularında uzmanlaşmış bir influencer.',
        location: 'Bursa',
        rating: 4.9,
        join_date: '2021',
        total_reach: '1.5M',
        campaigns_count: 41,
        email: 'can@kesifcollective.com',
        phone: '+90 555 456 7890',
        portfolio: JSON.stringify([
          '/turkish-fitness-influencer.png', '/placeholder-i736o.png', '/placeholder-xqkcl.png'
        ]),
        achievements: JSON.stringify([
          'En İyi Fitness İnfluencer 2023', '200K+ Takipçi Ödülü', 'Health & Wellness Award'
        ]),
        recent_campaigns: JSON.stringify([
          { brand: 'Nike', type: 'Spor Giyim', date: 'Aralık 2024' },
          { brand: 'Adidas', type: 'Fitness Ekipmanları', date: 'Kasım 2024' },
          { brand: 'Under Armour', type: 'Spor Ayakkabı', date: 'Ekim 2024' }
        ]),
        engagement_rate: '11.2%'
      },
      {
        influencer_id: 5,
        bio: 'Dünya gezgini ve seyahat fotoğrafçısı. Farklı kültürleri ve güzel mekanları takipçileriyle paylaşan bir influencer.',
        location: 'Antalya',
        rating: 4.6,
        join_date: '2017',
        total_reach: '2.3M',
        campaigns_count: 67,
        email: 'elif@kesifcollective.com',
        phone: '+90 555 567 8901',
        portfolio: JSON.stringify([
          '/turkish-influencer.png', '/placeholder-lkzbb.png',
          '/placeholder-qpm4f.png', '/placeholder-rvppa.png'
        ]),
        achievements: JSON.stringify([
          'En İyi Seyahat İnfluencer 2023', '400K+ Takipçi Ödülü', 'Travel Photography Award'
        ]),
        recent_campaigns: JSON.stringify([
          { brand: 'Booking.com', type: 'Otel Rezervasyonu', date: 'Aralık 2024' },
          { brand: 'Turkish Airlines', type: 'Uçuş Kampanyası', date: 'Kasım 2024' },
          { brand: 'Airbnb', type: 'Konaklama', date: 'Ekim 2024' }
        ]),
        engagement_rate: '7.9%'
      },
      {
        influencer_id: 6,
        bio: 'Eğlenceli içerik üreticisi ve vlogger. Günlük yaşamı ve eğlenceli anları takipçileriyle paylaşan bir influencer.',
        location: 'İstanbul',
        rating: 4.5,
        join_date: '2022',
        total_reach: '1.9M',
        campaigns_count: 33,
        email: 'burak@kesifcollective.com',
        phone: '+90 555 678 9012',
        portfolio: JSON.stringify([
          '/turkish-gaming-streamer.png', '/placeholder-3ckx3.png',
          '/placeholder-gl4lm.png', '/placeholder-i736o.png'
        ]),
        achievements: JSON.stringify([
          'En İyi Vlog İnfluencer 2023', '250K+ Takipçi Ödülü', 'Entertainment Award'
        ]),
        recent_campaigns: JSON.stringify([
          { brand: 'Red Bull', type: 'Enerji İçeceği', date: 'Aralık 2024' },
          { brand: 'Twitch', type: 'Yayın Platformu', date: 'Kasım 2024' },
          { brand: 'Discord', type: 'Sosyal Platform', date: 'Ekim 2024' }
        ]),
        engagement_rate: '6.8%'
      }
    ]
    
    for (const detail of sampleDetails) {
      await connection.execute(`
        INSERT INTO influencer_details (
          influencer_id, bio, location, rating, join_date, total_reach, campaigns_count,
          email, phone, portfolio, achievements, recent_campaigns, engagement_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        detail.influencer_id, detail.bio, detail.location, detail.rating, detail.join_date,
        detail.total_reach, detail.campaigns_count, detail.email, detail.phone,
        detail.portfolio, detail.achievements, detail.recent_campaigns, detail.engagement_rate
      ])
    }
    
    console.log('Örnek influencer detay verileri başarıyla eklendi')
  } catch (error) {
    console.error('Örnek influencer detay verileri eklenirken hata:', error)
    throw error
  } finally {
    await connection.release()
  }
}

// Script'i çalıştır
setupInfluencerDetailsDatabase()
