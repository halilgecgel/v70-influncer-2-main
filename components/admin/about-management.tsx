"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Target,
  Star,
  Users,
  Award,
  Heart,
  Zap,
  Shield,
  Globe,
  Lightbulb,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AboutContent {
  id: number
  type: 'mission' | 'vision'
  title: string
  description: string
  icon: string
  color: string
  features: string[]
  is_active: boolean
}

interface AboutStats {
  id: number
  icon: string
  value: string
  label: string
  color: string
  sort_order: number
  is_active: boolean
}

interface AboutTeam {
  id: number
  name: string
  role: string
  image_url: string
  description: string
  sort_order: number
  is_active: boolean
}

interface AboutValues {
  id: number
  icon: string
  title: string
  description: string
  color: string
  sort_order: number
  is_active: boolean
}

export function AboutManagement() {
  const [activeTab, setActiveTab] = useState("content")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formType, setFormType] = useState<string>("")
  
  // Data states
  const [content, setContent] = useState<AboutContent[]>([])
  const [stats, setStats] = useState<AboutStats[]>([])
  const [team, setTeam] = useState<AboutTeam[]>([])
  const [values, setValues] = useState<AboutValues[]>([])
  
  const { toast } = useToast()

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about')
      if (response.ok) {
        const data = await response.json()
        setContent(data.content || [])
        setStats(data.stats || [])
        setTeam(data.team || [])
        setValues(data.values || [])
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hakkımızda verileri yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingItem 
        ? `/api/about/${formType}/${editingItem.id}` 
        : `/api/about/${formType}`
      
      const method = editingItem ? 'PUT' : 'POST'
      
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
          description: editingItem 
            ? "Öğe başarıyla güncellendi." 
            : "Öğe başarıyla eklendi.",
        })
        setShowForm(false)
        setEditingItem(null)
        fetchAboutData()
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

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Bu öğeyi silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/about/${type}/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: "Öğe başarıyla silindi.",
        })
        fetchAboutData()
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

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Target, Star, Users, Award, Heart, Zap, Shield, Globe, Lightbulb
    }
    return icons[iconName] || FileText
  }

  if (loading) {
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
          <h2 className="text-2xl font-bold text-white">Hakkımızda Yönetimi</h2>
          <p className="text-gray-400">Hakkımızda sayfası içeriklerini yönetin</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="content" className="text-gray-300">İçerik</TabsTrigger>
          <TabsTrigger value="stats" className="text-gray-300">İstatistikler</TabsTrigger>
          <TabsTrigger value="team" className="text-gray-300">Ekip</TabsTrigger>
          <TabsTrigger value="values" className="text-gray-300">Değerler</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Misyon & Vizyon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.map((item) => {
                  const Icon = getIconComponent(item.icon)
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${item.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-sm text-gray-400">{item.type === 'mission' ? 'Misyon' : 'Vizyon'}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.is_active 
                            ? "bg-green-600 text-white" 
                            : "bg-red-600 text-white"
                        }`}>
                          {item.is_active ? "Aktif" : "Pasif"}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setEditingItem(item)
                            setFormType("content")
                            setShowForm(true)
                          }}
                          className="border-gray-600 text-gray-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete("content", item.id)}
                          className="border-red-600 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">İstatistikler</h3>
            <Button 
              onClick={() => {
                setEditingItem(null)
                setFormType("stats")
                setShowForm(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni İstatistik
            </Button>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = getIconComponent(stat.icon)
                  return (
                    <div key={stat.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${stat.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingItem(stat)
                              setFormType("stats")
                              setShowForm(true)
                            }}
                            className="border-gray-600 text-gray-300"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete("stats", stat.id)}
                            className="border-red-600 text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Ekip Üyeleri</h3>
            <Button 
              onClick={() => {
                setEditingItem(null)
                setFormType("team")
                setShowForm(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Üye
            </Button>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                        {member.image_url ? (
                          <img 
                            src={member.image_url} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.role}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setEditingItem(member)
                          setFormType("team")
                          setShowForm(true)
                        }}
                        className="border-gray-600 text-gray-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete("team", member.id)}
                        className="border-red-600 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values Tab */}
        <TabsContent value="values" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Değerlerimiz</h3>
            <Button 
              onClick={() => {
                setEditingItem(null)
                setFormType("values")
                setShowForm(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Değer
            </Button>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value) => {
                  const Icon = getIconComponent(value.icon)
                  return (
                    <div key={value.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${value.color}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-medium text-white">{value.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{value.description}</p>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setEditingItem(value)
                            setFormType("values")
                            setShowForm(true)
                          }}
                          className="border-gray-600 text-gray-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete("values", value.id)}
                          className="border-red-600 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">
                {editingItem ? "Düzenle" : "Yeni Ekle"} - {formType}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AboutForm 
                type={formType}
                item={editingItem}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false)
                  setEditingItem(null)
                }}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Form component for different types
function AboutForm({ type, item, onSubmit, onCancel, loading }: any) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      // Reset form based on type
      switch (type) {
        case "content":
          setFormData({
            type: "mission",
            title: "",
            description: "",
            icon: "Target",
            color: "from-primary to-secondary",
            features: [],
            is_active: true
          })
          break
        case "stats":
          setFormData({
            icon: "Users",
            value: "",
            label: "",
            color: "from-primary to-secondary",
            sort_order: 0,
            is_active: true
          })
          break
        case "team":
          setFormData({
            name: "",
            role: "",
            image_url: "",
            description: "",
            sort_order: 0,
            is_active: true
          })
          break
        case "values":
          setFormData({
            icon: "Heart",
            title: "",
            description: "",
            color: "from-red-500 to-pink-500",
            sort_order: 0,
            is_active: true
          })
          break
      }
    }
  }, [item, type])

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "content" && (
        <>
          <div className="space-y-2">
            <Label className="text-white">Tür</Label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="mission">Misyon</option>
              <option value="vision">Vizyon</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Başlık</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Açıklama</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
              required
            />
          </div>
        </>
      )}

      {type === "stats" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Değer</Label>
              <Input
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="500+"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Etiket</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Influencer"
                required
              />
            </div>
          </div>
        </>
      )}

      {type === "team" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Ad Soyad</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Pozisyon</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Profil Fotoğrafı URL</Label>
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Açıklama</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>
        </>
      )}

      {type === "values" && (
        <>
          <div className="space-y-2">
            <Label className="text-white">Başlık</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Açıklama</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
              required
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Sıralama</Label>
          <Input
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
          {loading ? "Kaydediliyor..." : (item ? "Güncelle" : "Ekle")}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-600 text-gray-300"
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
