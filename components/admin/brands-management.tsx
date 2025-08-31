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
  Filter,
  Building2,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Brand {
  id: number
  name: string
  logo_url: string
  website_url?: string
  category?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface BrandFormData {
  name: string
  logo_url: string
  website_url: string
  category: string
  is_active: boolean
  sort_order: number
}

export function BrandsManagement() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState<BrandFormData>({
    name: "",
    logo_url: "",
    website_url: "",
    category: "",
    is_active: true,
    sort_order: 0
  })
  const { toast } = useToast()

  const categories = [
    "spor", "içecek", "teknoloji", "e-ticaret", "eğlence", "müzik", 
    "otomotiv", "restoran", "moda", "aksesuar", "kafe"
  ]

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      if (response.ok) {
        const data = await response.json()
        setBrands(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Markalar yüklenirken bir hata oluştu.",
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
      const url = editingBrand 
        ? `/api/brands/${editingBrand.id}` 
        : '/api/brands'
      
      const method = editingBrand ? 'PUT' : 'POST'
      
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
          description: editingBrand 
            ? "Marka başarıyla güncellendi." 
            : "Marka başarıyla eklendi.",
        })
        setShowForm(false)
        setEditingBrand(null)
        resetForm()
        fetchBrands()
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

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      logo_url: brand.logo_url,
      website_url: brand.website_url || "",
      category: brand.category || "",
      is_active: brand.is_active,
      sort_order: brand.sort_order
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bu markayı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: "Marka başarıyla silindi.",
        })
        fetchBrands()
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

  const resetForm = () => {
    setFormData({
      name: "",
      logo_url: "",
      website_url: "",
      category: "",
      is_active: true,
      sort_order: 0
    })
  }

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || brand.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading && brands.length === 0) {
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
          <h2 className="text-2xl font-bold text-white">Marka Yönetimi</h2>
          <p className="text-gray-400">Markaları yönetin ve düzenleyin</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(true)
            setEditingBrand(null)
            resetForm()
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Marka
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Marka ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingBrand ? "Marka Düzenle" : "Yeni Marka Ekle"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Marka Adı</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Kategori</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo_url" className="text-white">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com/logo.png"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website_url" className="text-white">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com"
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
                  {loading ? "Kaydediliyor..." : (editingBrand ? "Güncelle" : "Ekle")}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingBrand(null)
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

      {/* Brands List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Markalar ({filteredBrands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBrands.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Marka bulunamadı.
              </div>
            ) : (
              filteredBrands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {brand.logo_url ? (
                        <img 
                          src={brand.logo_url} 
                          alt={brand.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{brand.name}</p>
                      <p className="text-sm text-gray-400">{brand.category}</p>
                      {brand.website_url && (
                        <a 
                          href={brand.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      brand.is_active 
                        ? "bg-green-600 text-white" 
                        : "bg-red-600 text-white"
                    }`}>
                      {brand.is_active ? "Aktif" : "Pasif"}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(brand)}
                      className="border-gray-600 text-gray-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(brand.id)}
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
