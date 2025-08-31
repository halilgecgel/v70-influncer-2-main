"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeklifForm from "@/components/teklif-form"
import {
  Instagram,
  Youtube,
  Star,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Camera,
  Heart,
  Share2,
  MessageCircle,
  ExternalLink,
  Play,
  Eye,
  ThumbsUp,
  X,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Influencer {
  id: number
  name: string
  slug: string
  category: string
  image_url: string
  specialties: string[]
  social_media: {
    instagram?: string
    tiktok?: string
    youtube?: string
  }
  sort_order: number
  created_at: string
  // Detay alanları
  bio?: string
  location?: string
  rating?: number
  join_date?: string
  total_reach?: string
  campaigns_count?: number
  email?: string
  phone?: string
  portfolio?: string[]
  achievements?: string[]
  recent_campaigns?: Array<{
    brand: string
    type: string
    date: string
  }>
  engagement_rate?: string
}

export default function InfluencerDetailPage() {
  const params = useParams()
  const [isVisible, setIsVisible] = useState(false)
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("contact")

  useEffect(() => {
    setIsVisible(true)
    if (params.slug) {
      fetchInfluencer()
    }
  }, [params.slug])

  const fetchInfluencer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/influencers/${params.slug}`)
      const result = await response.json()
      
      if (result.success) {
        setInfluencer(result.data)
        // Profil görüntülemesi logla
        logInfluencerClick(result.data.id, 'profile_view')
      } else {
        setError(result.error || 'Influencer bulunamadı')
      }
    } catch (error) {
      console.error('Influencer verisi çekilirken hata:', error)
      setError('Influencer verisi alınamadı')
    } finally {
      setLoading(false)
    }
  }

  const logInfluencerClick = async (influencerId: number, clickType: string, socialPlatform?: string) => {
    try {
      await fetch('/api/log/influencer-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          influencer_id: influencerId,
          click_type: clickType,
          social_platform: socialPlatform,
          source_page: window.location.pathname
        }),
      })
    } catch (error) {
      console.error('Tıklama loglanamadı:', error)
    }
  }

  const handleTeklifGonder = async (data: { email: string; teklif: string }) => {
    if (!influencer) {
      throw new Error('Influencer bilgisi bulunamadı')
    }

    try {
      const response = await fetch('/api/teklif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          influencerId: influencer.id,
          influencerName: influencer.name,
          userEmail: data.email,
          teklif: data.teklif
        }),
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Teklif gönderilemedi')
      }

      return result
    } catch (error) {
      console.error('Teklif gönderme hatası:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <p className="text-lg text-foreground mt-6 font-medium">Influencer verisi yükleniyor...</p>
          <p className="text-sm text-muted-foreground mt-2">Lütfen bekleyin</p>
        </div>
      </div>
    )
  }

  if (error || !influencer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-foreground">İnfluencer bulunamadı</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/influencers">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Influencer Listesine Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )

  // Varsayılan değerler (veritabanında veri yoksa)
  const defaultData = {
    bio: "Profesyonel influencer ve content creator. Yaratıcı içerikler ve etkileyici kampanyalarla markaların dijital varlığını güçlendiriyorum.",
    location: "İstanbul",
    rating: 4.8,
    joinDate: "2020",
    totalReach: "2.5M",
    campaigns: 45,
    email: "contact@kesifcollective.com",
    phone: "+90 555 000 0000",
    portfolio: [
      "/fashion-post-1.png",
      "/fashion-post-2.png", 
      "/makeup-tutorial.png",
      "/daily-routine.png",
      "/cozy-home-reading.png"
    ],
    achievements: [
      "2024 En İyi Moda Influencer'ı",
      "1M+ Takipçi Başarısı",
      "50+ Başarılı Kampanya",
      "Yılın İçerik Üreticisi"
    ],
    recentCampaigns: [
      { brand: "Nike", type: "Spor Giyim Kampanyası", date: "2024" },
      { brand: "L'Oreal", type: "Güzellik Ürünleri", date: "2024" },
      { brand: "Starbucks", type: "Yaşam Tarzı", date: "2024" }
    ],
    engagementRate: "8.5%"
  }

  const formatNumber = (num: string) => {
    if (num.includes('K')) return num
    if (num.includes('M')) return num
    const numValue = parseInt(num)
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}M`
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(0)}K`
    return num
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-16 right-16 sm:bottom-20 sm:right-20 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link href="/influencers">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm">
                {influencer.category}
              </Badge>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <div className="space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-1">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                  {influencer.name}
                </h1>
                {influencer.bio && (
                  <p className="text-sm sm:text-base md:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                    {influencer.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8">
                  {influencer.specialties.map((specialty, idx) => (
                    <Badge
                      key={idx}
                      className="bg-white/20 text-white border border-white/30 px-2 sm:px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold backdrop-blur-sm"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-8 text-white">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/70">Konum</p>
                    <p className="font-semibold text-xs sm:text-sm md:text-base">{influencer.location || defaultData.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="hidden sm:block h-6 w-px bg-white/30"></div>
              </div>

              {/* Desktop Stats Cards - Yan yana */}
              <div className="hidden lg:grid grid-cols-2 gap-3">
                {influencer.social_media.instagram && influencer.social_media.instagram !== "0" && (
                  <Card 
                    className="text-center p-4 bg-white/15 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 group cursor-pointer"
                    onClick={() => logInfluencerClick(influencer.id, 'social_media_click', 'instagram')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">{formatNumber(influencer.social_media.instagram)}</h3>
                        <p className="text-white/80 font-medium text-sm">Instagram Takipçi</p>
                      </div>
                    </div>
                  </Card>
                )}
                
                {influencer.social_media.tiktok && influencer.social_media.tiktok !== "0" && (
                  <Card 
                    className="text-center p-4 bg-white/15 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 group cursor-pointer"
                    onClick={() => logInfluencerClick(influencer.id, 'social_media_click', 'tiktok')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TikTokIcon />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">{formatNumber(influencer.social_media.tiktok)}</h3>
                        <p className="text-white/80 font-medium text-sm">TikTok Takipçi</p>
                      </div>
                    </div>
                  </Card>
                )}
                
                {influencer.social_media.youtube && influencer.social_media.youtube !== "0" && (
                  <Card 
                    className="text-center p-4 bg-white/15 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 group cursor-pointer"
                    onClick={() => logInfluencerClick(influencer.id, 'social_media_click', 'youtube')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Youtube className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">{formatNumber(influencer.social_media.youtube)}</h3>
                        <p className="text-white/80 font-medium text-sm">YouTube Abone</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Desktop Teklif Form - Sol tarafta inline */}
              <div className="hidden lg:block">
                <Card className="p-6 bg-white/15 backdrop-blur-md border-white/30 shadow-2xl">
                  <TeklifForm 
                    influencerName={influencer.name}
                    influencerId={influencer.id}
                    onTeklifGonder={handleTeklifGonder}
                  />
                </Card>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl">
                <img
                  src={influencer.image_url || "/placeholder.svg"}
                  alt={influencer.name}
                  className="w-full h-64 sm:h-72 md:h-[500px] lg:h-[600px] object-contain object-center"
                  style={{ aspectRatio: "3/4", objectFit: "contain" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              {/* Mobile Teklif Button - Resmin altında */}
              <div className="lg:hidden mt-4">
                <Card className="p-4 bg-white/15 backdrop-blur-md border-white/30">

                  <TeklifForm 
                    influencerName={influencer.name}
                    influencerId={influencer.id}
                    onTeklifGonder={handleTeklifGonder}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-16">
        {/* Stats Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          {influencer.social_media.instagram && influencer.social_media.instagram !== "0" && (
            <Card 
              className="text-center p-3 sm:p-4 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => logInfluencerClick(influencer.id, 'social_media_click', 'instagram')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">{formatNumber(influencer.social_media.instagram)}</h3>
              <p className="text-muted-foreground font-medium text-xs md:text-sm">Instagram Takipçi</p>
            </Card>
          )}
          
          {influencer.social_media.tiktok && influencer.social_media.tiktok !== "0" && (
            <Card 
              className="text-center p-3 sm:p-4 md:p-8 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => logInfluencerClick(influencer.id, 'social_media_click', 'tiktok')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <TikTokIcon />
              </div>
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">{formatNumber(influencer.social_media.tiktok)}</h3>
              <p className="text-muted-foreground font-medium text-xs md:text-sm">TikTok Takipçi</p>
            </Card>
          )}
          
          {influencer.social_media.youtube && influencer.social_media.youtube !== "0" && (
            <Card 
              className="text-center p-3 sm:p-4 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => logInfluencerClick(influencer.id, 'social_media_click', 'youtube')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">{formatNumber(influencer.social_media.youtube)}</h3>
              <p className="text-muted-foreground font-medium text-xs md:text-sm">YouTube Abone</p>
            </Card>
          )}
        </div>


      </div>
      
      <Footer />
    </div>
  )
}
