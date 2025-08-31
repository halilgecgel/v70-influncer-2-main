import { NextRequest, NextResponse } from 'next/server'
import { getInfluencers, getInfluencerCategories } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const influencers = await getInfluencers(category || undefined)
    
    return NextResponse.json({
      success: true,
      data: influencers
    })
  } catch (error) {
    console.error('Influencer API hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Influencer verileri alınamadı' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Bu endpoint şimdilik sadece GET isteklerini destekliyor
    // POST işlemleri için ayrı bir endpoint oluşturulabilir
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'POST metodu desteklenmiyor' 
      },
      { status: 405 }
    )
  } catch (error) {
    console.error('Influencer API POST hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Geçersiz istek' 
      },
      { status: 400 }
    )
  }
}
