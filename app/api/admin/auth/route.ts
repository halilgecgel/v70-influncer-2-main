import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminUser, createOTPCode, addSiteLog } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password, otpCode: submittedOtpCode } = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Eğer OTP kodu varsa, doğrula
    if (submittedOtpCode) {
      // OTP doğrulama işlemi burada yapılacak
      // Şimdilik basit bir doğrulama
      if (submittedOtpCode === '123456') {
        // Başarılı giriş
        const user = await verifyAdminUser(email, password)
        if (user) {
          await addSiteLog({
            action: 'admin_login_success',
            ip_address: ipAddress,
            user_agent: userAgent,
            details: { email, method: 'otp' }
          })

          return NextResponse.json({
            success: true,
            message: 'Giriş başarılı',
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              full_name: user.full_name,
              role: user.role
            }
          })
        }
      }

      return NextResponse.json({
        success: false,
        message: 'Geçersiz OTP kodu'
      }, { status: 401 })
    }

    // Email ve şifre ile giriş
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email ve şifre gerekli'
      }, { status: 400 })
    }

    const user = await verifyAdminUser(email, password)
    
    if (!user) {
      await addSiteLog({
        action: 'admin_login_failed',
        ip_address: ipAddress,
        user_agent: userAgent,
        details: { email, reason: 'invalid_credentials' }
      })

      return NextResponse.json({
        success: false,
        message: 'Geçersiz email veya şifre'
      }, { status: 401 })
    }

    // OTP kodu oluştur ve gönder
    const generatedOtpCode = await createOTPCode(email, 'login')
    
    // Burada email gönderme işlemi yapılacak
    console.log(`OTP kodu ${email} adresine gönderildi: ${generatedOtpCode}`)

    await addSiteLog({
      action: 'admin_otp_sent',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: { email }
    })

    return NextResponse.json({
      success: true,
      message: 'OTP kodu email adresinize gönderildi',
      requiresOTP: true
    })

  } catch (error) {
    console.error('Admin girişi hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}
