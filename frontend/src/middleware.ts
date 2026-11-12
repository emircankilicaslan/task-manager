import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];
const SESSION_COOKIE = 'session';

// Sayfa yönlendirmesi içindir; veri erişimi her zaman API'deki token doğrulamasıyla korunur.
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === '1';
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};