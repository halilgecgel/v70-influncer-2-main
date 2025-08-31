import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const stats = await getDashboardStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Dashboard istatistikleri hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'İstatistikler alınamadı'
    }, { status: 500 })
  }
}
