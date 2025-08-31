import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username || typeof username !== 'string') {
    return NextResponse.json(
      { error: 'Kullanıcı adı gerekli' },
      { status: 400 }
    );
  }

  try {
    // Instagram'ın public API'sini kullan
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'X-IG-App-ID': '936619743392459',
        'X-IG-WWW-Claim': '0',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': `https://www.instagram.com/${username}/`,
        'Origin': 'https://www.instagram.com'
      },
    });

    if (response.data && response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      const followerCount = user.edge_followed_by?.count || user.follower_count || 0;
      
      return NextResponse.json({ 
        username, 
        followers: followerCount.toString() 
      });
    }

    return NextResponse.json({ username, followers: 'Bulunamadı' });
  } catch (error) {
    console.error('Hata:', error);
    
    // API çalışmazsa fallback olarak web scraping dene
    try {
      const url = `https://www.instagram.com/${username}/`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // HTML'de takipçi sayısını ara
      const htmlContent = response.data;
      const followerMatch = htmlContent.match(/"edge_followed_by":\s*{\s*"count":\s*(\d+)/);
      
      if (followerMatch) {
        return NextResponse.json({ 
          username, 
          followers: followerMatch[1] 
        });
      }

      return NextResponse.json({ username, followers: 'Bulunamadı' });
    } catch (fallbackError) {
      console.error('Fallback hata:', fallbackError);
      return NextResponse.json({ username, followers: 'Bulunamadı' });
    }
  }
}