import { NextRequest, NextResponse } from 'next/server'
import { addInfluencerDetails, addSiteLog } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { influencer_id, ...detailsData } = data
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    
    if (!influencer_id) {
      return NextResponse.json({
        success: false,
        message: 'Influencer ID gereklidir'
      }, { status: 400 })
    }
    
    if (!detailsData.email || !detailsData.phone) {
      return NextResponse.json({
        success: false,
        message: 'E-posta ve telefon numarası zorunludur'
      }, { status: 400 })
    }
    
    const result = await addInfluencerDetails(influencer_id, detailsData)
    
    await addSiteLog({
      action: 'influencer_details_added',
      ip_address: ipAddress,
      resource_type: 'influencer_details',
      resource_id: influencer_id,
      details: { email: detailsData.email, phone: detailsData.phone }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Influencer detayları başarıyla eklendi',
      data: result
    })
  } catch (error) {
    console.error('Influencer detayları ekleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Influencer detayları eklenemedi'
    }, { status: 500 })
  }
}
