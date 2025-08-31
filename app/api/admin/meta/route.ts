import { NextRequest, NextResponse } from 'next/server'
import { getSiteMeta, upsertSiteMeta, addSiteLog } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pagePath = searchParams.get('page')
    
    const meta = await getSiteMeta(pagePath || undefined)
    
    return NextResponse.json({
      success: true,
      data: meta
    })
  } catch (error) {
    console.error('Meta verileri hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Meta verileri alınamadı'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    
    const result = await upsertSiteMeta(data)
    
    await addSiteLog({
      action: 'meta_updated',
      ip_address: ipAddress,
      resource_type: 'meta',
      details: { page_path: data.page_path }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Meta verileri başarıyla güncellendi',
      data: result
    })
  } catch (error) {
    console.error('Meta güncelleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Meta verileri güncellenemedi'
    }, { status: 500 })
  }
}
