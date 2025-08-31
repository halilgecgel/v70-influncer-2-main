import { 
  initializeDatabase, 
  createBrandsTable, 
  insertSampleBrands,
  testConnection 
} from '../lib/database'

async function setupBrandsDatabase() {
  try {
    console.log('Brands veritabanı kurulumu başlatılıyor...')
    
    // Veritabanı bağlantısını test et
    const isConnected = await testConnection()
    if (!isConnected) {
      console.error('Veritabanı bağlantısı başarısız!')
      process.exit(1)
    }
    
    // Brands tablosunu oluştur
    console.log('Brands tablosu oluşturuluyor...')
    await createBrandsTable()
    
    // Örnek verileri ekle
    console.log('Örnek brands verileri ekleniyor...')
    await insertSampleBrands()
    
    console.log('✅ Brands veritabanı kurulumu tamamlandı!')
    
  } catch (error) {
    console.error('❌ Brands veritabanı kurulumu sırasında hata:', error)
    process.exit(1)
  } finally {
    // Veritabanı bağlantısını kapat
    process.exit(0)
  }
}

// Script'i çalıştır
setupBrandsDatabase()
