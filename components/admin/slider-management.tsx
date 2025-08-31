"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SliderImage {
  id: number
  image_url: string
  title?: string
  description?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface SliderFormData {
  image_url: string
  title: string
  description: string
  sort_order: number
  is_active: boolean
}

export function SliderManagement() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [formData, setFormData] = useState<SliderFormData>({
    image_url: "",
    title: "",
    description: "",
    sort_order: 0,
    is_active: true
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSliderImages()
  }, [])

  const fetchSliderImages = async () => {
    try {
      const response = await fetch('/api/slider')
      if (response.ok) {
        const data = await response.json()
        setSliderImages(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Slider görselleri yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingImage 
        ? `/api/slider/${editingImage.id}` 
        : '/api/slider'
      
      const method = editingImage ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: editingImage 
            ? "Slider görseli başarıyla güncellendi." 
            : "Slider görseli başarıyla eklendi.",
        })
        setShowForm(false)
        setEditingImage(null)
        resetForm()
        fetchSliderImages()
      } else {
        toast({
          title: "Hata",
          description: data.message || "Bir hata oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (image: SliderImage) => {
    setEditingImage(image)
    setFormData({
      image_url: image.image_url,
      title: image.title || "",
      description: image.description || "",
      sort_order: image.sort_order,
      is_active: image.is_active
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bu slider görselini silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: "Slider görseli başarıyla silindi.",
        })
        fetchSliderImages()
      } else {
        toast({
          title: "Hata",
          description: data.message || "Silme işlemi başarısız.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Silme işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleMoveUp = async (id: number) => {
    try {
      const response = await fetch(`/api/slider/${id}/move-up`, {
        method: 'PUT',
      })

      if (response.ok) {
        fetchSliderImages()
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sıralama değiştirilemedi.",
        variant: "destructive",
      })
    }
  }

  const handleMoveDown = async (id: number) => {
    try {
      const response = await fetch(`/api/slider/${id}/move-down`, {
        method: 'PUT',
      })

      if (response.ok) {
        fetchSliderImages()
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sıralama değiştirilemedi.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      image_url: "",
      title: "",
      description: "",
      sort_order: 0,
      is_active: true
    })
  }

  const filteredImages = sliderImages.filter(image => {
    const matchesSearch = image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading && sliderImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Slider Yönetimi</h2>
          <p className="text-gray-400">Ana sayfa slider görsellerini yönetin</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(true)
            setEditingImage(null)
            resetForm()
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Görsel
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Görsel ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingImage ? "Slider Görseli Düzenle" : "Yeni Slider Görseli Ekle"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-white">Görsel URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Başlık</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Slider başlığı"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Slider açıklaması"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sort_order" className="text-white">Sıralama</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Durum</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={formData.is_active ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({...formData, is_active: true})}
                      className={formData.is_active ? "bg-green-600" : "border-gray-600"}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Aktif
                    </Button>
                    <Button
                      type="button"
                      variant={!formData.is_active ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({...formData, is_active: false})}
                      className={!formData.is_active ? "bg-red-600" : "border-gray-600"}
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Pasif
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Kaydediliyor..." : (editingImage ? "Güncelle" : "Ekle")}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingImage(null)
                    resetForm()
                  }}
                  className="border-gray-600 text-gray-300"
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Slider Images List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Slider Görselleri ({filteredImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredImages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Slider görseli bulunamadı.
              </div>
            ) : (
              filteredImages.map((image, index) => (
                <div key={image.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-16 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {image.image_url ? (
                        <img 
                          src={image.image_url} 
                          alt={image.title || "Slider görseli"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {image.title || "Başlıksız Görsel"}
                      </p>
                      {image.description && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Sıra: {image.sort_order} • {image.is_active ? "Aktif" : "Pasif"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleMoveUp(image.id)}
                      disabled={index === 0}
                      className="border-gray-600 text-gray-300"
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleMoveDown(image.id)}
                      disabled={index === filteredImages.length - 1}
                      className="border-gray-600 text-gray-300"
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(image)}
                      className="border-gray-600 text-gray-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(image.id)}
                      className="border-red-600 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
