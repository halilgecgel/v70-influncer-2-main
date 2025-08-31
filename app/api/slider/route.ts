import { NextResponse } from 'next/server'
import { getSliderImages, addSliderImage, updateSliderImage, deleteSliderImage } from '@/lib/database'

export async function GET() {
  try {
    const data = await getSliderImages()
    
    return NextResponse.json({ 
      success: true, 
      data: data 
    })
    
  } catch (error) {
    console.error('Slider verileri çekilirken hata:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Slider verileri yüklenemedi' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { image_url, title, description, sort_order = 0 } = body
    
    const result = await addSliderImage({
      image_url,
      title,
      description,
      sort_order
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Slider resmi başarıyla eklendi',
      id: (result as any).insertId
    })
    
  } catch (error) {
    console.error('Slider resmi eklenirken hata:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Slider resmi eklenemedi' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, image_url, title, description, sort_order, is_active } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID gerekli' },
        { status: 400 }
      )
    }
    
    await updateSliderImage(id, {
      image_url,
      title,
      description,
      sort_order,
      is_active
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Slider resmi başarıyla güncellendi'
    })
    
  } catch (error) {
    console.error('Slider resmi güncellenirken hata:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Slider resmi güncellenemedi' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID gerekli' },
        { status: 400 }
      )
    }
    
    await deleteSliderImage(parseInt(id))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Slider resmi başarıyla silindi'
    })
    
  } catch (error) {
    console.error('Slider resmi silinirken hata:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Slider resmi silinemedi' 
      },
      { status: 500 }
    )
  }
}
