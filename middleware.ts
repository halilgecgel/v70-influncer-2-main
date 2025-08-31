import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Sadece sayfa isteklerini logla (API istekleri hariç)
  if (!request.nextUrl.pathname.startsWith('/api')) {
    // Sayfa görüntülemesi logla
    logPageView(request)
  }
  
  return NextResponse.next()
}

async function logPageView(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || ''
    
    // Sayfa görüntülemesi API'sine istek gönder
    await fetch(`${request.nextUrl.origin}/api/log/page-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_path: request.nextUrl.pathname,
        page_title: getPageTitle(request.nextUrl.pathname),
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer
      }),
    })
  } catch (error) {
    // Log hatası kritik değil, sessizce geç
    console.error('Sayfa görüntülemesi loglanamadı:', error)
  }
}

function getPageTitle(pathname: string): string {
  const titles: { [key: string]: string } = {
    '/': 'Ana Sayfa - Keşif Collective',
    '/influencers': 'Influencerlar - Keşif Collective',
    '/brands': 'Markalar - Keşif Collective',
    '/about': 'Hakkımızda - Keşif Collective',
    '/control': 'Admin Paneli - Keşif Collective'
  }
  
  return titles[pathname] || 'Keşif Collective'
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
