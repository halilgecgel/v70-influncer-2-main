"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  MousePointer,
  TrendingUp,
  Activity
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PageViewLog {
  id: number
  page_url: string
  user_agent: string
  ip_address: string
  referrer?: string
  created_at: string
}

interface InfluencerClickLog {
  id: number
  influencer_id: number
  influencer_name: string
  user_agent: string
  ip_address: string
  referrer?: string
  created_at: string
}

export function LogsManagement() {
  const [activeTab, setActiveTab] = useState("page-views")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [pageViews, setPageViews] = useState<PageViewLog[]>([])
  const [influencerClicks, setInfluencerClicks] = useState<InfluencerClickLog[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchLogs()
  }, [activeTab])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      if (activeTab === "page-views") {
        const response = await fetch('/api/log/page-view')
        if (response.ok) {
          const data = await response.json()
          setPageViews(data.data || [])
        }
      } else {
        const response = await fetch('/api/log/influencer-click')
        if (response.ok) {
          const data = await response.json()
          setInfluencerClicks(data.data || [])
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Loglar yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearLogs = async () => {
    if (!confirm("Tüm logları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) return

    try {
      const response = await fetch(`/api/log/${activeTab === "page-views" ? "page-view" : "influencer-click"}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: "Loglar başarıyla temizlendi.",
        })
        fetchLogs()
      } else {
        toast({
          title: "Hata",
          description: data.message || "Loglar temizlenemedi.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Loglar temizlenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleExportLogs = async () => {
    try {
      const response = await fetch(`/api/log/${activeTab === "page-views" ? "page-view" : "influencer-click"}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${activeTab === "page-views" ? "page-views" : "influencer-clicks"}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: "Başarılı",
          description: "Loglar başarıyla dışa aktarıldı.",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Loglar dışa aktarılırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const filterLogs = (logs: any[]) => {
    return logs.filter(log => {
      const matchesSearch = searchTerm === "" || 
        (log.page_url && log.page_url.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.influencer_name && log.influencer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.ip_address && log.ip_address.includes(searchTerm))
      
      const matchesDate = dateFilter === "" || 
        log.created_at.startsWith(dateFilter)
      
      return matchesSearch && matchesDate
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  const getPageViewStats = () => {
    const totalViews = pageViews.length
    const uniqueIPs = new Set(pageViews.map(log => log.ip_address)).size
    const todayViews = pageViews.filter(log => 
      log.created_at.startsWith(new Date().toISOString().split('T')[0])
    ).length
    
    return { totalViews, uniqueIPs, todayViews }
  }

  const getInfluencerClickStats = () => {
    const totalClicks = influencerClicks.length
    const uniqueIPs = new Set(influencerClicks.map(log => log.ip_address)).size
    const todayClicks = influencerClicks.filter(log => 
      log.created_at.startsWith(new Date().toISOString().split('T')[0])
    ).length
    
    const topInfluencers = influencerClicks.reduce((acc: any, log) => {
      acc[log.influencer_name] = (acc[log.influencer_name] || 0) + 1
      return acc
    }, {})
    
    const sortedInfluencers = Object.entries(topInfluencers)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 5)
    
    return { totalClicks, uniqueIPs, todayClicks, topInfluencers: sortedInfluencers }
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
          <h2 className="text-2xl font-bold text-white">Log Yönetimi</h2>
          <p className="text-gray-400">Sistem loglarını görüntüleyin ve yönetin</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleExportLogs}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button 
            onClick={handleClearLogs}
            variant="outline"
            className="border-red-600 text-red-400"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Logları Temizle
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="page-views" className="text-gray-300">Sayfa Görüntülemeleri</TabsTrigger>
          <TabsTrigger value="influencer-clicks" className="text-gray-300">Influencer Tıklamaları</TabsTrigger>
        </TabsList>

        {/* Page Views Tab */}
        <TabsContent value="page-views" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const stats = getPageViewStats()
              return (
                <>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Eye className="w-8 h-8 text-blue-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Toplam Görüntüleme</p>
                          <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <User className="w-8 h-8 text-green-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Benzersiz IP</p>
                          <p className="text-2xl font-bold text-white">{stats.uniqueIPs}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-purple-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Bugünkü Görüntüleme</p>
                          <p className="text-2xl font-bold text-white">{stats.todayViews}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            })()}
          </div>

          {/* Search and Filter */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="URL, IP adresi veya user agent ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Sayfa Görüntüleme Logları ({filterLogs(pageViews).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filterLogs(pageViews).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Log bulunamadı.
                  </div>
                ) : (
                  filterLogs(pageViews).map((log) => (
                    <div key={log.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-white">{log.page_url}</p>
                          <p className="text-sm text-gray-400">IP: {log.ip_address}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(log.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {log.user_agent.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Influencer Clicks Tab */}
        <TabsContent value="influencer-clicks" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(() => {
              const stats = getInfluencerClickStats()
              return (
                <>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <MousePointer className="w-8 h-8 text-blue-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Toplam Tıklama</p>
                          <p className="text-2xl font-bold text-white">{stats.totalClicks}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <User className="w-8 h-8 text-green-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Benzersiz IP</p>
                          <p className="text-2xl font-bold text-white">{stats.uniqueIPs}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-purple-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">Bugünkü Tıklama</p>
                          <p className="text-2xl font-bold text-white">{stats.todayClicks}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <TrendingUp className="w-8 h-8 text-yellow-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">En Popüler</p>
                          <p className="text-lg font-bold text-white">
                            {stats.topInfluencers[0]?.[0] || "Yok"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            })()}
          </div>

          {/* Top Influencers */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">En Çok Tıklanan Influencerlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const stats = getInfluencerClickStats()
                  return stats.topInfluencers.map(([name, clicks]: [string, number], index: number) => (
                    <div key={name} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-green-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-white">{name}</p>
                          <p className="text-sm text-gray-400">{clicks} tıklama</p>
                        </div>
                      </div>
                    </div>
                  ))
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Influencer adı, IP adresi ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Influencer Tıklama Logları ({filterLogs(influencerClicks).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filterLogs(influencerClicks).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Log bulunamadı.
                  </div>
                ) : (
                  filterLogs(influencerClicks).map((log) => (
                    <div key={log.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-white">{log.influencer_name}</p>
                          <p className="text-sm text-gray-400">IP: {log.ip_address}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(log.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {log.user_agent.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
