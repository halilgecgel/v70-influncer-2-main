import { NextRequest, NextResponse } from 'next/server'
import { getConnection, closeConnection } from '@/lib/database'

export async function GET(request: NextRequest) {
  const connection = await getConnection()
  
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // Tüm influencer'lardan uzmanlık alanlarını çek
    const [rows] = await connection.execute(`
      SELECT specialties 
      FROM influencers 
      WHERE is_active = 1 AND specialties IS NOT NULL
    `)
    
    // Tüm uzmanlık alanlarını topla
    const allSpecialties = new Set<string>()
    
    ;(rows as any[]).forEach(row => {
      try {
        const specialties = JSON.parse(row.specialties || '[]')
        if (Array.isArray(specialties)) {
          specialties.forEach((specialty: string) => {
            if (specialty && typeof specialty === 'string') {
              allSpecialties.add(specialty.trim())
            }
          })
        }
      } catch (error) {
        console.error('JSON parse hatası:', error)
      }
    })
    
    // Arama filtresi uygula
    let filteredSpecialties = Array.from(allSpecialties)
    if (search) {
      filteredSpecialties = filteredSpecialties.filter(specialty =>
        specialty.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Alfabetik sırala
    filteredSpecialties.sort()
    
    return NextResponse.json({
      success: true,
      data: filteredSpecialties
    })
    
  } catch (error) {
    console.error('Uzmanlık alanları çekilirken hata:', error)
    return NextResponse.json({
      success: false,
      error: 'Uzmanlık alanları alınamadı'
    }, { status: 500 })
  } finally {
    await closeConnection(connection)
  }
}
