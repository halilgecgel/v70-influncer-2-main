import { NextRequest, NextResponse } from 'next/server'
import { getAboutData } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const aboutData = await getAboutData()
    
    return NextResponse.json({
      success: true,
      data: aboutData
    })
  } catch (error) {
    console.error('About verileri çekilirken hata:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'About verileri çekilirken bir hata oluştu' 
      },
      { status: 500 }
    )
  }
}
