import { NextRequest, NextResponse } from 'next/server'
import { getBrands } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const brands = await getBrands(category || undefined)
    
    return NextResponse.json({
      success: true,
      data: brands,
      message: 'Marka verileri başarıyla getirildi'
    })
  } catch (error) {
    console.error('Brands API hatası:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Marka verileri alınamadı',
        message: 'Sunucu hatası oluştu'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Bu endpoint sadece GET istekleri için kullanılacak
    // POST işlemleri için ayrı bir endpoint oluşturulabilir
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'POST metodu desteklenmiyor' 
      },
      { status: 405 }
    )
  } catch (error) {
    console.error('Brands API POST hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'İstek işlenirken hata oluştu' 
      },
      { status: 500 }
    )
  }
}
