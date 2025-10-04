import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/auth/auth';


// Only API public paths (login API)
const PUBLIC_PATHS = ['/login'];

export async function middleware(req: NextRequest) {
  const encryptedToken = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  // Root route "/"
  if (url.pathname === '/') {
    if (encryptedToken) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Handle /ui/login 
  if (url.pathname === '/login') {
    if (encryptedToken) {
      try {
        const result = await verifyToken(encryptedToken);
        if (result && !('expired' in result)) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        else{
          return NextResponse.redirect(new URL('/login', req.url));
        }
      } catch {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    return NextResponse.next();
  }

  // Allow public API paths
  if (PUBLIC_PATHS.includes(url.pathname)) {
    return NextResponse.next();
  }

}

export const config = {
  matcher: [
    '/',
  ],
};