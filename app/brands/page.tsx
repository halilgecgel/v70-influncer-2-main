"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Building2, 
  TrendingUp,
  Users,
  Award,
  ArrowRight
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Brand {
  id: number
  name: string
  logo_url: string
  website_url?: string
  category?: string
  sort_order: number
  created_at: string
}

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/brands')
      const result = await response.json()
      
      if (result.success) {
        setBrands(result.data)
      } else {
        setError(result.error || 'Marka verileri alınamadı')
      }
    } catch (error) {
      console.error('Marka verileri çekilirken hata:', error)
      setError('Marka verileri alınamadı')
    } finally {
      setLoading(false)
    }
  }

  const filteredBrands = brands
    .filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
        default:
          return a.name.localeCompare(b.name)
        case "category":
          return (a.category || '').localeCompare(b.category || '')
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <p className="text-lg text-foreground mt-6 font-medium">Marka verileri yükleniyor...</p>
          <p className="text-sm text-muted-foreground mt-2">Lütfen bekleyin</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-foreground">Marka verileri yüklenemedi</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchBrands} className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Tekrar Dene
            </Button>
          </div>
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
              Markalarımız
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight mobile-text-scale">
              Partner Markalarımız
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed mobile-subtitle">
              Türkiye'nin önde gelen markaları ile influencer marketing çözümleri geliştiriyoruz.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm px-8 py-4 text-lg">
                Marka Olun
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm px-8 py-4 text-lg">
                Başarı Hikayeleri
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{brands.length}</h3>
            <p className="text-muted-foreground font-medium">Toplam Marka</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">1000+</h3>
            <p className="text-muted-foreground font-medium">Başarılı Kampanya</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">500+</h3>
            <p className="text-muted-foreground font-medium">Aktif Influencer</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">95%</h3>
            <p className="text-muted-foreground font-medium">Memnuniyet Oranı</p>
          </Card>
        </div>

        {/* Search Section */}
        <div
          className={`mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Marka ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="name">İsme Göre</option>
                <option value="category">Kategoriye Göre</option>
                <option value="date">Tarihe Göre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Logo */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden bg-white p-3 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder-logo.png"
                      }}
                    />
                  </div>
                  
                  {/* Brand Name */}
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Marka bulunamadı</h3>
            <p className="text-muted-foreground mb-4">
              Arama kriterlerinize uygun marka bulunamadı. Farklı arama terimleri deneyebilirsiniz.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
              }}
              variant="outline"
            >
              Aramayı Temizle
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div
          className={`text-center mt-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Markanızı Büyütün
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Kesif Collective ile influencer marketing stratejinizi geliştirin ve 
              markanızı dijital dünyada öne çıkarın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg">
                Marka Olun
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg">
                Ücretsiz Danışmanlık
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
