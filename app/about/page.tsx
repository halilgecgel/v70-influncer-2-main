"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  TrendingUp,
  Award,
  Target,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  Zap,
  Shield,
  Lightbulb,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Icon mapping
const iconMap: { [key: string]: any } = {
  Users,
  TrendingUp,
  Award,
  Target,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  Zap,
  Shield,
  Lightbulb,
}

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [aboutData, setAboutData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about')
      const result = await response.json()
      
      if (result.success) {
        setAboutData(result.data)
      } else {
        console.error('About verileri çekilemedi:', result.error)
      }
    } catch (error) {
      console.error('About verileri çekilirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fallback veriler (eğer API'den veri gelmezse)
  const fallbackStats = [
    { icon: Users, value: "500+", label: "Influencer", color: "from-primary to-secondary" },
    { icon: TrendingUp, value: "1000+", label: "Başarılı Kampanya", color: "from-secondary to-primary" },
    { icon: Award, value: "50+", label: "Marka Partneri", color: "from-primary to-secondary" },
    { icon: Target, value: "2M+", label: "Toplam Erişim", color: "from-secondary to-primary" },
  ]

  const fallbackValues = [
    {
      icon: Heart,
      title: "Güvenilirlik",
      description: "Markalar ve influencer'lar arasında güvenilir köprü kuruyoruz.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Hedef Odaklı",
      description: "Her kampanya için özel stratejiler geliştiriyoruz.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Hızlı Sonuç",
      description: "Kısa sürede etkili sonuçlar elde ediyoruz.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Kalite Garantisi",
      description: "Her projede en yüksek kaliteyi garanti ediyoruz.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Global Erişim",
      description: "Türkiye ve dünya çapında geniş ağımızla hizmet veriyoruz.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Lightbulb,
      title: "Yaratıcılık",
      description: "Yenilikçi ve yaratıcı çözümler sunuyoruz.",
      color: "from-pink-500 to-rose-500"
    }
  ]

  const fallbackTeam = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & CEO",
      image: "/placeholder-user.jpg",
      description: "10+ yıl dijital pazarlama deneyimi"
    },
    {
      name: "Ayşe Demir",
      role: "Pazarlama Direktörü",
      image: "/placeholder-user.jpg",
      description: "Influencer marketing uzmanı"
    },
    {
      name: "Mehmet Kaya",
      role: "Teknoloji Lideri",
      image: "/placeholder-user.jpg",
      description: "Yazılım ve analitik uzmanı"
    },
    {
      name: "Zeynep Özkan",
      role: "İçerik Stratejisti",
      image: "/placeholder-user.jpg",
      description: "Yaratıcı içerik ve kampanya uzmanı"
    }
  ]

  // Verileri kullan (API'den gelmezse fallback kullan)
  const stats = aboutData?.stats || fallbackStats
  const values = aboutData?.values || fallbackValues
  const team = aboutData?.team || fallbackTeam
  const content = aboutData?.content || []

  // Mission ve Vision verilerini ayır
  const mission = content.find((item: any) => item.type === 'mission')
  const vision = content.find((item: any) => item.type === 'vision')

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-primary/50 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className={`text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 mb-6 backdrop-blur-sm">
              Hakkımızda
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight mobile-text-scale">
              Kesif Collective
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed mobile-subtitle">
              Türkiye'nin önde gelen influencer marketing ajansı olarak, markalar ve influencer'lar arasında güçlü köprüler kuruyoruz.
            </p>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Stats Section */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 md:mb-24 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          {stats.map((stat: any, idx: number) => {
            const IconComponent = iconMap[stat.icon] || Users
            return (
              <Card key={idx} className="text-center p-6 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </Card>
            )
          })}
        </div>

        {/* Mission & Vision */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 md:mb-24 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {mission?.title || "Misyonumuz"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {mission?.description || "Markalar ve influencer'lar arasında güvenilir, şeffaf ve etkili işbirlikleri kurarak, her iki tarafın da hedeflerine ulaşmasını sağlamak."}
            </p>
            <ul className="space-y-3">
              {(mission?.features || ['Kaliteli içerik üretimi', 'Hedef kitle analizi', 'Performans takibi']).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8 md:p-12 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {vision?.title || "Vizyonumuz"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {vision?.description || "Türkiye'nin en güvenilir ve yenilikçi influencer marketing platformu olarak, dijital pazarlama dünyasında öncü rol oynamak."}
            </p>
            <ul className="space-y-3">
              {(vision?.features || ['Teknoloji odaklı çözümler', 'Global genişleme', 'Sürdürülebilir büyüme']).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Değerlerimiz</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Çalışma prensiplerimizi oluşturan temel değerlerimiz
            </p>
          </div>
          
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            {values.map((value: any, idx: number) => {
              const IconComponent = iconMap[value.icon] || Heart
              return (
                <Card key={idx} className="p-6 md:p-8 hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}


        {/* CTA Section */}
        <div
          className={`text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >

        </div>
      </div>
      
      <Footer />
    </div>
  )
}
