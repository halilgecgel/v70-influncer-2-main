"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Youtube } from "lucide-react"
import Link from "next/link"

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
}

export function InfluencersSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [filter, setFilter] = useState("all")
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Influencer verilerini MySQL'den çek
  const fetchInfluencers = async (category?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = category && category !== 'all' 
        ? `/api/influencers?category=${category}`
        : '/api/influencers'
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setInfluencers(result.data)
      } else {
        setError(result.error || 'Veriler yüklenemedi')
      }
    } catch (err) {
      console.error('Influencer verileri çekilirken hata:', err)
      setError('Veriler yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfluencers()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Filtre değiştiğinde verileri yeniden çek
  useEffect(() => {
    fetchInfluencers(filter)
  }, [filter])

  const categories = [
    { id: "all", label: "Tümü" },
    { id: "lifestyle", label: "Yaşam Tarzı" },
    { id: "tech", label: "Teknoloji" },
    { id: "food", label: "Yemek" },
    { id: "fitness", label: "Fitness" },
    { id: "travel", label: "Seyahat" },
  ]

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )

  return (
    <section id="influencers" ref={sectionRef} className="pt-11 pb-6 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center space-y-4 mb-4 md:mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Influencerlarımız
          </h2>
          
        </div>

        <div className="relative">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Influencer verileri yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => fetchInfluencers(filter)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Tekrar Dene
              </Button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            >
              {influencers.map((influencer: Influencer, index: number) => (
                <Link key={influencer.id} href={`/influencers/${influencer.slug}`}>
                  <Card
                    className="group relative w-full overflow-hidden border-0 cursor-pointer"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="relative h-full bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 hover:scale-105 overflow-hidden">
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                        <img
                          src={influencer.image_url || "/placeholder.svg"}
                          alt={influencer.name}
                          className="w-full h-48 object-cover object-center group-hover:scale-110 transition-transform duration-700"
                          style={{ aspectRatio: "4/3", objectFit: "cover" }}
                        />
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            {influencer.name}
                          </h3>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {influencer.specialties.slice(0, 2).map((specialty: string, idx: number) => (
                              <Badge
                                key={idx}
                                className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold hover:scale-110 transition-transform duration-300"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:scale-105 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                                <Instagram className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm text-gray-400">Instagram</span>
                            </div>
                            <span className="font-bold text-sm text-gray-200">{influencer.social_media.instagram}</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:scale-105 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-black rounded-lg">
                                <TikTokIcon />
                              </div>
                              <span className="text-sm text-gray-400">TikTok</span>
                            </div>
                            <span className="font-bold text-sm text-gray-200">{influencer.social_media.tiktok}</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:scale-105 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-600 rounded-lg">
                                <Youtube className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm text-gray-400">YouTube</span>
                            </div>
                            <span className="font-bold text-sm text-gray-200">{influencer.social_media.youtube}</span>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle collaboration click
                            }}
                          >
                            İşbirliği İçin Tıklayın
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <Link href="/influencers">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Tüm Influencerları Gör
            </Button>
          </Link>
        </div>
      </div>

      
    </section>
  )
}
