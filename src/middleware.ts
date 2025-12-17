import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/projects']
  const shouldProtect = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (shouldProtect && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  // Auth pages - redirect to dashboard if already authenticated
  const authPaths = ['/login', '/signup']
  const shouldRedirectAuth = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (shouldRedirectAuth && user) {
    return Response.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
