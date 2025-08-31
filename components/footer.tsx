import Link from "next/link"
import {
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Users,
  Award,
} from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Yeşil çizgi */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 z-20"></div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-400/10 to-green-600/10 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80"></div>
      <div className="absolute inset-0 particle-bg opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
          <div className="text-center group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black text-green-400 mb-0.5 sm:mb-1">500+</div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm">Aktif Influencer</div>
          </div>
          <div className="text-center group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black text-green-400 mb-0.5 sm:mb-1">1M+</div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm">Toplam Erişim</div>
          </div>
          <div className="text-center group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black text-green-400 mb-0.5 sm:mb-1">250+</div>
            <div className="text-gray-400 font-medium text-xs sm:text-sm">Başarılı Kampanya</div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Brand */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="font-black text-xl sm:text-2xl text-white font-heading hover:scale-105 transform transition-all duration-300"
              >
                kesif<span className="text-green-400">Collective</span>
              </Link>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 animate-pulse" />
            </div>
            <p className="text-gray-400 font-body leading-relaxed text-xs sm:text-sm">
              Türkiye'nin önde gelen influencer marketing ajansı. Markanızı doğru influencerlarla buluşturarak dijital
              dünyada fark yaratıyoruz.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <Link
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-pink-400 hover:scale-110 transform transition-all duration-300 backdrop-blur-sm border border-gray-700 hover:shadow-lg hover:shadow-pink-500/25"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:scale-110 transform transition-all duration-300 backdrop-blur-sm border border-gray-700 hover:shadow-lg hover:shadow-red-500/25"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:scale-110 transform transition-all duration-300 backdrop-blur-sm border border-gray-700 hover:shadow-lg hover:shadow-blue-400/25"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:scale-110 transform transition-all duration-300 backdrop-blur-sm border border-gray-700 hover:shadow-lg hover:shadow-blue-600/25"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-bold text-base sm:text-lg font-heading text-green-400">Hizmetlerimiz</h3>
            <ul className="space-y-1 sm:space-y-1.5 text-gray-400 text-xs sm:text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Influencer Marketing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Kampanya Yönetimi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  İçerik Üretimi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Analiz & Raporlama
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-bold text-base sm:text-lg font-heading text-green-400">Şirket</h3>
            <ul className="space-y-1 sm:space-y-1.5 text-gray-400 text-xs sm:text-sm">
              <li>
                <Link
                  href="#about"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="#influencers"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Influencerlarımız
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Kariyer
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2 transform inline-block font-medium group flex items-center"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-bold text-base sm:text-lg font-heading text-green-400">İletişim</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 font-medium text-xs sm:text-sm">
              <li className="flex items-center space-x-2 sm:space-x-3 hover:text-green-400 transition-colors duration-300 group">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span>info@kesifcollective.com</span>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3 hover:text-green-400 transition-colors duration-300 group">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span>+90 212 555 0123</span>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3 hover:text-green-400 transition-colors duration-300 group">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span>Maslak, İstanbul</span>
              </li>
            </ul>

            <div className="mt-2 sm:mt-3 flex flex-col items-center">
              <h4 className="font-semibold mb-1.5 sm:mb-2 text-white text-xs sm:text-sm text-center">Newsletter</h4>
              <div className="flex space-x-2 w-full max-w-sm">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800/50 border border-green-500/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 text-white placeholder-gray-500"
                />
                <button className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:scale-105 transition-transform duration-300 text-xs sm:text-sm font-medium shadow-lg shadow-green-500/25">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 sm:mt-8 pt-3 sm:pt-4">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-400/10 to-green-600/10 rounded-xl sm:rounded-2xl blur-xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-xl border border-green-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 sm:space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <p className="text-white font-semibold text-sm sm:text-base mb-1">
                  &copy; 2024 <span className="text-green-400 font-black text-base sm:text-lg">kesifCollective</span>
                </p>
                <p className="text-gray-400 text-xs">Türkiye'nin en güvenilir influencer marketing platformu</p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-end gap-2 sm:gap-4 text-xs">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-105 transform font-medium relative group"
                >
                  <span className="relative z-10">Gizlilik Politikası</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </Link>
                <span className="text-green-400/30">•</span>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-105 transform font-medium relative group"
                >
                  <span className="relative z-10">Kullanım Şartları</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </Link>
                <span className="text-green-400/30">•</span>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-105 transform font-medium relative group"
                >
                  <span className="relative z-10">Çerez Politikası</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
