import { NextRequest, NextResponse } from 'next/server'
import { addPageView } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    await addPageView({
      page_path: data.page_path,
      page_title: data.page_title,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      referrer: data.referrer
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sayfa görüntülemesi loglanamadı:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
