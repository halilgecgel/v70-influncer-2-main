import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// E-posta transporter konfigürasyonu
const transporter = nodemailer.createTransport({
  host: 'mail.gecgelsoft.com',
  port: 465,
  secure: true, // SSL/TLS için true
  auth: {
    user: 'halilgecgel@gecgelsoft.com',
    pass: 'Halil4393.'
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
})

export async function POST(request: NextRequest) {
  try {
    // Request body'yi parse et
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);
      return NextResponse.json(
        { success: false, error: 'Geçersiz JSON formatı' },
        { status: 400 }
      );
    }

    const { influencerId, influencerName, userEmail, teklif } = body;

    if (!influencerId || !influencerName || !userEmail || !teklif) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanlar gerekli' },
        { status: 400 }
      )
    }

    // Kullanıcıya gönderilecek e-posta
    const userMailOptions = {
      from: '"Keşif Collective" <halilgecgel@gecgelsoft.com>',
      to: userEmail,
      subject: 'Teklifiniz Başarıyla İletildi - Keşif Collective',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Teklif Onayı</title>
        </head>
        <body style="font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #000000;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #000000;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <img src="https://kesif-sigma.vercel.app/kesif-logo.jpg" alt="Keşif Collective" style="width: 120px; height: auto; border-radius: 8px;">
              </div>
              <h1 style="color: #000000; margin: 0; font-size: 28px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; letter-spacing: 1px;">KEŞİF COLLECTIVE</h1>
              <p style="color: rgba(0,0,0,0.8); margin: 10px 0 0 0; font-size: 14px; font-weight: 500;">Influencer Marketing Platform</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; background-color: #000000;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background-color: #22c55e; color: #000000; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                  <span style="font-size: 20px; font-weight: bold;">✓</span>
                </div>
                <h2 style="color: #22c55e; margin: 0; font-size: 24px; font-weight: 700;">Teklifiniz Başarıyla İletildi</h2>
              </div>
              
              <p style="color: #ffffff; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                Merhaba,
              </p>
              
              <p style="color: #ffffff; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                <strong style="color: #22c55e;">${influencerName}</strong> için gönderdiğiniz işbirliği teklifi başarıyla iletildi.
              </p>
              
              <div style="background-color: #1a1a1a; border: 1px solid #333333; padding: 25px; margin: 30px 0; border-radius: 8px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <span style="color: #22c55e; font-size: 18px; margin-right: 10px;">📋</span>
                  <h4 style="color: #22c55e; margin: 0; font-size: 18px; font-weight: 600;">Teklif Detayları</h4>
                </div>
                <p style="color: #ffffff; margin: 0; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${teklif}</p>
              </div>
              
              <p style="color: #ffffff; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                Bizi tercih ettiğiniz için teşekkür ederiz. En kısa sürede size dönüş yapılacaktır.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://kesifcollective.com" style="background-color: #22c55e; color: #000000; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">Web Sitemizi Ziyaret Edin</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111111; padding: 25px; text-align: center; border-top: 1px solid #333333;">
              <p style="color: #ffffff; margin: 0; font-size: 14px; font-weight: 500;">
                Saygılarımızla,<br>
                <strong style="color: #22c55e;">Keşif Collective Ekibi</strong>
              </p>
              <p style="color: #666666; margin: 10px 0 0 0; font-size: 12px;">
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // Admin'e gönderilecek e-posta
    const influencerMailOptions = {
      from: '"Keşif Collective" <halilgecgel@gecgelsoft.com>',
      to: 'halilgecgel@gecgelsoft.com',
      subject: `🎯 Yeni İşbirliği Teklifi - ${influencerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Yeni Teklif</title>
        </head>
        <body style="font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #000000;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #000000;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <img src="https://kesif-sigma.vercel.app/kesif-logo.jpg" alt="Keşif Collective" style="width: 120px; height: auto; border-radius: 8px;">
              </div>
              <h1 style="color: #000000; margin: 0; font-size: 28px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; letter-spacing: 1px;">KEŞİF COLLECTIVE</h1>
              <p style="color: rgba(0,0,0,0.8); margin: 10px 0 0 0; font-size: 14px; font-weight: 500;">Yeni İşbirliği Teklifi</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; background-color: #000000;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background-color: #22c55e; color: #000000; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                  <span style="font-size: 20px; font-weight: bold;">🎯</span>
                </div>
                <h2 style="color: #22c55e; margin: 0; font-size: 24px; font-weight: 700;">Yeni Teklif Alındı</h2>
              </div>
              
              <div style="background-color: #1a1a1a; border: 1px solid #22c55e; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #22c55e; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">Influencer: ${influencerName}</h3>
                <p style="color: #ffffff; margin: 0; font-size: 16px;">ID: ${influencerId}</p>
              </div>
              
              <div style="background-color: #1a1a1a; border: 1px solid #333333; padding: 25px; margin: 30px 0; border-radius: 8px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <span style="color: #22c55e; font-size: 18px; margin-right: 10px;">📧</span>
                  <h4 style="color: #22c55e; margin: 0; font-size: 18px; font-weight: 600;">Gönderen Bilgileri</h4>
                </div>
                <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px;"><strong>E-posta:</strong> ${userEmail}</p>
                <p style="color: #ffffff; margin: 0; font-size: 16px;"><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
              </div>
              
              <div style="background-color: #1a1a1a; border: 1px solid #333333; padding: 25px; margin: 30px 0; border-radius: 8px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <span style="color: #22c55e; font-size: 18px; margin-right: 10px;">💬</span>
                  <h4 style="color: #22c55e; margin: 0; font-size: 18px; font-weight: 600;">Teklif Metni</h4>
                </div>
                <p style="color: #ffffff; margin: 0; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${teklif}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${userEmail}" style="background-color: #22c55e; color: #000000; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; margin-right: 15px;">E-posta Yanıtla</a>
                <a href="https://kesifcollective.com/admin" style="background-color: #22c55e; color: #000000; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">Admin Paneli</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111111; padding: 25px; text-align: center; border-top: 1px solid #333333;">
              <p style="color: #ffffff; margin: 0; font-size: 14px; font-weight: 500;">
                Bu e-posta otomatik olarak gönderilmiştir.<br>
                <strong style="color: #22c55e;">Keşif Collective Admin Sistemi</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // E-postaları gönder
    try {
      console.log('E-posta gönderiliyor...');
      
      // Kullanıcıya e-posta gönder
      const userResult = await transporter.sendMail(userMailOptions);
      console.log('Kullanıcı e-postası gönderildi:', userResult.messageId);
      
      // Admin'e e-posta gönder
      const adminResult = await transporter.sendMail(influencerMailOptions);
      console.log('Admin e-postası gönderildi:', adminResult.messageId);
      
    } catch (emailError) {
      console.error('E-posta gönderme hatası:', emailError);
      return NextResponse.json(
        { success: false, error: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      );
    }

    // Veritabanına kaydet (şimdilik devre dışı)
    // await sql`
    //   INSERT INTO teklifler (influencer_id, influencer_name, user_email, teklif_metni, created_at)
    //   VALUES (${influencerId}, ${influencerName}, ${userEmail}, ${teklif}, NOW())
    // `

    return NextResponse.json({
      success: true,
      message: 'Teklif başarıyla gönderildi'
    })

  } catch (error) {
    console.error('Teklif gönderme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Teklif gönderilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
