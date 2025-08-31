import { NextRequest, NextResponse } from 'next/server'
import { addInfluencerClick } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    await addInfluencerClick({
      influencer_id: data.influencer_id,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      source_page: data.source_page,
      click_type: data.click_type,
      social_platform: data.social_platform
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Influencer tıklaması loglanamadı:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
