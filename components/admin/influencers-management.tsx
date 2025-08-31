"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Upload,
  X,
  Save,
  Eye
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Influencer {
  id: number
  name: string
  category: string
  image_url: string
  specialties: string[]
  social_media: {
    instagram?: string
    tiktok?: string
    youtube?: string
  }
  is_active: boolean
  sort_order: number
  created_at: string
}

interface InfluencerFormData {
  name: string
  category: string
  image_url: string
  specialties: string[]
  social_media: {
    instagram?: string
    tiktok?: string
    youtube?: string
  }
  sort_order: number
}

interface InfluencerDetailsData {
  bio?: string
  location?: string
  rating?: number
  join_date?: string
  total_reach?: string
  campaigns_count?: number
  email: string
  phone: string
  portfolio?: string[]
  achievements?: string[]
  recent_campaigns?: Array<{
    brand: string
    type: string
    date: string
  }>
  engagement_rate?: string
}

export function InfluencersManagement() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null)
  const [formData, setFormData] = useState<InfluencerFormData>({
    name: "",
    category: "lifestyle",
    image_url: "",
    specialties: [],
    social_media: {},
    sort_order: 0
  })
  const [newSpecialty, setNewSpecialty] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [createdInfluencerId, setCreatedInfluencerId] = useState<number | null>(null)
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([])
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const specialtyDropdownRef = useRef<HTMLDivElement>(null)
  const [detailsData, setDetailsData] = useState<InfluencerDetailsData>({
    email: "",
    phone: "",
    bio: "",
    location: "",
    rating: 0,
    join_date: "",
    total_reach: "",
    campaigns_count: 0,
    portfolio: [],
    achievements: [],
    recent_campaigns: [],
    engagement_rate: ""
  })
  const [newAchievement, setNewAchievement] = useState("")
  const [newPortfolioItem, setNewPortfolioItem] = useState("")
  const { toast } = useToast()

  const categories = [
    { value: "lifestyle", label: "Yaşam Tarzı" },
    { value: "tech", label: "Teknoloji" },
    { value: "food", label: "Yemek" },
    { value: "fitness", label: "Fitness" },
    { value: "travel", label: "Seyahat" },
    { value: "beauty", label: "Güzellik" },
    { value: "fashion", label: "Moda" },
    { value: "gaming", label: "Oyun" },
    { value: "music", label: "Müzik" },
    { value: "education", label: "Eğitim" }
  ]

  useEffect(() => {
    fetchInfluencers()
    fetchAvailableSpecialties()
  }, [])

  const fetchAvailableSpecialties = async () => {
    try {
      const response = await fetch('/api/admin/specialties')
      const data = await response.json()
      
      if (data.success) {
        setAvailableSpecialties(data.data)
      }
    } catch (error) {
      console.error('Uzmanlık alanları alınamadı:', error)
    }
  }

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (specialtyDropdownRef.current && !specialtyDropdownRef.current.contains(event.target as Node)) {
        setShowSpecialtyDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/influencers')
      const data = await response.json()
      
      if (data.success) {
        setInfluencers(data.data)
      } else {
        toast({
          title: "Hata",
          description: "Influencer listesi alınamadı",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Veri alınamadı",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "lifestyle",
      image_url: "",
      specialties: [],
      social_media: {},
      sort_order: 0
    })
    setDetailsData({
      email: "",
      phone: "",
      bio: "",
      location: "",
      rating: 0,
      join_date: "",
      total_reach: "",
      campaigns_count: 0,
      portfolio: [],
      achievements: [],
      recent_campaigns: [],
      engagement_rate: ""
    })
    setNewSpecialty("")
    setNewAchievement("")
    setNewPortfolioItem("")
    setCurrentStep(1)
    setCreatedInfluencerId(null)
    setEditingInfluencer(null)
    setShowSpecialtyDropdown(false)
    setSelectedSpecialties([])
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (influencer: Influencer) => {
    setFormData({
      name: influencer.name,
      category: influencer.category,
      image_url: influencer.image_url,
      specialties: influencer.specialties,
      social_media: influencer.social_media,
      sort_order: influencer.sort_order
    })
    setEditingInfluencer(influencer)
    setShowForm(true)
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty("")
    }
  }

  const addSelectedSpecialties = () => {
    const newSpecialties = selectedSpecialties.filter(specialty => 
      !formData.specialties.includes(specialty)
    )
    
    if (newSpecialties.length > 0) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, ...newSpecialties]
      }))
      setSelectedSpecialties([])
      setShowSpecialtyDropdown(false)
      setNewSpecialty("")
    }
  }

  const toggleSpecialtySelection = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  const addSingleSpecialty = (specialty: string) => {
    if (!formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }))
      setNewSpecialty("")
      setShowSpecialtyDropdown(false)
    }
  }

  const filteredAvailableSpecialties = availableSpecialties.filter(specialty =>
    specialty.toLowerCase().includes(newSpecialty.toLowerCase()) &&
    !formData.specialties.includes(specialty)
  )

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  const addAchievement = () => {
    if (newAchievement.trim() && !detailsData.achievements?.includes(newAchievement.trim())) {
      setDetailsData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), newAchievement.trim()]
      }))
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setDetailsData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }))
  }

  const addPortfolioItem = () => {
    if (newPortfolioItem.trim() && !detailsData.portfolio?.includes(newPortfolioItem.trim())) {
      setDetailsData(prev => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), newPortfolioItem.trim()]
      }))
      setNewPortfolioItem("")
    }
  }

  const removePortfolioItem = (index: number) => {
    setDetailsData(prev => ({
      ...prev,
      portfolio: prev.portfolio?.filter((_, i) => i !== index) || []
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan büyük olamaz",
        variant: "destructive",
      })
      return
    }

    // Dosya türü kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Hata",
        description: "Sadece JPEG, PNG ve WebP dosyaları kabul edilir",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image_url: data.data.url
        }))
        toast({
          title: "Başarılı",
          description: "Görsel başarıyla yüklendi",
        })
      } else {
        toast({
          title: "Hata",
          description: data.error || "Görsel yüklenemedi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Görsel yükleme sırasında hata oluştu",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      // Input'u temizle
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const handleFirstStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.image_url.trim()) {
      toast({
        title: "Hata",
        description: "İsim ve resim URL'i gereklidir",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      if (editingInfluencer) {
        // Düzenleme modunda direkt güncelle
        const response = await fetch('/api/admin/influencers', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editingInfluencer.id, ...formData }),
        })

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Başarılı",
            description: "Influencer güncellendi",
          })
          setShowForm(false)
          resetForm()
          fetchInfluencers()
        } else {
          toast({
            title: "Hata",
            description: data.message || "İşlem başarısız",
            variant: "destructive",
          })
        }
      } else {
        // Yeni ekleme - 1. adım tamamlandı, 2. adıma geç
        const response = await fetch('/api/admin/influencers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (data.success) {
          setCreatedInfluencerId((data.data as any).insertId)
          setCurrentStep(2)
          toast({
            title: "Başarılı",
            description: "1. adım tamamlandı. Şimdi detay bilgilerini girin.",
          })
        } else {
          toast({
            title: "Hata",
            description: data.message || "İşlem başarısız",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSecondStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!detailsData.email.trim() || !detailsData.phone.trim()) {
      toast({
        title: "Hata",
        description: "E-posta ve telefon numarası zorunludur",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/influencers/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          influencer_id: createdInfluencerId,
          ...detailsData
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: "Influencer başarıyla eklendi!",
        })
        setShowForm(false)
        resetForm()
        fetchInfluencers()
      } else {
        toast({
          title: "Hata",
          description: data.message || "Detaylar eklenemedi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Detaylar eklenirken hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const goBackToFirstStep = () => {
    setCurrentStep(1)
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/influencers?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: "Influencer silindi",
        })
        fetchInfluencers()
      } else {
        toast({
          title: "Hata",
          description: data.message || "Silme işlemi başarısız",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Silme işlemi sırasında hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || influencer.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Influencer Yönetimi</span>
            <Button 
              onClick={openCreateForm}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Influencer
            </Button>
          </CardTitle>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Influencer ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white min-w-[150px]"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading && !showForm ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInfluencers.map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={influencer.image_url}
                        alt={influencer.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">{influencer.name}</p>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                          {categories.find(c => c.value === influencer.category)?.label || influencer.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {influencer.specialties.slice(0, 3).map((specialty: string, index: number) => (
                          <span key={index} className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                            {specialty}
                          </span>
                        ))}
                        {influencer.specialties.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{influencer.specialties.length - 3} daha
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-4 mt-2 text-sm text-gray-400">
                        {influencer.social_media.instagram && (
                          <span>Instagram: {influencer.social_media.instagram}</span>
                        )}
                        {influencer.social_media.tiktok && (
                          <span>TikTok: {influencer.social_media.tiktok}</span>
                        )}
                        {influencer.social_media.youtube && (
                          <span>YouTube: {influencer.social_media.youtube}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      onClick={() => openEditForm(influencer)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-600 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Bu işlem geri alınamaz. {influencer.name} adlı influencer silinecektir.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                            İptal
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(influencer.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              
              {filteredInfluencers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Arama kriterlerine uygun influencer bulunamadı" 
                    : "Henüz influencer eklenmemiş"
                  }
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingInfluencer 
                ? "Influencer Düzenle" 
                : currentStep === 1 
                  ? "Yeni Influencer Ekle - 1. Adım" 
                  : "Yeni Influencer Ekle - 2. Adım"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingInfluencer 
                ? "Influencer bilgilerini düzenleyin" 
                : currentStep === 1 
                  ? "Temel influencer bilgilerini girin" 
                  : "İletişim ve detay bilgilerini girin (E-posta ve telefon zorunlu)"}
            </DialogDescription>
          </DialogHeader>
          
          {(currentStep === 1 || editingInfluencer) && (
            <form onSubmit={handleFirstStepSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* İsim */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">İsim *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Influencer ismi"
                  required
                />
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Kategori</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resim URL ve Yükleme */}
            <div className="space-y-3">
              <Label className="text-white">Profil Resmi *</Label>
              
              {/* Dosya Yükleme */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://example.com/image.jpg veya dosya yükleyin"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors min-w-[120px] ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingImage ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-sm">Yükleniyor...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        <span className="text-sm">Dosya Seç</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              
              {/* Dosya Bilgisi */}
              <div className="text-xs text-gray-400">
                Desteklenen formatlar: JPEG, PNG, WebP (Max: 5MB)
              </div>
              
              {/* Önizleme */}
              {formData.image_url && (
                <div className="mt-3">
                  <Label className="text-gray-300 text-sm">Önizleme:</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={formData.image_url}
                        alt="Önizleme"
                        fill
                        className="rounded-full object-cover border-2 border-gray-600"
                        onError={() => {
                          toast({
                            title: "Hata",
                            description: "Resim yüklenemedi. URL'i kontrol edin.",
                            variant: "destructive",
                          })
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      {formData.image_url.startsWith('/uploads/') 
                        ? 'Yüklenen dosya' 
                        : 'Harici URL'
                      }
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Kaldır
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Uzmanlık Alanları */}
            <div className="space-y-2">
              <Label className="text-white">Uzmanlık Alanları</Label>
              
              {/* Otomatik Arama ve Ekleme */}
              <div className="relative">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={newSpecialty}
                      onChange={(e) => {
                        setNewSpecialty(e.target.value)
                        if (e.target.value.trim()) {
                          setShowSpecialtyDropdown(true)
                        } else {
                          setShowSpecialtyDropdown(false)
                        }
                      }}
                      onFocus={() => {
                        if (newSpecialty.trim()) {
                          setShowSpecialtyDropdown(true)
                        }
                      }}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Uzmanlık alanı yazın veya mevcut alanlardan seçin..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSpecialty()
                        }
                      }}
                    />
                    
                    {/* Dropdown */}
                    {showSpecialtyDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto" ref={specialtyDropdownRef}>
                        {filteredAvailableSpecialties.length > 0 ? (
                          <>
                            <div className="p-2 border-b border-gray-600">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">
                                  {selectedSpecialties.length} seçili
                                </span>
                                {selectedSpecialties.length > 0 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={addSelectedSpecialties}
                                    className="bg-green-600 hover:bg-green-700 text-xs"
                                  >
                                    Seçilenleri Ekle ({selectedSpecialties.length})
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredAvailableSpecialties.map((specialty, index) => (
                                <div
                                  key={index}
                                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-600"
                                >
                                  <div 
                                    className="flex items-center flex-1"
                                    onClick={() => toggleSpecialtySelection(specialty)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedSpecialties.includes(specialty)}
                                      onChange={() => toggleSpecialtySelection(specialty)}
                                      className="mr-2"
                                    />
                                    <span className="text-white text-sm">{specialty}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => addSingleSpecialty(specialty)}
                                    className="text-green-400 hover:text-green-300 hover:bg-green-900/20 ml-2"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="p-3 text-gray-400 text-sm">
                            {newSpecialty ? 'Arama sonucu bulunamadı' : 'Mevcut uzmanlık alanı yok'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    onClick={addSpecialty}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Seçili Uzmanlık Alanları */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialties.map((specialty, index) => (
                  <span key={index} className="inline-flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="ml-2 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="space-y-4">
              <Label className="text-white">Sosyal Medya Takipçi Sayıları</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-gray-300">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.social_media.instagram || ""}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      social_media: { ...prev.social_media, instagram: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="250K"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok" className="text-gray-300">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={formData.social_media.tiktok || ""}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      social_media: { ...prev.social_media, tiktok: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="180K"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="text-gray-300">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.social_media.youtube || ""}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      social_media: { ...prev.social_media, youtube: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="95K"
                  />
                </div>
              </div>
            </div>

            {/* Sıralama */}
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-white">Sıralama</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0"
              />
            </div>

            {/* Buttons - 1. Adım */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{editingInfluencer ? "Güncelleniyor..." : "Kaydediliyor..."}</span>
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingInfluencer ? "Güncelle" : "Devam Et"}
                  </>
                )}
              </Button>
            </div>
          </form>
          )}

          {/* 2. Adım - Detay Formu */}
          {currentStep === 2 && !editingInfluencer && (
            <form onSubmit={handleSecondStepSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* E-posta */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">E-posta Adresi *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={detailsData.email}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {/* Telefon */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Telefon Numarası *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={detailsData.phone}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="+90 555 123 4567"
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Biyografi</Label>
                <Textarea
                  id="bio"
                  value={detailsData.bio || ""}
                  onChange={(e) => setDetailsData(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Kısa biyografi..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Konum */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Konum</Label>
                  <Input
                    id="location"
                    value={detailsData.location || ""}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="İstanbul, Türkiye"
                  />
                </div>

                {/* Katılım Yılı */}
                <div className="space-y-2">
                  <Label htmlFor="join_date" className="text-white">Katılım Yılı</Label>
                  <Input
                    id="join_date"
                    value={detailsData.join_date || ""}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, join_date: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="2020"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-white">Değerlendirme</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={detailsData.rating || ""}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="4.5"
                  />
                </div>

                {/* Total Reach */}
                <div className="space-y-2">
                  <Label htmlFor="total_reach" className="text-white">Toplam Erişim</Label>
                  <Input
                    id="total_reach"
                    value={detailsData.total_reach || ""}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, total_reach: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="1.2M"
                  />
                </div>

                {/* Engagement Rate */}
                <div className="space-y-2">
                  <Label htmlFor="engagement_rate" className="text-white">Etkileşim Oranı</Label>
                  <Input
                    id="engagement_rate"
                    value={detailsData.engagement_rate || ""}
                    onChange={(e) => setDetailsData(prev => ({ ...prev, engagement_rate: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="8.5%"
                  />
                </div>
              </div>

              {/* Campaigns Count */}
              <div className="space-y-2">
                <Label htmlFor="campaigns_count" className="text-white">Kampanya Sayısı</Label>
                <Input
                  id="campaigns_count"
                  type="number"
                  min="0"
                  value={detailsData.campaigns_count || ""}
                  onChange={(e) => setDetailsData(prev => ({ ...prev, campaigns_count: parseInt(e.target.value) || 0 }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="45"
                />
              </div>

              {/* Portfolio Items */}
              <div className="space-y-2">
                <Label className="text-white">Portfolio Öğeleri</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newPortfolioItem}
                    onChange={(e) => setNewPortfolioItem(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Portfolio URL'i ekle"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addPortfolioItem()
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addPortfolioItem}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {detailsData.portfolio?.map((item, index) => (
                    <span key={index} className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {item}
                      <button
                        type="button"
                        onClick={() => removePortfolioItem(index)}
                        className="ml-2 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <Label className="text-white">Başarılar</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Başarı ekle"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addAchievement()
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addAchievement}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {detailsData.achievements?.map((achievement, index) => (
                    <span key={index} className="inline-flex items-center bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                      {achievement}
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="ml-2 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons - 2. Adım */}
              <div className="flex justify-between space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goBackToFirstStep}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Geri
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Tamamlanıyor...</span>
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Tamamla
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
