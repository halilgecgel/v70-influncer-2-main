import { sql } from '@vercel/postgres'

export async function setupTeklifDB() {
  try {
    // Teklifler tablosunu oluştur
    await sql`
      CREATE TABLE IF NOT EXISTS teklifler (
        id SERIAL PRIMARY KEY,
        influencer_id INTEGER NOT NULL,
        influencer_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        teklif_metni TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log('✅ Teklifler tablosu başarıyla oluşturuldu')
  } catch (error) {
    console.error('❌ Teklifler tablosu oluşturulurken hata:', error)
  }
}

// Script çalıştırılırsa
if (require.main === module) {
  setupTeklifDB()
}
