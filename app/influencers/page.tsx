"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Instagram, Youtube, Search, ArrowLeft, Grid, List } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TeklifForm from "@/components/teklif-form"

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
}

interface Category {
  id: string
  label: string
}

export default function InfluencersPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("name")
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleTeklifGonder = async (data: { email: string; teklif: string }, influencer: Influencer) => {
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

  useEffect(() => {
    setIsVisible(true)
    fetchInfluencers()
    fetchCategories()
  }, [])

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/influencers')
      const result = await response.json()
      
      if (result.success) {
        setInfluencers(result.data)
      } else {
        setError(result.error || 'Influencer verileri alınamadı')
      }
    } catch (error) {
      console.error('Influencer verileri çekilirken hata:', error)
      setError('Influencer verileri alınamadı')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/influencers/categories')
      const result = await response.json()
      
      if (result.success) {
        // "Tümü" kategorisini başa ekle ve diğer kategorileri formatla
        const formattedCategories = [
          { id: "all", label: "Tümü" },
          ...result.data.map((category: string) => ({
            id: category,
            label: getCategoryLabel(category)
          }))
        ]
        setCategories(formattedCategories)
      }
    } catch (error) {
      console.error('Kategoriler çekilirken hata:', error)
      // Hata durumunda varsayılan kategorileri kullan
      setCategories([
        { id: "all", label: "Tümü" },
        { id: "lifestyle", label: "Yaşam Tarzı" },
        { id: "tech", label: "Teknoloji" },
        { id: "food", label: "Yemek" },
        { id: "fitness", label: "Fitness" },
        { id: "travel", label: "Seyahat" },
      ])
    }
  }

  const getCategoryLabel = (category: string): string => {
    const categoryLabels: { [key: string]: string } = {
      'lifestyle': 'Yaşam Tarzı',
      'tech': 'Teknoloji',
      'food': 'Yemek',
      'fitness': 'Fitness',
      'travel': 'Seyahat',
      'fashion': 'Moda',
      'beauty': 'Güzellik',
      'gaming': 'Oyun',
      'education': 'Eğitim',
      'business': 'İş Dünyası',
      'entertainment': 'Eğlence',
      'sports': 'Spor',
      'health': 'Sağlık',
      'parenting': 'Ebeveynlik',
      'automotive': 'Otomotiv',
      'finance': 'Finans',
      'real_estate': 'Emlak',
      'pets': 'Evcil Hayvanlar',
      'art': 'Sanat',
      'music': 'Müzik',
      'photography': 'Fotoğrafçılık',
      'cooking': 'Yemek Yapımı',
      'diy': 'Kendin Yap',
      'books': 'Kitap',
      'movies': 'Film',
      'tv': 'Televizyon',
      'podcast': 'Podcast',
      'comedy': 'Komedi',
      'news': 'Haberler',
      'politics': 'Politika',
      'science': 'Bilim',
      'history': 'Tarih',
      'philosophy': 'Felsefe',
      'religion': 'Din',
      'spirituality': 'Spiritüellik',
      'meditation': 'Meditasyon',
      'yoga': 'Yoga',
      'dance': 'Dans',
      'theater': 'Tiyatro'
    }
    
    return categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')
  }

  const filteredInfluencers = influencers
    .filter((influencer) => {
      const matchesFilter = filter === "all" || influencer.category === filter
      const matchesSearch =
        influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "followers":
          const aFollowers = parseInt(a.social_media.instagram?.replace("K", "") || "0")
          const bFollowers = parseInt(b.social_media.instagram?.replace("K", "") || "0")
          return bFollowers - aFollowers
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 mx-auto mb-1" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-r from-black via-gray-900 to-green-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-green-500/30 text-white hover:bg-green-500/20 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Tüm <span className="text-green-400">Influencerlarımız</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            {filteredInfluencers.length} influencer arasından size en uygun olanları keşfedin ve işbirliği yapın
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`space-y-8 mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="İnfluencer, kategori veya şehir ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-gray-900/50 border-green-500/30 focus:border-green-500 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-900/50 border border-green-500/30 rounded-lg text-white focus:border-green-500"
              >
                <option value="name">İsme Göre</option>
                <option value="followers">Takipçiye Göre</option>
              </select>

            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                onClick={() => setFilter(category.id)}
                className={`transition-all duration-300 hover:scale-105 font-semibold ${
                  filter === category.id
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "border-green-500/30 hover:border-green-500 text-gray-300 hover:text-white bg-gray-900/30"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-lg text-gray-400 mt-4">Influencer verileri yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-400">{error}</p>
            <Button 
              onClick={fetchInfluencers} 
              className="mt-4 bg-green-500 hover:bg-green-600"
            >
              Tekrar Dene
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div
            className={`${
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"
            } ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            {filteredInfluencers.map((influencer, index) => (
              <Link key={influencer.id} href={`/influencers/${influencer.slug}`}>
                <Card
                  className={`group relative overflow-hidden border-0 cursor-pointer h-full ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`relative h-full bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 hover:scale-105 overflow-hidden ${
                      viewMode === "list" ? "flex w-full" : ""
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === "list" ? "w-48 flex-shrink-0" : "rounded-t-2xl"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                      <img
                        src={influencer.image_url || "/placeholder.svg"}
                        alt={influencer.name}
                        className={`w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-700 ${
                          viewMode === "list" ? "aspect-[4/3]" : "h-48"
                        }`}
                        style={{ objectFit: 'contain' }}
                      />

                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-2 shadow-lg">
                          <Instagram className="w-4 h-4 text-white" />
                        </div>
                      </div>


                    </div>

                    <CardContent className={`p-6 space-y-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <div>
                        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                          {influencer.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">Profesyonel influencer ve content creator</p>
                        <p className="text-xs text-gray-500 mb-3">📍 İstanbul</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {influencer.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge
                              key={idx}
                              className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className={`grid gap-2 ${viewMode === "list" ? "max-w-xs" : ""}`} style={{ 
                        gridTemplateColumns: `repeat(${
                          [influencer.social_media.instagram, influencer.social_media.tiktok, influencer.social_media.youtube]
                            .filter(val => val && val !== "0").length
                        }, 1fr)` 
                      }}>
                        {influencer.social_media.instagram && influencer.social_media.instagram !== "0" && (
                          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                            <Instagram className="w-4 h-4 mx-auto mb-1 text-pink-500" />
                            <span className="text-xs font-bold text-white">{influencer.social_media.instagram}</span>
                          </div>
                        )}
                        {influencer.social_media.tiktok && influencer.social_media.tiktok !== "0" && (
                          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                            <TikTokIcon />
                            <span className="text-xs font-bold text-white">{influencer.social_media.tiktok}</span>
                          </div>
                        )}
                        {influencer.social_media.youtube && influencer.social_media.youtube !== "0" && (
                          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                            <Youtube className="w-4 h-4 mx-auto mb-1 text-red-600" />
                            <span className="text-xs font-bold text-white">{influencer.social_media.youtube}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <TeklifForm 
                          influencerName={influencer.name}
                          influencerId={influencer.id}
                          onTeklifGonder={(data) => handleTeklifGonder(data, influencer)}
                        />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && filteredInfluencers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400">Aradığınız kriterlere uygun influencer bulunamadı.</p>
            <p className="text-sm text-gray-500 mt-2">Farklı arama terimleri veya filtreler deneyebilirsiniz.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
