import { NextRequest, NextResponse } from 'next/server'
import { getInfluencerCategories } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const categories = await getInfluencerCategories()
    
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Kategoriler API hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Kategoriler alınamadı' 
      },
      { status: 500 }
    )
  }
}
