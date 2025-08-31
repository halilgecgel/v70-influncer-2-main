"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TeklifFormProps {
  influencerName: string
  influencerId: number
  onTeklifGonder: (data: { email: string; teklif: string }) => Promise<void>
}

export default function TeklifForm({ influencerName, influencerId, onTeklifGonder }: TeklifFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    teklif: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.teklif) {
      toast.error("Lütfen tüm alanları doldurun")
      return
    }

    if (!formData.email.includes("@")) {
      toast.error("Geçerli bir e-posta adresi girin")
      return
    }

    setLoading(true)
    try {
      await onTeklifGonder(formData)
      toast.success("Teklifiniz başarıyla gönderildi!")
      setFormData({ email: "", teklif: "" })
      setOpen(false)
    } catch (error) {
      toast.error("Teklif gönderilirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base"
        >
          <Send className="w-3 h-3 md:w-4 md:h-4 mr-1 sm:mr-2" />
          Teklif Gönder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {influencerName} ile İşbirliği Teklifi
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta Adresiniz</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="teklif">Teklif Metni</Label>
            <Textarea
              id="teklif"
              placeholder="İşbirliği teklifinizi buraya yazın..."
              value={formData.teklif}
              onChange={(e) => setFormData({ ...formData, teklif: e.target.value })}
              required
              className="w-full min-h-[120px] resize-none"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Teklif Gönder
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
