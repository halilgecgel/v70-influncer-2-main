import { getConnection, closeConnection } from '@/lib/database'

async function updateInfluencersWithSlug() {
  const connection = await getConnection()
  
  try {
    console.log('Influencer tablosuna slug alanı ekleniyor...')
    
    // Önce slug sütununu ekle (eğer yoksa)
    try {
      await connection.execute(`
        ALTER TABLE influencers 
        ADD COLUMN slug VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE
      `)
      console.log('Slug sütunu eklendi')
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('Slug sütunu zaten mevcut')
      } else {
        throw error
      }
    }
    
    // Slug indeksini ekle
    try {
      await connection.execute(`
        CREATE INDEX idx_influencers_slug ON influencers(slug)
      `)
      console.log('Slug indeksi eklendi')
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('Slug indeksi zaten mevcut')
      } else {
        throw error
      }
    }
    
    // Mevcut influencer verilerini güncelle
    const [rows] = await connection.execute(`
      SELECT id, name FROM influencers WHERE slug IS NULL OR slug = ''
    `)
    
    console.log(`${(rows as any[]).length} influencer için slug güncellenecek`)
    
    for (const row of rows as any[]) {
      const slug = createSlug(row.name)
      
      await connection.execute(`
        UPDATE influencers 
        SET slug = ? 
        WHERE id = ?
      `, [slug, row.id])
      
      console.log(`${row.name} -> ${slug}`)
    }
    
    console.log('Tüm influencer slug\'ları başarıyla güncellendi!')
    
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await closeConnection(connection)
  }
}

function createSlug(name: string): string {
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
    .trim()
}

// Scripti çalıştır
updateInfluencersWithSlug()
  .then(() => {
    console.log('Script tamamlandı')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script hatası:', error)
    process.exit(1)
  })
