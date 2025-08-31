"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react"

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const sectionRef = useRef<HTMLDivElement>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Form submission logic here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background particle-bg"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center space-y-6 mb-16 ${isVisible ? "animate-fade-in-up-3d" : "opacity-0"}`}>
          <h2 className="text-5xl lg:text-6xl font-black font-heading gradient-text">İletişim</h2>
          <p className="text-lg lg:text-xl text-muted-foreground font-body max-w-3xl mx-auto leading-relaxed">
            Markanız için en uygun influencer marketing stratejisini birlikte oluşturalım. Uzman ekibimiz size özel
            çözümler sunmaya hazır.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card
            className={`glass-effect border-2 border-primary/20 shadow-2xl ${isVisible ? "animate-fade-in-up-3d" : "opacity-0"}`}
          >
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold font-heading gradient-text">Bize Ulaşın</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="font-semibold">
                      Ad Soyad
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Adınızı girin"
                      required
                      className="glass-effect border-primary/30 focus:border-primary/60 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="font-semibold">
                      E-posta
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-posta adresinizi girin"
                      required
                      className="glass-effect border-primary/30 focus:border-primary/60 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="company" className="font-semibold">
                    Şirket
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Şirket adınızı girin"
                    className="glass-effect border-primary/30 focus:border-primary/60 transition-all duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="font-semibold">
                    Mesaj
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Projeniz hakkında detayları paylaşın..."
                    rows={6}
                    required
                    className="glass-effect border-primary/30 focus:border-primary/60 transition-all duration-300"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group animate-glow-pulse hover:scale-105 transform transition-all duration-300 font-bold py-4"
                >
                  Mesaj Gönder
                  <Send className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className={`space-y-8 ${isVisible ? "animate-slide-in-3d" : "opacity-0"}`}>
            <Card className="glass-effect border-2 border-primary/20 hover:border-primary/40 p-8 hover:scale-105 transform transition-all duration-300 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading mb-3">E-posta</h3>
                  <p className="text-muted-foreground font-medium">info@kesifcollective.com</p>
                  <p className="text-muted-foreground font-medium">iletisim@kesifcollective.com</p>
                </div>
              </div>
            </Card>

            <Card className="glass-effect border-2 border-primary/20 hover:border-primary/40 p-8 hover:scale-105 transform transition-all duration-300 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading mb-3">Telefon</h3>
                  <p className="text-muted-foreground font-medium">+90 212 555 0123</p>
                  <p className="text-muted-foreground font-medium">+90 532 555 0123</p>
                </div>
              </div>
            </Card>

            <Card className="glass-effect border-2 border-primary/20 hover:border-primary/40 p-8 hover:scale-105 transform transition-all duration-300 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading mb-3">Adres</h3>
                  <p className="text-muted-foreground font-medium">
                    Maslak Mahallesi
                    <br />
                    Büyükdere Caddesi No: 123
                    <br />
                    Sarıyer, İstanbul 34485
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-effect border-2 border-primary/30 p-8 bg-gradient-to-br from-primary/5 to-accent/5 hover:scale-105 transform transition-all duration-300 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-heading mb-4">Çalışma Saatleri</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center font-medium">
                      <span>Pazartesi - Cuma</span>
                      <span className="text-primary font-bold">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Cumartesi</span>
                      <span className="text-primary font-bold">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Pazar</span>
                      <span className="text-muted-foreground">Kapalı</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
