import { 
  initializeDatabase, 
  createInfluencersTable, 
  insertSampleInfluencers,
  testConnection 
} from '../lib/database'

async function setupInfluencersDatabase() {
  try {
    console.log('🔧 Influencer veritabanı kurulumu başlatılıyor...')
    
    // Veritabanı bağlantısını test et
    console.log('📡 Veritabanı bağlantısı test ediliyor...')
    const isConnected = await testConnection()
    
    if (!isConnected) {
      console.error('❌ Veritabanı bağlantısı başarısız!')
      console.log('💡 Lütfen şunları kontrol edin:')
      console.log('   - MySQL servisinin çalıştığından emin olun')
      console.log('   - .env dosyasındaki veritabanı bilgilerini kontrol edin')
      console.log('   - Veritabanının oluşturulduğundan emin olun')
      process.exit(1)
    }
    
    console.log('✅ Veritabanı bağlantısı başarılı!')
    
    // Influencer tablosunu oluştur
    console.log('📋 Influencer tablosu oluşturuluyor...')
    await createInfluencersTable()
    console.log('✅ Influencer tablosu oluşturuldu!')
    
    // Örnek verileri ekle
    console.log('📝 Örnek influencer verileri ekleniyor...')
    await insertSampleInfluencers()
    console.log('✅ Örnek veriler eklendi!')
    
    console.log('🎉 Influencer veritabanı kurulumu tamamlandı!')
    console.log('📊 Artık /api/influencers endpoint\'ini kullanabilirsiniz.')
    
  } catch (error) {
    console.error('❌ Veritabanı kurulumu sırasında hata:', error)
    process.exit(1)
  }
}

// Script çalıştırılıyorsa
if (require.main === module) {
  setupInfluencersDatabase()
}

export { setupInfluencersDatabase }
