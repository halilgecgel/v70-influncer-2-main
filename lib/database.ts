import mysql from 'mysql2/promise'

// MySQL bağlantı konfigürasyonu
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'influencer_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
}

// Connection pool oluştur
let pool: mysql.Pool | null = null

// Veritabanı bağlantı havuzunu başlat
export function initializeDatabase() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
    console.log('MySQL bağlantı havuzu oluşturuldu')
  }
  return pool
}

// Veritabanı bağlantısını al
export async function getConnection() {
  if (!pool) {
    pool = initializeDatabase()
  }
  
  try {
    const connection = await pool.getConnection()
    return connection
  } catch (error) {
    console.error('Veritabanı bağlantısı alınamadı:', error)
    throw error
  }
}

// Veritabanı bağlantısını kapat
export async function closeConnection(connection: mysql.PoolConnection) {
  try {
    await connection.release()
  } catch (error) {
    console.error('Veritabanı bağlantısı kapatılırken hata:', error)
  }
}

// Veritabanı bağlantısını test et
export async function testConnection() {
  try {
    const connection = await getConnection()
    await connection.ping()
    await closeConnection(connection)
    console.log('MySQL bağlantısı başarılı')
    return true
  } catch (error) {
    console.error('MySQL bağlantı testi başarısız:', error)
    return false
  }
}

// Veritabanı bağlantı havuzunu kapat
export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
    console.log('MySQL bağlantı havuzu kapatıldı')
  }
}

