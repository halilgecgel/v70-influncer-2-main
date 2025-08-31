import { 
  createAboutTables, 
  insertAboutSampleData, 
  testConnection 
} from '../lib/database'

async function setupAboutDatabase() {
  try {
    console.log('About sayfası veritabanı kurulumu başlatılıyor...')
    
    // Veritabanı bağlantısını test et
    const isConnected = await testConnection()
    if (!isConnected) {
      console.error('Veritabanı bağlantısı başarısız!')
      process.exit(1)
    }
    
    console.log('✅ Veritabanı bağlantısı başarılı')
    
    // About tablolarını oluştur
    console.log('📋 About tabloları oluşturuluyor...')
    await createAboutTables()
    console.log('✅ About tabloları oluşturuldu')
    
    // Örnek verileri ekle
    console.log('📝 Örnek veriler ekleniyor...')
    await insertAboutSampleData()
    console.log('✅ Örnek veriler eklendi')
    
    console.log('🎉 About sayfası veritabanı kurulumu tamamlandı!')
    
  } catch (error) {
    console.error('❌ About sayfası veritabanı kurulumu sırasında hata:', error)
    process.exit(1)
  }
}

// Scripti çalıştır
setupAboutDatabase()
