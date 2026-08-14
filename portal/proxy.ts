import { jwtVerify } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

async function getSessionEmail(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get('session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.email as string
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const email = await getSessionEmail(request)
  const { pathname } = request.nextUrl

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !email) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && email) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
