import { NextRequest, NextResponse } from 'next/server'
import { 
  getInfluencers, 
  addInfluencer, 
  updateInfluencer, 
  deleteInfluencer,
  addInfluencerDetails,
  addSiteLog 
} from '@/lib/database'

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
    console.error('Influencer listesi hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Influencer listesi alınamadı'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    
    const result = await addInfluencer(data)
    
    await addSiteLog({
      action: 'influencer_created',
      ip_address: ipAddress,
      resource_type: 'influencer',
      details: { name: data.name, category: data.category }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Influencer başarıyla eklendi',
      data: result
    })
  } catch (error) {
    console.error('Influencer ekleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Influencer eklenemedi'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { id, ...data } = requestData
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    
    console.log('PUT isteği alındı:', { id, data })
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Influencer ID gerekli'
      }, { status: 400 })
    }

    // Veri doğrulama ve temizleme
    const updateData = {
      name: data.name || undefined,
      category: data.category || undefined,
      image_url: data.image_url || undefined,
      specialties: Array.isArray(data.specialties) ? data.specialties : undefined,
      social_media: data.social_media && typeof data.social_media === 'object' ? data.social_media : undefined,
      sort_order: typeof data.sort_order === 'number' ? data.sort_order : undefined,
      is_active: typeof data.is_active === 'boolean' ? data.is_active : undefined
    }
    
    console.log('Temizlenmiş veri:', updateData)
    
    const result = await updateInfluencer(parseInt(id), updateData)
    
    await addSiteLog({
      action: 'influencer_updated',
      ip_address: ipAddress,
      resource_type: 'influencer',
      resource_id: parseInt(id),
      details: { name: data.name, category: data.category }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Influencer başarıyla güncellendi',
      data: result
    })
  } catch (error) {
    console.error('Influencer güncelleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Influencer güncellenemedi'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Influencer ID gerekli'
      }, { status: 400 })
    }
    
    const result = await deleteInfluencer(parseInt(id))
    
    await addSiteLog({
      action: 'influencer_deleted',
      ip_address: ipAddress,
      resource_type: 'influencer',
      resource_id: parseInt(id)
    })
    
    return NextResponse.json({
      success: true,
      message: 'Influencer başarıyla silindi',
      data: result
    })
  } catch (error) {
    console.error('Influencer silme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Influencer silinemedi'
    }, { status: 500 })
  }
}
