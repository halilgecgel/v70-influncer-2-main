import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu 5MB\'dan büyük olamaz' },
        { status: 400 }
      )
    }

    // Dosya türü kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Sadece JPEG, PNG ve WebP dosyaları kabul edilir' },
        { status: 400 }
      )
    }

    // Dosya adını oluştur (benzersiz olması için timestamp ekle)
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `influencer-${timestamp}.${fileExtension}`

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosyayı public/uploads klasörüne kaydet
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, fileName)

    // Klasör yoksa oluştur
    try {
      await writeFile(filePath, buffer)
    } catch (error) {
      // Klasör yoksa oluşturmaya çalış
      const fs = require('fs')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
        await writeFile(filePath, buffer)
      } else {
        throw error
      }
    }

    // URL'i döndür
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      message: 'Dosya başarıyla yüklendi',
      data: {
        url: fileUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    })

  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Dosya yükleme sırasında hata oluştu' },
      { status: 500 }
    )
  }
}

// Dosya silme endpoint'i
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'Dosya adı gerekli' },
        { status: 400 }
      )
    }

    const fs = require('fs')
    const filePath = join(process.cwd(), 'public', 'uploads', fileName)

    // Dosya var mı kontrol et
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      
      return NextResponse.json({
        success: true,
        message: 'Dosya başarıyla silindi'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Dosya silme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Dosya silme sırasında hata oluştu' },
      { status: 500 }
    )
  }
}
