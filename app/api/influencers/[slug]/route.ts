import { NextRequest, NextResponse } from 'next/server'
import { getInfluencerBySlug } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz influencer slug' 
        },
        { status: 400 }
      )
    }
    
    const influencer = await getInfluencerBySlug(slug)
    
    if (!influencer) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Influencer bulunamadı' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: influencer
    })
  } catch (error) {
    console.error('Influencer detay API hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Influencer verisi alınamadı' 
      },
      { status: 500 }
    )
  }
}
