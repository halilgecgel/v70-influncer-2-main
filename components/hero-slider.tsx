"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Slide {
  id: number
  image_url: string
  title?: string
  description?: string
  sort_order: number
  created_at: string
}

const defaultSlides = [
  {
    id: 1,
    image_url: "/digital-marketing-dashboard.png",
    title: "Dijital Pazarlama Dashboard",
    description: "Modern dijital pazarlama araçları",
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    image_url: "/digital-marketing-growth.png",
    title: "Pazarlama Büyümesi",
    description: "Dijital pazarlama stratejileri",
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    image_url: "/placeholder-si4p5.png",
    title: "Influencer Marketing",
    description: "Sosyal medya influencer pazarlama",
    sort_order: 3,
    created_at: new Date().toISOString()
  },
]

export function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const sliderRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  // Görselleri önceden yükle
  useEffect(() => {
    const preloadImages = async () => {
      // Sadece mevcut ve bir sonraki görseli yükle
      const imagesToLoad = [
        slides[currentSlide]?.image_url,
        slides[(currentSlide + 1) % slides.length]?.image_url
      ].filter(Boolean)

      const imagePromises = imagesToLoad.map((imageUrl) => {
        if (!imageUrl || loadedImages.has(imageUrl)) return Promise.resolve()
        
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(imageUrl))
            resolve()
          }
          img.onerror = () => {
            console.warn(`Görsel yüklenemedi: ${imageUrl}`)
            resolve()
          }
          img.src = imageUrl
        })
      })
      
      await Promise.all(imagePromises)
    }

    preloadImages()
  }, [currentSlide, slides, loadedImages])

  // MySQL'den slider verilerini çek
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/slider')
        const result = await response.json()
        
        if (result.success && result.data.length > 0) {
          setSlides(result.data)
        } else {
          console.warn('Slider verileri yüklenemedi, varsayılan veriler kullanılıyor')
          setSlides(defaultSlides)
        }
      } catch (error) {
        console.error('Slider verileri çekilirken hata:', error)
        setSlides(defaultSlides)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }
    }, 4000)
    return () => clearInterval(timer)
  }, [isAnimating, slides.length])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  const current = slides[currentSlide]
  const isImageLoaded = loadedImages.has(current.image_url)

  if (isLoading) {
    return (
      <section className="relative min-h-[45vh] md:min-h-[60vh] bg-gradient-to-br from-background to-primary/5 overflow-hidden pt-20 md:pt-24">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-2 md:py-8 pb-2 md:pb-4">
          <div className="flex items-center justify-center h-64 md:h-80 lg:h-96 xl:h-[28rem]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[45vh] md:min-h-[60vh] bg-gradient-to-br from-background to-primary/5 overflow-hidden pt-20 md:pt-24">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-2 md:py-8 pb-2 md:pb-4">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border-white/30 hover:bg-black/40 hover:border-white/50 transition-all duration-300 text-white hidden md:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border-white/30 hover:bg-black/40 hover:border-white/50 transition-all duration-300 text-white hidden md:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <div
            ref={sliderRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Görsel katmanı */}
            <div className={`transition-all duration-300 ease-in-out ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}>
              <img
                src={current.image_url || "/placeholder.svg"}
                alt={current.title || "Slider Image"}
                className={`w-full h-80 md:h-80 lg:h-96 xl:h-[28rem] object-cover bg-gradient-to-br from-primary/5 to-accent/5 transition-transform duration-700 group-hover:scale-105 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transition: isImageLoaded ? 'opacity 0.3s ease-in-out' : 'none'
                }}
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 animate-pulse" />
              )}
            </div>

            {/* Yazı katmanı - ayrı animasyon */}
            {current.title && (
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 transition-all duration-300 ease-in-out ${
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}>
                <h3 className="text-white text-xl font-semibold mb-2">{current.title}</h3>
                {current.description && (
                  <p className="text-white/90 text-sm">{current.description}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center mt-2 md:mt-4">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                    : "bg-primary/30 hover:bg-primary/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
