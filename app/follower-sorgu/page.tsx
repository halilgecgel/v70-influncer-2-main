'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Users, Instagram, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FollowerData {
  username: string;
  followers: string;
}

export default function FollowerSorguPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [followerData, setFollowerData] = useState<FollowerData | null>(null);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async () => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      toast.error('Lütfen bir kullanıcı adı girin');
      return;
    }

    // Kullanıcı adı formatını kontrol et
    if (!/^[a-zA-Z0-9._]+$/.test(trimmedUsername)) {
      toast.error('Geçersiz kullanıcı adı formatı');
      return;
    }

    setLoading(true);
    setError('');
    setFollowerData(null);

    try {
      // API çağrısı
      const response = await fetch(`/api/follower/${trimmedUsername}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFollowerData(data);
        setError('');
        
        // Arama geçmişine ekle
        if (!searchHistory.includes(trimmedUsername)) {
          setSearchHistory(prev => [trimmedUsername, ...prev.slice(0, 4)]);
        }
        
        // Takipçi sayısı "Bulunamadı" ise hata olarak göster
        if (data.followers === 'Bulunamadı') {
          setError('Bu kullanıcının takipçi sayısı bulunamadı');
          toast.error('Bu kullanıcının takipçi sayısı bulunamadı');
        } else {
          toast.success(`${data.username} kullanıcısının takipçi sayısı başarıyla getirildi!`);
        }
      } else {
        setError(data.error || 'Kullanıcı bulunamadı');
        toast.error(data.error || 'Kullanıcı bulunamadı');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
      toast.error('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  const clearResults = () => {
    setFollowerData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="w-8 h-8 text-pink-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Instagram Takipçi Sorgu
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Instagram kullanıcılarının takipçi sayılarını anında sorgulayın. 
            Sadece kullanıcı adını girin ve sonuçları görün.
          </p>
        </div>

        {/* Search Card */}
        <Card className="max-w-md mx-auto mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-pink-500" />
              Takipçi Sorgula
            </CardTitle>
            <CardDescription>
              Instagram kullanıcı adını girin ve takipçi sayısını öğrenin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  @
                </span>
                <Input
                  id="username"
                  type="text"
                  placeholder="kullanici_adi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-8"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sadece harf, rakam, nokta ve alt çizgi kullanabilirsiniz
              </p>
            </div>
            
            <Button 
              onClick={handleSearch} 
              disabled={loading || !username.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sorgulanıyor...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Sorgula
                </>
              )}
            </Button>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Son Aramalar:</p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((user, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setUsername(user)}
                      className="text-xs"
                    >
                      @{user}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {followerData && followerData.followers !== 'Bulunamadı' && (
          <Card className="max-w-md mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Sonuç
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Başarılı
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kullanıcı Adı</p>
                    <p className="font-semibold text-lg">@{followerData.username}</p>
                  </div>
                  <Instagram className="w-6 h-6 text-pink-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Takipçi Sayısı</p>
                    <p className="font-bold text-2xl text-pink-600 dark:text-pink-400">
                      {followerData.followers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <Button 
                  onClick={clearResults}
                  variant="outline" 
                  className="w-full"
                >
                  Yeni Sorgu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="max-w-md mx-auto mt-4 shadow-lg border-0 bg-red-50 dark:bg-red-900/20 animate-in slide-in-from-top-2 duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <p className="font-medium">{error}</p>
              </div>
              <Button 
                onClick={clearResults}
                variant="outline" 
                size="sm"
                className="mt-3 w-full"
              >
                Tekrar Dene
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-center">Nasıl Çalışır?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-pink-600 dark:text-pink-400 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Kullanıcı Adı Girin</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Instagram kullanıcı adını @ işareti olmadan girin
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Sorgulayın</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sorgula butonuna tıklayın ve sonucu bekleyin
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 dark:text-green-400 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Sonucu Görün</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Anında takipçi sayısını görüntüleyin
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
