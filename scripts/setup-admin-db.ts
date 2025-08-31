import { 
  createAdminTables, 
  createAdminUser,
  createSliderTable,
  insertSampleData,
  createInfluencersTable,
  insertSampleInfluencers,
  createBrandsTable,
  insertSampleBrands,
  createAboutTables,
  insertAboutSampleData
} from '../lib/database'

async function setupAdminDatabase() {
  try {
    console.log('Admin veritabanı kurulumu başlıyor...')
    
    // Admin tablolarını oluştur
    console.log('Admin tabloları oluşturuluyor...')
    await createAdminTables()
    
    // Örnek admin kullanıcısı oluştur
    console.log('Örnek admin kullanıcısı oluşturuluyor...')
    await createAdminUser({
      username: 'admin',
      email: 'admin@kesifcollective.com',
      password: 'admin123',
      full_name: 'Admin Kullanıcı',
      role: 'super_admin'
    })
    
    // Diğer tabloları da oluştur (eğer yoksa)
    console.log('Slider tablosu oluşturuluyor...')
    await createSliderTable()
    await insertSampleData()
    
    console.log('Influencers tablosu oluşturuluyor...')
    await createInfluencersTable()
    await insertSampleInfluencers()
    
    console.log('Brands tablosu oluşturuluyor...')
    await createBrandsTable()
    await insertSampleBrands()
    
    console.log('About tabloları oluşturuluyor...')
    await createAboutTables()
    await insertAboutSampleData()
    
    console.log('✅ Admin veritabanı kurulumu tamamlandı!')
    console.log('📧 Admin giriş bilgileri:')
    console.log('   Email: admin@kesifcollective.com')
    console.log('   Şifre: admin123')
    console.log('   OTP Kodu: 123456 (test için)')
    
  } catch (error) {
    console.error('❌ Admin veritabanı kurulumu başarısız:', error)
    process.exit(1)
  }
}

setupAdminDatabase()