// Slider verilerini çek
export async function getSliderImages() {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT id, image_url, title, description, sort_order, is_active, created_at 
      FROM slider_images 
      WHERE is_active = 1 
      ORDER BY sort_order ASC, created_at DESC
    `)
    
    return rows
  } catch (error) {
    console.error('Slider verileri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Yeni slider resmi ekle
export async function addSliderImage(imageData: {
  image_url: string
  title?: string
  description?: string
  sort_order?: number
}) {
  const connection = await getConnection()
  
  try {
    const { image_url, title, description, sort_order = 0 } = imageData
    
    const [result] = await connection.execute(`
      INSERT INTO slider_images (image_url, title, description, sort_order, is_active, created_at) 
      VALUES (?, ?, ?, ?, 1, NOW())
    `, [image_url, title, description, sort_order])
    
    return result
  } catch (error) {
    console.error('Slider resmi eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Slider resmini güncelle
export async function updateSliderImage(id: number, imageData: {
  image_url?: string
  title?: string
  description?: string
  sort_order?: number
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { image_url, title, description, sort_order, is_active } = imageData
    
    const [result] = await connection.execute(`
      UPDATE slider_images 
      SET image_url = COALESCE(?, image_url),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          sort_order = COALESCE(?, sort_order),
          is_active = COALESCE(?, is_active),
          updated_at = NOW()
      WHERE id = ?
    `, [image_url, title, description, sort_order, is_active, id])
    
    return result
  } catch (error) {
    console.error('Slider resmi güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Slider resmini sil (soft delete)
export async function deleteSliderImage(id: number) {
  const connection = await getConnection()
  
  try {
    const [result] = await connection.execute(`
      UPDATE slider_images 
      SET is_active = 0, updated_at = NOW()
      WHERE id = ?
    `, [id])
    
    return result
  } catch (error) {
    console.error('Slider resmi silinirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Veritabanı tablosunu oluştur
export async function createSliderTable() {
  const connection = await getConnection()
  
  try {
    // Önce mevcut tabloyu sil (eğer varsa)
    await connection.execute(`DROP TABLE IF EXISTS slider_images`)
    
    // Yeni tabloyu oluştur
    await connection.execute(`
      CREATE TABLE slider_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(500) NOT NULL,
        title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    // İndeksler oluştur
    await connection.execute(`
      CREATE INDEX idx_slider_active ON slider_images(is_active)
    `)
    
    await connection.execute(`
      CREATE INDEX idx_slider_order ON slider_images(sort_order)
    `)
    
    await connection.execute(`
      CREATE INDEX idx_slider_created ON slider_images(created_at)
    `)
    
    console.log('Slider tablosu başarıyla oluşturuldu')
  } catch (error) {
    console.error('Slider tablosu oluşturulurken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Örnek veriler ekle
export async function insertSampleData() {
  const connection = await getConnection()
  
  try {
    const sampleData = [
      {
        image_url: '/digital-marketing-dashboard.png',
        title: 'Dijital Pazarlama Dashboard',
        description: 'Modern dijital pazarlama araçları ve analitik dashboard',
        sort_order: 1
      },
      {
        image_url: '/digital-marketing-growth.png',
        title: 'Pazarlama Büyümesi',
        description: 'Dijital pazarlama stratejileri ile büyüme grafikleri',
        sort_order: 2
      },
      {
        image_url: '/placeholder-si4p5.png',
        title: 'Influencer Marketing',
        description: 'Sosyal medya influencer pazarlama çözümleri',
        sort_order: 3
      },
      {
        image_url: '/turkish-influencer.png',
        title: 'Türk Influencer',
        description: 'Türkiye\'nin önde gelen influencer\'ları',
        sort_order: 4
      },
      {
        image_url: '/fashion-post-1.png',
        title: 'Moda İçerikleri',
        description: 'Trend moda ve lifestyle içerikleri',
        sort_order: 5
      }
    ]
    
    for (const data of sampleData) {
      await connection.execute(`
        INSERT INTO slider_images (image_url, title, description, sort_order, is_active, created_at) 
        VALUES (?, ?, ?, ?, 1, NOW())
      `, [data.image_url, data.title, data.description, data.sort_order])
    }
    
    console.log('Örnek veriler başarıyla eklendi')
  } catch (error) {
    console.error('Örnek veriler eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Influencer verilerini çek
export async function getInfluencers(category?: string) {
  const connection = await getConnection()
  
  try {
    let query = `
      SELECT id, name, slug, category, image_url, specialties, social_media, sort_order, created_at 
      FROM influencers 
      WHERE is_active = 1 
    `
    
    const params: any[] = []
    
    if (category && category !== 'all') {
      query += ` AND category = ?`
      params.push(category)
    }
    
    query += ` ORDER BY sort_order ASC, created_at DESC`
    
    const [rows] = await connection.execute(query, params)
    
    // JSON alanlarını parse et
    const influencers = (rows as any[]).map(row => ({
      ...row,
      specialties: JSON.parse(row.specialties || '[]'),
      social_media: JSON.parse(row.social_media || '{}')
    }))
    
    return influencers
  } catch (error) {
    console.error('Influencer verileri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Tek bir influencer'ı getir (detaylarıyla birlikte)
export async function getInfluencerById(id: number) {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT i.id, i.name, i.slug, i.category, i.image_url, i.specialties, i.social_media, i.sort_order, i.created_at,
             d.bio, d.location, d.rating, d.join_date, d.total_reach, d.campaigns_count, d.email, d.phone,
             d.portfolio, d.achievements, d.recent_campaigns, d.engagement_rate
      FROM influencers i
      LEFT JOIN influencer_details d ON i.id = d.influencer_id
      WHERE i.id = ? AND i.is_active = 1
    `, [id])
    
    if ((rows as any[]).length === 0) {
      return null
    }
    
    const row = (rows as any[])[0]
    return {
      ...row,
      specialties: JSON.parse(row.specialties || '[]'),
      social_media: JSON.parse(row.social_media || '{}'),
      portfolio: JSON.parse(row.portfolio || '[]'),
      achievements: JSON.parse(row.achievements || '[]'),
      recent_campaigns: JSON.parse(row.recent_campaigns || '[]')
    }
  } catch (error) {
    console.error('Influencer verisi çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Slug ile influencer getir
export async function getInfluencerBySlug(slug: string) {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT i.id, i.name, i.slug, i.category, i.image_url, i.specialties, i.social_media, i.sort_order, i.created_at,
             d.bio, d.location, d.rating, d.join_date, d.total_reach, d.campaigns_count, d.email, d.phone,
             d.portfolio, d.achievements, d.recent_campaigns, d.engagement_rate
      FROM influencers i
      LEFT JOIN influencer_details d ON i.id = d.influencer_id
      WHERE i.slug = ? AND i.is_active = 1
    `, [slug])
    
    if ((rows as any[]).length === 0) {
      return null
    }
    
    const row = (rows as any[])[0]
    return {
      ...row,
      specialties: JSON.parse(row.specialties || '[]'),
      social_media: JSON.parse(row.social_media || '{}'),
      portfolio: JSON.parse(row.portfolio || '[]'),
      achievements: JSON.parse(row.achievements || '[]'),
      recent_campaigns: JSON.parse(row.recent_campaigns || '[]')
    }
  } catch (error) {
    console.error('Influencer verisi çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Slug oluşturma fonksiyonu
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Yeni influencer ekle
export async function addInfluencer(influencerData: {
  name: string
  category: string
  image_url: string
  specialties: string[]
  social_media: {
    instagram?: string
    tiktok?: string
    youtube?: string
  }
  sort_order?: number
}) {
  const connection = await getConnection()
  
  try {
    const { name, category, image_url, specialties, social_media, sort_order = 0 } = influencerData
    const slug = generateSlug(name)
    
    const [result] = await connection.execute(`
      INSERT INTO influencers (name, slug, category, image_url, specialties, social_media, sort_order, is_active, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
    `, [name, slug, category, image_url, JSON.stringify(specialties), JSON.stringify(social_media), sort_order])
    
    return result
  } catch (error) {
    console.error('Influencer eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Influencer güncelle
export async function updateInfluencer(id: number, influencerData: {
  name?: string
  category?: string
  image_url?: string
  specialties?: string[]
  social_media?: {
    instagram?: string
    tiktok?: string
    youtube?: string
  }
  sort_order?: number
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { name, category, image_url, specialties, social_media, sort_order, is_active } = influencerData
    
    // Dinamik SQL sorgusu oluştur
    let updateFields: string[] = []
    let params: any[] = []
    
    if (name !== undefined) {
      updateFields.push('name = ?')
      params.push(name)
      updateFields.push('slug = ?')
      params.push(generateSlug(name))
    }
    
    if (category !== undefined) {
      updateFields.push('category = ?')
      params.push(category)
    }
    
    if (image_url !== undefined) {
      updateFields.push('image_url = ?')
      params.push(image_url)
    }
    
    if (specialties !== undefined) {
      updateFields.push('specialties = ?')
      params.push(JSON.stringify(specialties))
    }
    
    if (social_media !== undefined) {
      updateFields.push('social_media = ?')
      params.push(JSON.stringify(social_media))
    }
    
    if (sort_order !== undefined) {
      updateFields.push('sort_order = ?')
      params.push(sort_order)
    }
    
    if (is_active !== undefined) {
      updateFields.push('is_active = ?')
      params.push(is_active)
    }
    
    // En az bir alan güncellenecekse
    if (updateFields.length === 0) {
      throw new Error('Güncellenecek alan bulunamadı')
    }
    
    updateFields.push('updated_at = NOW()')
    params.push(id)
    
    const query = `
      UPDATE influencers 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `
    
    console.log('SQL Sorgusu:', query)
    console.log('Parametreler:', params)
    
    const [result] = await connection.execute(query, params)
    
    console.log('Güncelleme sonucu:', result)
    
    return result
  } catch (error) {
    console.error('Influencer güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Influencer sil (soft delete)
export async function deleteInfluencer(id: number) {
  const connection = await getConnection()
  
  try {
    const [result] = await connection.execute(`
      UPDATE influencers 
      SET is_active = 0, updated_at = NOW()
      WHERE id = ?
    `, [id])
    
    return result
  } catch (error) {
    console.error('Influencer silinirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Influencer kategorilerini getir
export async function getInfluencerCategories() {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT DISTINCT category 
      FROM influencers 
      WHERE is_active = 1 
      ORDER BY category
    `)
    
    return (rows as any[]).map(row => row.category)
  } catch (error) {
    console.error('Influencer kategorileri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Influencer tablosunu oluştur
export async function createInfluencersTable() {
  const connection = await getConnection()
  
  try {
    // Önce foreign key constraint'leri kaldır
    await connection.execute(`SET FOREIGN_KEY_CHECKS = 0`)
    
    // Önce mevcut tabloyu sil (eğer varsa)
    await connection.execute(`DROP TABLE IF EXISTS influencers`)
    
    // Foreign key constraint'leri geri aç
    await connection.execute(`SET FOREIGN_KEY_CHECKS = 1`)
    
    // Yeni tabloyu oluştur
    await connection.execute(`
      CREATE TABLE influencers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        slug VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        category VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        specialties JSON,
        social_media JSON,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    // İndeksler oluştur
    await connection.execute(`
      CREATE INDEX idx_influencers_category ON influencers(category)
    `)
    
    await connection.execute(`
      CREATE INDEX idx_influencers_active ON influencers(is_active)
    `)
    
    await connection.execute(`
      CREATE INDEX idx_influencers_order ON influencers(sort_order)
    `)
    
    await connection.execute(`
      CREATE INDEX idx_influencers_slug ON influencers(slug)
    `)
    
    console.log('Influencers tablosu başarıyla oluşturuldu')
  } catch (error) {
    console.error('Influencers tablosu oluşturulurken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Örnek influencer verileri ekle
export async function insertSampleInfluencers() {
  const connection = await getConnection()
  
  try {
    const sampleData = [
      {
        name: 'Ayşe Demir',
        category: 'lifestyle',
        image_url: '/fashionable-turkish-woman-influencer.png',
        specialties: ['Moda', 'Güzellik', 'Yaşam'],
        social_media: { instagram: '250K', tiktok: '180K', youtube: '95K' },
        sort_order: 1
      },
      {
        name: 'Mehmet Kaya',
        category: 'tech',
        image_url: '/turkish-tech-influencer.png',
        specialties: ['Teknoloji', 'Gaming', 'İnceleme'],
        social_media: { instagram: '120K', tiktok: '340K', youtube: '580K' },
        sort_order: 2
      },
      {
        name: 'Zeynep Özkan',
        category: 'food',
        image_url: '/turkish-food-blogger-cooking.png',
        specialties: ['Yemek', 'Tarif', 'Restoran'],
        social_media: { instagram: '420K', tiktok: '280K', youtube: '150K' },
        sort_order: 3
      },
      {
        name: 'Can Yılmaz',
        category: 'fitness',
        image_url: '/turkish-fitness-influencer.png',
        specialties: ['Fitness', 'Sağlık', 'Spor'],
        social_media: { instagram: '180K', tiktok: '220K', youtube: '95K' },
        sort_order: 4
      },
      {
        name: 'Elif Şahin',
        category: 'travel',
        image_url: '/turkish-influencer.png',
        specialties: ['Seyahat', 'Kültür', 'Fotoğraf'],
        social_media: { instagram: '350K', tiktok: '190K', youtube: '120K' },
        sort_order: 5
      },
      {
        name: 'Burak Özdemir',
        category: 'lifestyle',
        image_url: '/turkish-gaming-streamer.png',
        specialties: ['Vlog', 'Eğlence', 'Yaşam'],
        social_media: { instagram: '280K', tiktok: '450K', youtube: '320K' },
        sort_order: 6
      }
    ]
    
    for (const data of sampleData) {
      const slug = generateSlug(data.name)
      await connection.execute(`
        INSERT INTO influencers (name, slug, category, image_url, specialties, social_media, sort_order, is_active, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
      `, [data.name, slug, data.category, data.image_url, JSON.stringify(data.specialties), JSON.stringify(data.social_media), data.sort_order])
    }
    
    console.log('Örnek influencer verileri başarıyla eklendi')
  } catch (error) {
    console.error('Örnek influencer verileri eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Influencer detayları ekle/güncelle
export async function addInfluencerDetails(influencerId: number, detailsData: {
  bio?: string
  location?: string
  rating?: number
  join_date?: string
  total_reach?: string
  campaigns_count?: number
  email: string
  phone: string
  portfolio?: string[]
  achievements?: string[]
  recent_campaigns?: Array<{
    brand: string
    type: string
    date: string
  }>
  engagement_rate?: string
}) {
  const connection = await getConnection()
  
  try {
    const { 
      bio, location, rating, join_date, total_reach, campaigns_count, 
      email, phone, portfolio, achievements, recent_campaigns, engagement_rate 
    } = detailsData
    
    // Önce mevcut kayıt var mı kontrol et
    const [existing] = await connection.execute(`
      SELECT id FROM influencer_details WHERE influencer_id = ?
    `, [influencerId])
    
    if ((existing as any[]).length > 0) {
      // Güncelle
      await connection.execute(`
        UPDATE influencer_details 
        SET bio = ?, location = ?, rating = ?, join_date = ?, total_reach = ?, 
            campaigns_count = ?, email = ?, phone = ?, portfolio = ?, 
            achievements = ?, recent_campaigns = ?, engagement_rate = ?, updated_at = NOW()
        WHERE influencer_id = ?
      `, [
        bio, location, rating, join_date, total_reach, campaigns_count, 
        email, phone, 
        portfolio ? JSON.stringify(portfolio) : null,
        achievements ? JSON.stringify(achievements) : null,
        recent_campaigns ? JSON.stringify(recent_campaigns) : null,
        engagement_rate, influencerId
      ])
    } else {
      // Yeni kayıt ekle
      await connection.execute(`
        INSERT INTO influencer_details 
        (influencer_id, bio, location, rating, join_date, total_reach, campaigns_count, 
         email, phone, portfolio, achievements, recent_campaigns, engagement_rate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        influencerId, bio, location, rating, join_date, total_reach, campaigns_count,
        email, phone,
        portfolio ? JSON.stringify(portfolio) : null,
        achievements ? JSON.stringify(achievements) : null,
        recent_campaigns ? JSON.stringify(recent_campaigns) : null,
        engagement_rate
      ])
    }
    
    return { success: true }
  } catch (error) {
    console.error('Influencer detayları eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Influencer detaylarını güncelle
export async function updateInfluencerDetails(influencerId: number, detailsData: {
  bio?: string
  location?: string
  rating?: number
  join_date?: string
  total_reach?: string
  campaigns_count?: number
  email?: string
  phone?: string
  portfolio?: string[]
  achievements?: string[]
  recent_campaigns?: Array<{
    brand: string
    type: string
    date: string
  }>
  engagement_rate?: string
}) {
  const connection = await getConnection()
  
  try {
    const updates: string[] = []
    const values: any[] = []
    
    // Dinamik güncelleme sorgusu oluştur
    Object.entries(detailsData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`)
        if (key === 'portfolio' || key === 'achievements' || key === 'recent_campaigns') {
          values.push(Array.isArray(value) ? JSON.stringify(value) : value)
        } else {
          values.push(value)
        }
      }
    })
    
    if (updates.length === 0) {
      throw new Error('Güncellenecek veri bulunamadı')
    }
    
    updates.push('updated_at = NOW()')
    values.push(influencerId)
    
    await connection.execute(`
      UPDATE influencer_details SET ${updates.join(', ')} WHERE influencer_id = ?
    `, values)
    
    return { success: true }
  } catch (error) {
    console.error('Influencer detayları güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Brands tablosunu oluştur
export async function createBrandsTable() {
  const connection = await getConnection()
  
  try {
    // Önce mevcut tabloyu sil (eğer varsa)
    await connection.execute(`DROP TABLE IF EXISTS brands`)
    
    // Yeni tabloyu oluştur
    await connection.execute(`
      CREATE TABLE brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        logo_url VARCHAR(500) NOT NULL,
        website_url VARCHAR(500),
        category VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    // İndeksler oluştur
    await connection.execute(`
      CREATE INDEX idx_brands_active ON brands(is_active)
    `)
    
    await connection.execute(`
      CREATE INDEX idx_brands_order ON brands(sort_order)
    `)
    
    await connection.execute(`
      CREATE INDEX idx_brands_category ON brands(category)
    `)
    
    console.log('Brands tablosu başarıyla oluşturuldu')
  } catch (error) {
    console.error('Brands tablosu oluşturulurken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Örnek brands verileri ekle
export async function insertSampleBrands() {
  const connection = await getConnection()
  
  try {
    const sampleData = [
      {
        name: 'Nike',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
        website_url: 'https://www.nike.com',
        category: 'spor',
        sort_order: 1
      },
      {
        name: 'Adidas',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png',
        website_url: 'https://www.adidas.com',
        category: 'spor',
        sort_order: 2
      },
      {
        name: 'Coca Cola',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Coca-Cola-Logo.png',
        website_url: 'https://www.coca-cola.com',
        category: 'içecek',
        sort_order: 3
      },
      {
        name: 'Samsung',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/06/Samsung-Logo.png',
        website_url: 'https://www.samsung.com',
        category: 'teknoloji',
        sort_order: 4
      },
      {
        name: 'Apple',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
        website_url: 'https://www.apple.com',
        category: 'teknoloji',
        sort_order: 5
      },
      {
        name: 'Google',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png',
        website_url: 'https://www.google.com',
        category: 'teknoloji',
        sort_order: 6
      },
      {
        name: 'Microsoft',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png',
        website_url: 'https://www.microsoft.com',
        category: 'teknoloji',
        sort_order: 7
      },
      {
        name: 'Amazon',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png',
        website_url: 'https://www.amazon.com',
        category: 'e-ticaret',
        sort_order: 8
      },
      {
        name: 'Netflix',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png',
        website_url: 'https://www.netflix.com',
        category: 'eğlence',
        sort_order: 9
      },
      {
        name: 'Spotify',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/06/Spotify-Logo.png',
        website_url: 'https://www.spotify.com',
        category: 'müzik',
        sort_order: 10
      },
      {
        name: 'Tesla',
        logo_url: 'https://logos-world.net/wp-content/uploads/2021/03/Tesla-Logo.png',
        website_url: 'https://www.tesla.com',
        category: 'otomotiv',
        sort_order: 11
      },
      {
        name: 'McDonald\'s',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png',
        website_url: 'https://www.mcdonalds.com',
        category: 'restoran',
        sort_order: 12
      },
      {
        name: 'BMW',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png',
        website_url: 'https://www.bmw.com',
        category: 'otomotiv',
        sort_order: 13
      },
      {
        name: 'Mercedes',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Logo.png',
        website_url: 'https://www.mercedes-benz.com',
        category: 'otomotiv',
        sort_order: 14
      },
      {
        name: 'Louis Vuitton',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Louis-Vuitton-Logo.png',
        website_url: 'https://www.louisvuitton.com',
        category: 'moda',
        sort_order: 15
      },
      {
        name: 'Chanel',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Chanel-Logo.png',
        website_url: 'https://www.chanel.com',
        category: 'moda',
        sort_order: 16
      },
      {
        name: 'Gucci',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Gucci-Logo.png',
        website_url: 'https://www.gucci.com',
        category: 'moda',
        sort_order: 17
      },
      {
        name: 'Prada',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Prada-Logo.png',
        website_url: 'https://www.prada.com',
        category: 'moda',
        sort_order: 18
      },
      {
        name: 'Rolex',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Rolex-Logo.png',
        website_url: 'https://www.rolex.com',
        category: 'aksesuar',
        sort_order: 19
      },
      {
        name: 'Starbucks',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png',
        website_url: 'https://www.starbucks.com',
        category: 'kafe',
        sort_order: 20
      }
    ]
    
    for (const data of sampleData) {
      await connection.execute(`
        INSERT INTO brands (name, logo_url, website_url, category, sort_order, is_active, created_at) 
        VALUES (?, ?, ?, ?, ?, 1, NOW())
      `, [data.name, data.logo_url, data.website_url, data.category, data.sort_order])
    }
    
    console.log('Örnek brands verileri başarıyla eklendi')
  } catch (error) {
    console.error('Örnek brands verileri eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Brands verilerini çek
export async function getBrands(category?: string) {
  const connection = await getConnection()
  
  try {
    let query = `
      SELECT id, name, logo_url, website_url, category, sort_order, created_at 
      FROM brands 
      WHERE is_active = 1 
    `
    
    const params: any[] = []
    
    if (category && category !== 'all') {
      query += ` AND category = ?`
      params.push(category)
    }
    
    query += ` ORDER BY sort_order ASC, created_at DESC`
    
    const [rows] = await connection.execute(query, params)
    
    return rows
  } catch (error) {
    console.error('Brands verileri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Yeni brand ekle
export async function addBrand(brandData: {
  name: string
  logo_url: string
  website_url?: string
  category?: string
  sort_order?: number
}) {
  const connection = await getConnection()
  
  try {
    const { name, logo_url, website_url, category, sort_order = 0 } = brandData
    
    const [result] = await connection.execute(`
      INSERT INTO brands (name, logo_url, website_url, category, sort_order, is_active, created_at) 
      VALUES (?, ?, ?, ?, ?, 1, NOW())
    `, [name, logo_url, website_url, category, sort_order])
    
    return result
  } catch (error) {
    console.error('Brand eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Brand güncelle
export async function updateBrand(id: number, brandData: {
  name?: string
  logo_url?: string
  website_url?: string
  category?: string
  sort_order?: number
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { name, logo_url, website_url, category, sort_order, is_active } = brandData
    
    const [result] = await connection.execute(`
      UPDATE brands 
      SET name = COALESCE(?, name),
          logo_url = COALESCE(?, logo_url),
          website_url = COALESCE(?, website_url),
          category = COALESCE(?, category),
          sort_order = COALESCE(?, sort_order),
          is_active = COALESCE(?, is_active),
          updated_at = NOW()
      WHERE id = ?
    `, [name, logo_url, website_url, category, sort_order, is_active, id])
    
    return result
  } catch (error) {
    console.error('Brand güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Brand sil (soft delete)
export async function deleteBrand(id: number) {
  const connection = await getConnection()
  
  try {
    const [result] = await connection.execute(`
      UPDATE brands 
      SET is_active = 0, updated_at = NOW()
      WHERE id = ?
    `, [id])
    
    return result
  } catch (error) {
    console.error('Brand silinirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Brand kategorilerini getir
export async function getBrandCategories() {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT DISTINCT category 
      FROM brands 
      WHERE is_active = 1 
      ORDER BY category
    `)
    
    return (rows as any[]).map(row => row.category)
  } catch (error) {
    console.error('Brand kategorileri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// About sayfası için tabloları oluştur
export async function createAboutTables() {
  const connection = await getConnection()
  
  try {
    // Stats tablosu
    await connection.execute(`DROP TABLE IF EXISTS about_stats`)
    await connection.execute(`
      CREATE TABLE about_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        value VARCHAR(50) NOT NULL,
        label VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        color VARCHAR(100) NOT NULL,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Values tablosu
    await connection.execute(`DROP TABLE IF EXISTS about_values`)
    await connection.execute(`
      CREATE TABLE about_values (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        color VARCHAR(100) NOT NULL,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Team tablosu
    await connection.execute(`DROP TABLE IF EXISTS about_team`)
    await connection.execute(`
      CREATE TABLE about_team (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        role VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Mission & Vision tablosu
    await connection.execute(`DROP TABLE IF EXISTS about_content`)
    await connection.execute(`
      CREATE TABLE about_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('mission', 'vision') NOT NULL,
        title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        icon VARCHAR(100) NOT NULL,
        color VARCHAR(100) NOT NULL,
        features JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // İndeksler oluştur
    await connection.execute(`CREATE INDEX idx_about_stats_active ON about_stats(is_active)`)
    await connection.execute(`CREATE INDEX idx_about_stats_order ON about_stats(sort_order)`)
    
    await connection.execute(`CREATE INDEX idx_about_values_active ON about_values(is_active)`)
    await connection.execute(`CREATE INDEX idx_about_values_order ON about_values(sort_order)`)
    
    await connection.execute(`CREATE INDEX idx_about_team_active ON about_team(is_active)`)
    await connection.execute(`CREATE INDEX idx_about_team_order ON about_team(sort_order)`)
    
    await connection.execute(`CREATE INDEX idx_about_content_type ON about_content(type)`)
    await connection.execute(`CREATE INDEX idx_about_content_active ON about_content(is_active)`)
    
    console.log('About sayfası tabloları başarıyla oluşturuldu')
  } catch (error) {
    console.error('About sayfası tabloları oluşturulurken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// About sayfası örnek verilerini ekle
export async function insertAboutSampleData() {
  const connection = await getConnection()
  
  try {
    // Stats verileri
    const statsData = [
      { icon: 'Users', value: '500+', label: 'Influencer', color: 'from-primary to-secondary', sort_order: 1 },
      { icon: 'TrendingUp', value: '1000+', label: 'Başarılı Kampanya', color: 'from-secondary to-primary', sort_order: 2 },
      { icon: 'Award', value: '50+', label: 'Marka Partneri', color: 'from-primary to-secondary', sort_order: 3 },
      { icon: 'Target', value: '2M+', label: 'Toplam Erişim', color: 'from-secondary to-primary', sort_order: 4 }
    ]

    for (const data of statsData) {
      await connection.execute(`
        INSERT INTO about_stats (icon, value, label, color, sort_order, is_active, created_at) 
        VALUES (?, ?, ?, ?, ?, 1, NOW())
      `, [data.icon, data.value, data.label, data.color, data.sort_order])
    }

    // Values verileri
    const valuesData = [
      { icon: 'Heart', title: 'Güvenilirlik', description: 'Markalar ve influencer\'lar arasında güvenilir köprü kuruyoruz.', color: 'from-red-500 to-pink-500', sort_order: 1 },
      { icon: 'Target', title: 'Hedef Odaklı', description: 'Her kampanya için özel stratejiler geliştiriyoruz.', color: 'from-blue-500 to-cyan-500', sort_order: 2 },
      { icon: 'Zap', title: 'Hızlı Sonuç', description: 'Kısa sürede etkili sonuçlar elde ediyoruz.', color: 'from-yellow-500 to-orange-500', sort_order: 3 },
      { icon: 'Shield', title: 'Kalite Garantisi', description: 'Her projede en yüksek kaliteyi garanti ediyoruz.', color: 'from-green-500 to-emerald-500', sort_order: 4 },
      { icon: 'Globe', title: 'Global Erişim', description: 'Türkiye ve dünya çapında geniş ağımızla hizmet veriyoruz.', color: 'from-purple-500 to-indigo-500', sort_order: 5 },
      { icon: 'Lightbulb', title: 'Yaratıcılık', description: 'Yenilikçi ve yaratıcı çözümler sunuyoruz.', color: 'from-pink-500 to-rose-500', sort_order: 6 }
    ]

    for (const data of valuesData) {
      await connection.execute(`
        INSERT INTO about_values (icon, title, description, color, sort_order, is_active, created_at) 
        VALUES (?, ?, ?, ?, ?, 1, NOW())
      `, [data.icon, data.title, data.description, data.color, data.sort_order])
    }

    // Team verileri
    const teamData = [
      { name: 'Ahmet Yılmaz', role: 'Kurucu & CEO', image_url: '/placeholder-user.jpg', description: '10+ yıl dijital pazarlama deneyimi', sort_order: 1 },
      { name: 'Ayşe Demir', role: 'Pazarlama Direktörü', image_url: '/placeholder-user.jpg', description: 'Influencer marketing uzmanı', sort_order: 2 },
      { name: 'Mehmet Kaya', role: 'Teknoloji Lideri', image_url: '/placeholder-user.jpg', description: 'Yazılım ve analitik uzmanı', sort_order: 3 },
      { name: 'Zeynep Özkan', role: 'İçerik Stratejisti', image_url: '/placeholder-user.jpg', description: 'Yaratıcı içerik ve kampanya uzmanı', sort_order: 4 }
    ]

    for (const data of teamData) {
      await connection.execute(`
        INSERT INTO about_team (name, role, image_url, description, sort_order, is_active, created_at) 
        VALUES (?, ?, ?, ?, ?, 1, NOW())
      `, [data.name, data.role, data.image_url, data.description, data.sort_order])
    }

    // Mission & Vision verileri
    const contentData = [
      {
        type: 'mission',
        title: 'Misyonumuz',
        description: 'Markalar ve influencer\'lar arasında güvenilir, şeffaf ve etkili işbirlikleri kurarak, her iki tarafın da hedeflerine ulaşmasını sağlamak.',
        icon: 'Target',
        color: 'from-primary to-secondary',
        features: JSON.stringify(['Kaliteli içerik üretimi', 'Hedef kitle analizi', 'Performans takibi'])
      },
      {
        type: 'vision',
        title: 'Vizyonumuz',
        description: 'Türkiye\'nin en güvenilir ve yenilikçi influencer marketing platformu olarak, dijital pazarlama dünyasında öncü rol oynamak.',
        icon: 'Star',
        color: 'from-secondary to-primary',
        features: JSON.stringify(['Teknoloji odaklı çözümler', 'Global genişleme', 'Sürdürülebilir büyüme'])
      }
    ]

    for (const data of contentData) {
      await connection.execute(`
        INSERT INTO about_content (type, title, description, icon, color, features, is_active, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
      `, [data.type, data.title, data.description, data.icon, data.color, data.features])
    }

    console.log('About sayfası örnek verileri başarıyla eklendi')
  } catch (error) {
    console.error('About sayfası örnek verileri eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// About sayfası verilerini çek
export async function getAboutData() {
  const connection = await getConnection()
  
  try {
    // Stats verilerini çek
    const [statsRows] = await connection.execute(`
      SELECT icon, value, label, color, sort_order 
      FROM about_stats 
      WHERE is_active = 1 
      ORDER BY sort_order ASC
    `)

    // Values verilerini çek
    const [valuesRows] = await connection.execute(`
      SELECT icon, title, description, color, sort_order 
      FROM about_values 
      WHERE is_active = 1 
      ORDER BY sort_order ASC
    `)

    // Team verilerini çek
    const [teamRows] = await connection.execute(`
      SELECT name, role, image_url, description, sort_order 
      FROM about_team 
      WHERE is_active = 1 
      ORDER BY sort_order ASC
    `)

    // Mission & Vision verilerini çek
    const [contentRows] = await connection.execute(`
      SELECT type, title, description, icon, color, features 
      FROM about_content 
      WHERE is_active = 1 
      ORDER BY type
    `)

    // JSON alanlarını parse et
    const content = (contentRows as any[]).map(row => ({
      ...row,
      features: JSON.parse(row.features || '[]')
    }))

    return {
      stats: statsRows,
      values: valuesRows,
      team: teamRows,
      content: content
    }
  } catch (error) {
    console.error('About sayfası verileri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Stats verilerini güncelle
export async function updateAboutStats(id: number, statsData: {
  icon?: string
  value?: string
  label?: string
  color?: string
  sort_order?: number
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { icon, value, label, color, sort_order, is_active } = statsData
    
    const [result] = await connection.execute(`
      UPDATE about_stats 
      SET icon = COALESCE(?, icon),
          value = COALESCE(?, value),
          label = COALESCE(?, label),
          color = COALESCE(?, color),
          sort_order = COALESCE(?, sort_order),
          is_active = COALESCE(?, is_active),
          updated_at = NOW()
      WHERE id = ?
    `, [icon, value, label, color, sort_order, is_active, id])
    
    return result
  } catch (error) {
    console.error('Stats verisi güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Values verilerini güncelle
export async function updateAboutValues(id: number, valuesData: {
  icon?: string
  title?: string
  description?: string
  color?: string
  sort_order?: number
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { icon, title, description, color, sort_order, is_active } = valuesData
    
    const [result] = await connection.execute(`
      UPDATE about_values 
      SET icon = COALESCE(?, icon),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          color = COALESCE(?, color),
          sort_order = COALESCE(?, sort_order),
          is_active = COALESCE(?, is_active),
          updated_at = NOW()
      WHERE id = ?
    `, [icon, title, description, color, sort_order, is_active, id])
    
    return result
  } catch (error) {
    console.error('Values verisi güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Team verilerini güncelle
export async function updateAboutTeam(id: number, teamData: {
  name?: string
  role?: string
  image_url?: string
  description?: string
  sort_order?: number
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { name, role, image_url, description, sort_order, is_active } = teamData
    
    const [result] = await connection.execute(`
      UPDATE about_team 
      SET name = COALESCE(?, name),
          role = COALESCE(?, role),
          image_url = COALESCE(?, image_url),
          description = COALESCE(?, description),
          sort_order = COALESCE(?, sort_order),
          is_active = COALESCE(?, is_active),
          updated_at = NOW()
      WHERE id = ?
    `, [name, role, image_url, description, sort_order, is_active, id])
    
    return result
  } catch (error) {
    console.error('Team verisi güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Content verilerini güncelle
export async function updateAboutContent(id: number, contentData: {
  title?: string
  description?: string
  icon?: string
  color?: string
  features?: string[]
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { title, description, icon, color, features, is_active } = contentData
    
    const [result] = await connection.execute(`
      UPDATE about_content 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          color = COALESCE(?, color),
          features = COALESCE(?, features),
          is_active = COALESCE(?, is_active),
          updated_at = NOW()
      WHERE id = ?
    `, [title, description, icon, color, features ? JSON.stringify(features) : null, is_active, id])
    
    return result
  } catch (error) {
    console.error('Content verisi güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Admin kullanıcıları tablosunu oluştur
export async function createAdminTables() {
  const connection = await getConnection()
  
  try {
    // Admin kullanıcıları tablosu
    await connection.execute(`DROP TABLE IF EXISTS admin_users`)
    await connection.execute(`
      CREATE TABLE admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // OTP kodları tablosu
    await connection.execute(`DROP TABLE IF EXISTS otp_codes`)
    await connection.execute(`
      CREATE TABLE otp_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp_code VARCHAR(6) NOT NULL,
        type ENUM('login', 'password_reset') NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Site logları tablosu
    await connection.execute(`DROP TABLE IF EXISTS site_logs`)
    await connection.execute(`
      CREATE TABLE site_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        session_id VARCHAR(255) NULL,
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50) NULL,
        resource_id INT NULL,
        details JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Sayfa görüntülemeleri tablosu
    await connection.execute(`DROP TABLE IF EXISTS page_views`)
    await connection.execute(`
      CREATE TABLE page_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_path VARCHAR(255) NOT NULL,
        page_title VARCHAR(255) NULL,
        user_id INT NULL,
        session_id VARCHAR(255) NULL,
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        referrer VARCHAR(500) NULL,
        duration_seconds INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Influencer tıklamaları tablosu
    await connection.execute(`DROP TABLE IF EXISTS influencer_clicks`)
    await connection.execute(`
      CREATE TABLE influencer_clicks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        influencer_id INT NOT NULL,
        user_id INT NULL,
        session_id VARCHAR(255) NULL,
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        source_page VARCHAR(255) NULL,
        click_type ENUM('profile_view', 'contact_click', 'social_media_click') NOT NULL,
        social_platform VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Meta yönetimi tablosu
    await connection.execute(`DROP TABLE IF EXISTS site_meta`)
    await connection.execute(`
      CREATE TABLE site_meta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_path VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        keywords TEXT NULL,
        og_title VARCHAR(255) NULL,
        og_description TEXT NULL,
        og_image VARCHAR(500) NULL,
        twitter_title VARCHAR(255) NULL,
        twitter_description TEXT NULL,
        twitter_image VARCHAR(500) NULL,
        canonical_url VARCHAR(500) NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // İndeksler oluştur
    await connection.execute(`CREATE INDEX idx_admin_users_email ON admin_users(email)`)
    await connection.execute(`CREATE INDEX idx_admin_users_username ON admin_users(username)`)
    await connection.execute(`CREATE INDEX idx_admin_users_active ON admin_users(is_active)`)
    
    await connection.execute(`CREATE INDEX idx_otp_email ON otp_codes(email)`)
    await connection.execute(`CREATE INDEX idx_otp_expires ON otp_codes(expires_at)`)
    await connection.execute(`CREATE INDEX idx_otp_used ON otp_codes(is_used)`)
    
    await connection.execute(`CREATE INDEX idx_site_logs_user ON site_logs(user_id)`)
    await connection.execute(`CREATE INDEX idx_site_logs_action ON site_logs(action)`)
    await connection.execute(`CREATE INDEX idx_site_logs_created ON site_logs(created_at)`)
    
    await connection.execute(`CREATE INDEX idx_page_views_path ON page_views(page_path)`)
    await connection.execute(`CREATE INDEX idx_page_views_user ON page_views(user_id)`)
    await connection.execute(`CREATE INDEX idx_page_views_created ON page_views(created_at)`)
    
    await connection.execute(`CREATE INDEX idx_influencer_clicks_influencer ON influencer_clicks(influencer_id)`)
    await connection.execute(`CREATE INDEX idx_influencer_clicks_type ON influencer_clicks(click_type)`)
    await connection.execute(`CREATE INDEX idx_influencer_clicks_created ON influencer_clicks(created_at)`)
    
    await connection.execute(`CREATE INDEX idx_site_meta_path ON site_meta(page_path)`)
    await connection.execute(`CREATE INDEX idx_site_meta_active ON site_meta(is_active)`)
    
    console.log('Admin tabloları başarıyla oluşturuldu')
  } catch (error) {
    console.error('Admin tabloları oluşturulurken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Admin kullanıcısı oluştur
export async function createAdminUser(userData: {
  username: string
  email: string
  password: string
  full_name: string
  role?: 'super_admin' | 'admin' | 'moderator'
}) {
  const connection = await getConnection()
  
  try {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const [result] = await connection.execute(`
      INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) 
      VALUES (?, ?, ?, ?, ?, 1)
    `, [userData.username, userData.email, hashedPassword, userData.full_name, userData.role || 'admin'])
    
    return result
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Admin kullanıcısı doğrula
export async function verifyAdminUser(email: string, password: string) {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT id, username, email, password_hash, full_name, role, is_active 
      FROM admin_users 
      WHERE email = ? AND is_active = 1
    `, [email])
    
    if ((rows as any[]).length === 0) {
      return null
    }
    
    const user = (rows as any[])[0]
    const bcrypt = require('bcryptjs')
    const isValid = await bcrypt.compare(password, user.password_hash)
    
    if (isValid) {
      // Son giriş zamanını güncelle
      await connection.execute(`
        UPDATE admin_users 
        SET last_login = NOW() 
        WHERE id = ?
      `, [user.id])
      
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    }
    
    return null
  } catch (error) {
    console.error('Admin kullanıcısı doğrulanırken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// OTP kodu oluştur
export async function createOTPCode(email: string, type: 'login' | 'password_reset') {
  const connection = await getConnection()
  
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 dakika
    
    // Eski OTP kodlarını temizle
    await connection.execute(`
      DELETE FROM otp_codes 
      WHERE email = ? AND type = ? AND (is_used = 1 OR expires_at < NOW())
    `, [email, type])
    
    // Yeni OTP kodu oluştur
    await connection.execute(`
      INSERT INTO otp_codes (email, otp_code, type, expires_at) 
      VALUES (?, ?, ?, ?)
    `, [email, otpCode, type, expiresAt])
    
    return otpCode
  } catch (error) {
    console.error('OTP kodu oluşturulurken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// OTP kodu doğrula
export async function verifyOTPCode(email: string, otpCode: string, type: 'login' | 'password_reset') {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT id, otp_code, is_used, expires_at 
      FROM otp_codes 
      WHERE email = ? AND type = ? AND is_used = 0 AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `, [email, type])
    
    if ((rows as any[]).length === 0) {
      return false
    }
    
    const otp = (rows as any[])[0]
    
    if (otp.otp_code === otpCode) {
      // OTP kodunu kullanıldı olarak işaretle
      await connection.execute(`
        UPDATE otp_codes 
        SET is_used = 1 
        WHERE id = ?
      `, [otp.id])
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('OTP kodu doğrulanırken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Site logu ekle
export async function addSiteLog(logData: {
  user_id?: number
  session_id?: string
  ip_address?: string
  user_agent?: string
  action: string
  resource_type?: string
  resource_id?: number
  details?: any
}) {
  const connection = await getConnection()
  
  try {
    const { user_id, session_id, ip_address, user_agent, action, resource_type, resource_id, details } = logData
    
    await connection.execute(`
      INSERT INTO site_logs (user_id, session_id, ip_address, user_agent, action, resource_type, resource_id, details) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [user_id, session_id, ip_address, user_agent, action, resource_type, resource_id, details ? JSON.stringify(details) : null])
  } catch (error) {
    console.error('Site logu eklenirken hata:', error)
    // Log hatası kritik değil, sessizce geç
  } finally {
    await closeConnection(connection)
  }
}

// Sayfa görüntülemesi ekle
export async function addPageView(viewData: {
  page_path: string
  page_title?: string
  user_id?: number
  session_id?: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  duration_seconds?: number
}) {
  const connection = await getConnection()
  
  try {
    const { page_path, page_title, user_id, session_id, ip_address, user_agent, referrer, duration_seconds } = viewData
    
    await connection.execute(`
      INSERT INTO page_views (page_path, page_title, user_id, session_id, ip_address, user_agent, referrer, duration_seconds) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [page_path, page_title, user_id, session_id, ip_address, user_agent, referrer, duration_seconds])
  } catch (error) {
    console.error('Sayfa görüntülemesi eklenirken hata:', error)
    // Log hatası kritik değil, sessizce geç
  } finally {
    await closeConnection(connection)
  }
}

// Influencer tıklaması ekle
export async function addInfluencerClick(clickData: {
  influencer_id: number
  user_id?: number
  session_id?: string
  ip_address?: string
  user_agent?: string
  source_page?: string
  click_type: 'profile_view' | 'contact_click' | 'social_media_click'
  social_platform?: string
}) {
  const connection = await getConnection()
  
  try {
    const { influencer_id, user_id, session_id, ip_address, user_agent, source_page, click_type, social_platform } = clickData
    
    await connection.execute(`
      INSERT INTO influencer_clicks (influencer_id, user_id, session_id, ip_address, user_agent, source_page, click_type, social_platform) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [influencer_id, user_id, session_id, ip_address, user_agent, source_page, click_type, social_platform])
  } catch (error) {
    console.error('Influencer tıklaması eklenirken hata:', error)
    // Log hatası kritik değil, sessizce geç
  } finally {
    await closeConnection(connection)
  }
}

// Dashboard istatistiklerini getir
export async function getDashboardStats() {
  const connection = await getConnection()
  
  try {
    // Toplam influencer sayısı
    const [influencerCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM influencers WHERE is_active = 1
    `)
    
    // Toplam brand sayısı
    const [brandCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM brands WHERE is_active = 1
    `)
    
    // Bugünkü sayfa görüntülemeleri
    const [todayViews] = await connection.execute(`
      SELECT COUNT(*) as count FROM page_views WHERE DATE(created_at) = CURDATE()
    `)
    
    // Bu haftaki sayfa görüntülemeleri
    const [weeklyViews] = await connection.execute(`
      SELECT COUNT(*) as count FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `)
    
    // En çok tıklanan influencerlar
    const [topInfluencers] = await connection.execute(`
      SELECT i.id, i.name, i.image_url, COUNT(ic.id) as click_count
      FROM influencers i
      LEFT JOIN influencer_clicks ic ON i.id = ic.influencer_id
      WHERE i.is_active = 1
      GROUP BY i.id, i.name, i.image_url
      ORDER BY click_count DESC
      LIMIT 5
    `)
    
    // Son aktiviteler
    const [recentActivities] = await connection.execute(`
      SELECT action, resource_type, resource_id, created_at
      FROM site_logs
      ORDER BY created_at DESC
      LIMIT 10
    `)
    
    return {
      influencerCount: (influencerCount as any[])[0].count,
      brandCount: (brandCount as any[])[0].count,
      todayViews: (todayViews as any[])[0].count,
      weeklyViews: (weeklyViews as any[])[0].count,
      topInfluencers,
      recentActivities
    }
  } catch (error) {
    console.error('Dashboard istatistikleri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Meta verilerini getir
export async function getSiteMeta(pagePath?: string) {
  const connection = await getConnection()
  
  try {
    let query = `
      SELECT * FROM site_meta WHERE is_active = 1
    `
    const params: any[] = []
    
    if (pagePath) {
      query += ` AND page_path = ?`
      params.push(pagePath)
    }
    
    query += ` ORDER BY page_path`
    
    const [rows] = await connection.execute(query, params)
    return rows
  } catch (error) {
    console.error('Meta verileri çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Meta verisi ekle/güncelle
export async function upsertSiteMeta(metaData: {
  page_path: string
  title: string
  description: string
  keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  canonical_url?: string
}) {
  const connection = await getConnection()
  
  try {
    const { page_path, title, description, keywords, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, canonical_url } = metaData
    
    const [result] = await connection.execute(`
      INSERT INTO site_meta (page_path, title, description, keywords, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, canonical_url, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        keywords = VALUES(keywords),
        og_title = VALUES(og_title),
        og_description = VALUES(og_description),
        og_image = VALUES(og_image),
        twitter_title = VALUES(twitter_title),
        twitter_description = VALUES(twitter_description),
        twitter_image = VALUES(twitter_image),
        canonical_url = VALUES(canonical_url),
        updated_at = NOW()
    `, [page_path, title, description, keywords, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, canonical_url])
    
    return result
  } catch (error) {
    console.error('Meta verisi eklenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Admin kullanıcılarını getir
export async function getAdminUsers() {
  const connection = await getConnection()
  
  try {
    const [rows] = await connection.execute(`
      SELECT id, username, email, full_name, role, is_active, last_login, created_at 
      FROM admin_users 
      ORDER BY created_at DESC
    `)
    
    return rows
  } catch (error) {
    console.error('Admin kullanıcıları çekilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Admin kullanıcısı güncelle
export async function updateAdminUser(id: number, userData: {
  username?: string
  email?: string
  full_name?: string
  role?: 'super_admin' | 'admin' | 'moderator'
  is_active?: boolean
}) {
  const connection = await getConnection()
  
  try {
    const { username, email, full_name, role, is_active } = userData
    
    const [result] = await connection.execute(`
      UPDATE admin_users 
      SET username = COALESCE(?, username),
          email = COALESCE(?, email),
          full_name = COALESCE(?, full_name),
          role = COALESCE(?, role),
          is_active = COALESCE(?, is_active),
          updated_at = NOW()
      WHERE id = ?
    `, [username, email, full_name, role, is_active, id])
    
    return result
  } catch (error) {
    console.error('Admin kullanıcısı güncellenirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}

// Admin şifre değiştir
export async function changeAdminPassword(id: number, newPassword: string) {
  const connection = await getConnection()
  
  try {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    const [result] = await connection.execute(`
      UPDATE admin_users 
      SET password_hash = ?, updated_at = NOW()
      WHERE id = ?
    `, [hashedPassword, id])
    
    return result
  } catch (error) {
    console.error('Admin şifresi değiştirilirken hata:', error)
    throw error
  } finally {
    await closeConnection(connection)
  }
}
