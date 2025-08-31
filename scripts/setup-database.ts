import { createSliderTable, insertSampleData, testConnection } from '../lib/database'

async function setupDatabase() {
  console.log('🔧 Veritabanı kurulumu başlatılıyor...')
  
  try {
    // Veritabanı bağlantısını test et
    console.log('📡 Veritabanı bağlantısı test ediliyor...')
    const isConnected = await testConnection()
    
    if (!isConnected) {
      console.error('❌ Veritabanı bağlantısı başarısız!')
      console.log('Lütfen .env.local dosyasındaki veritabanı ayarlarını kontrol edin.')
      process.exit(1)
    }
    
    console.log('✅ Veritabanı bağlantısı başarılı!')
    
    // Slider tablosunu oluştur
    console.log('📋 Slider tablosu oluşturuluyor...')
    await createSliderTable()
    console.log('✅ Slider tablosu oluşturuldu!')
    
    // Örnek verileri ekle
    console.log('📝 Örnek veriler ekleniyor...')
    await insertSampleData()
    console.log('✅ Örnek veriler eklendi!')
    
    console.log('🎉 Veritabanı kurulumu tamamlandı!')
    console.log('Slider artık MySQL ile çalışmaya hazır.')
    
  } catch (error) {
    console.error('❌ Veritabanı kurulumu sırasında hata:', error)
    process.exit(1)
  }
}

// Script'i çalıştır
setupDatabase()
