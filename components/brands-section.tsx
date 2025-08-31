"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface Brand {
  id: number
  name: string
  logo_url: string
  website_url?: string
  category?: string
  sort_order: number
  created_at: string
}

export function BrandsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Brands verilerini çek
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/brands')
        const result = await response.json()
        
        if (result.success) {
          setBrands(result.data)
        } else {
          setError(result.error || 'Brands verileri yüklenemedi')
        }
      } catch (err) {
        console.error('Brands yüklenirken hata:', err)
        setError('Brands verileri yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || brands.length === 0) return

    const scrollWidth = scrollContainer.scrollWidth
    const clientWidth = scrollContainer.clientWidth
    let scrollPosition = 0

    const scroll = () => {
      scrollPosition += 1
      if (scrollPosition >= scrollWidth - clientWidth) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [brands])

  // Loading durumu
  if (loading) {
    return (
      <section className="py-8 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Çalıştığımız
              </span>{" "}
              <span className="text-gray-200">Markalar</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Dünya çapında tanınan markalarla başarılı kampanyalar gerçekleştiriyoruz
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
        </div>
      </section>
    )
  }

  // Error durumu
  if (error) {
    return (
      <section className="py-8 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Çalıştığımız
              </span>{" "}
              <span className="text-gray-200">Markalar</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Dünya çapında tanınan markalarla başarılı kampanyalar gerçekleştiriyoruz
            </p>
          </div>
          <div className="text-center text-red-400">
            <p>Hata: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Çalıştığımız
            </span>{" "}
            <span className="text-gray-200">Markalar</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Dünya çapında tanınan markalarla başarılı kampanyalar gerçekleştiriyoruz
          </p>
        </div>

        {/* Brands Carousel */}
        <div className="relative">
          <div ref={scrollRef} className="flex gap-8 md:gap-12 overflow-hidden" style={{ scrollBehavior: "auto" }}>
            {/* First set of brands */}
            {brands.map((brand, index) => (
              <div key={`first-${brand.id}`} className="flex-shrink-0 group">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 md:p-8 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                  <img
                    src={brand.logo_url || "/placeholder.svg"}
                    alt={brand.name}
                    className="h-12 md:h-16 w-auto mx-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <div key={`second-${brand.id}`} className="flex-shrink-0 group">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 md:p-8 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                  <img
                    src={brand.logo_url || "/placeholder.svg"}
                    alt={brand.name}
                    className="h-12 md:h-16 w-auto mx-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {brands.length}+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Marka Ortaklığı</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              200+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Başarılı Kampanya</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              10M+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Toplam Erişim</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              95%
            </div>
            <div className="text-gray-400 text-sm md:text-base">Müşteri Memnuniyeti</div>
          </div>
        </div>

        {/* Tüm Markalar Butonu */}
        <div className="text-center mt-12">
          <Link href="/brands">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25">
              Tüm Markalar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
