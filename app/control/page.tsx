"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Award, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Shield,
  Lock,
  Mail
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"
import { BrandsManagement } from "@/components/admin/brands-management"
import { SliderManagement } from "@/components/admin/slider-management"
import { AboutManagement } from "@/components/admin/about-management"
import { LogsManagement } from "@/components/admin/logs-management"
import { InfluencersManagement } from "@/components/admin/influencers-management"
import Image from "next/image"

interface AdminUser {
  id: number
  username: string
  email: string
  full_name: string
  role: string
}

interface DashboardStats {
  influencerCount: number
  brandCount: number
  todayViews: number
  weeklyViews: number
  topInfluencers: any[]
  recentActivities: any[]
}



// AnimatedParticles component to avoid hydration issues
function AnimatedParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number
    left: number
    top: number
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    // Generate particles only on client side
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-green-500/30 rounded-full animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  )
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [requiresOTP, setRequiresOTP] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('adminUser')
    const savedTab = localStorage.getItem('adminActiveTab')
    
    if (user) {
      setCurrentUser(JSON.parse(user))
      setIsLoggedIn(true)
      fetchDashboardData()
    }
    
    // Restore active tab from localStorage
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/admin/dashboard')
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Dashboard verileri alınamadı:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          otpCode: requiresOTP ? otpCode : undefined
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.requiresOTP) {
          setRequiresOTP(true)
          toast({
            title: "OTP Kodu Gönderildi",
            description: "Email adresinize OTP kodu gönderildi.",
          })
        } else {
          setCurrentUser(data.user)
          setIsLoggedIn(true)
          localStorage.setItem('adminUser', JSON.stringify(data.user))
          toast({
            title: "Giriş Başarılı",
            description: "Admin paneline hoş geldiniz!",
          })
          fetchDashboardData()
        }
      } else {
        toast({
          title: "Giriş Başarısız",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminActiveTab')
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yapıldı.",
    })
  }

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    localStorage.setItem('adminActiveTab', newTab)
  }



  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with kesif gradient */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 kesif-radial-gradient"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black"></div>
        </div>

        {/* Animated background particles */}
        <AnimatedParticles />

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="flex justify-center mb-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.JPG-CrCcuJaqI3JXZPdI1EQpGWcLp4AReM.jpeg"
                  alt="kesif Collective"
                  width={200}
                  height={80}
                  className="h-16 w-auto object-contain filter drop-shadow-lg"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 font-heading">
                Admin Paneli
              </h1>
              <p className="text-gray-400 text-sm">
                {requiresOTP ? "Güvenlik doğrulaması" : "Yönetim paneline erişim"}
              </p>
            </div>

            {/* Login Card */}
            <Card className="glass-effect border-green-500/20 shadow-2xl shadow-green-500/10 animate-scale-in">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-500/10 rounded-full border border-green-500/20">
                    <Shield className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  {requiresOTP ? "OTP Doğrulaması" : "Giriş Yapın"}
                </CardTitle>
                <p className="text-gray-400 text-sm mt-2">
                  {requiresOTP 
                    ? "Email adresinize gönderilen 6 haneli kodu girin" 
                    : "Güvenli erişim için bilgilerinizi girin"
                  }
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  {!requiresOTP ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-green-500" />
                            <span>Email Adresi</span>
                          </div>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300"
                          placeholder="admin@kesifcollective.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4 text-green-500" />
                            <span>Şifre</span>
                          </div>
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-white text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-green-500" />
                          <span>OTP Kodu</span>
                        </div>
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300 text-center text-lg tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-gray-400 text-center">
                        6 haneli kodu girin
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Yükleniyor...</span>
                      </div>
                    ) : (
                      requiresOTP ? "Doğrula" : "Giriş Yap"
                    )}
                  </Button>
                  
                  {requiresOTP && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                      onClick={() => setRequiresOTP(false)}
                    >
                      Geri Dön
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 animate-fade-in-delayed">
              <p className="text-gray-500 text-xs">
                © 2024 kesif Collective. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "influencers" && "Influencer Yönetimi"}
                  {activeTab === "brands" && "Marka Yönetimi"}
                  {activeTab === "slider" && "Slider Yönetimi"}
                  {activeTab === "about" && "Hakkımızda Yönetimi"}
                  {activeTab === "logs" && "Log Yönetimi"}
                  {activeTab === "analytics" && "Analitik"}
                  {activeTab === "followers" && "Takipçi Sorgu"}
                  {activeTab === "meta" && "Meta Ayarları"}
                  {activeTab === "theme" && "Tema Ayarları"}
                  {activeTab === "database" && "Veritabanı"}
                  {activeTab === "settings" && "Genel Ayarlar"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Hoş geldin, {currentUser?.full_name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {stats && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Users className="w-8 h-8 text-green-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Toplam Influencer</p>
                            <p className="text-2xl font-bold text-white">{stats.influencerCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Award className="w-8 h-8 text-blue-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Toplam Marka</p>
                            <p className="text-2xl font-bold text-white">{stats.brandCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Eye className="w-8 h-8 text-purple-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Bugünkü Görüntüleme</p>
                            <p className="text-2xl font-bold text-white">{stats.todayViews}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <TrendingUp className="w-8 h-8 text-yellow-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-400">Haftalık Görüntüleme</p>
                            <p className="text-2xl font-bold text-white">{stats.weeklyViews}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Influencers */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">En Çok Tıklanan Influencerlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.topInfluencers.map((influencer: any, index: number) => (
                          <div key={influencer.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <span className="text-2xl font-bold text-green-500">#{index + 1}</span>
                              <img 
                                src={influencer.image_url} 
                                alt={influencer.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-white">{influencer.name}</p>
                                <p className="text-sm text-gray-400">{influencer.click_count} tıklama</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Influencers Tab */}
          {activeTab === "influencers" && <InfluencersManagement />}

          {/* Brands Tab */}
          {activeTab === "brands" && <BrandsManagement />}

          {/* Slider Tab */}
          {activeTab === "slider" && <SliderManagement />}

          {/* About Tab */}
          {activeTab === "about" && <AboutManagement />}

          {/* Logs Tab */}
          {activeTab === "logs" && <LogsManagement />}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Analitik</CardTitle>
                  <p className="text-gray-400">Detaylı analitik özellikleri yakında eklenecek...</p>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Followers Tab */}
          {activeTab === "followers" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Takipçi Sorgu</CardTitle>
                  <p className="text-gray-400">Takipçi sorgulama özellikleri yakında eklenecek...</p>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Meta Tab */}
          {activeTab === "meta" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Meta Ayarları</CardTitle>
                  <p className="text-gray-400">SEO ve meta ayarları yakında eklenecek...</p>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Tema Ayarları</CardTitle>
                  <p className="text-gray-400">Görsel ayarlar yakında eklenecek...</p>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Database Tab */}
          {activeTab === "database" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Veritabanı Yönetimi</CardTitle>
                  <p className="text-gray-400">Veritabanı yönetimi özellikleri yakında eklenecek...</p>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Genel Ayarlar</CardTitle>
                  <p className="text-gray-400">Sistem ayarları yakında eklenecek...</p>
                </CardHeader>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
