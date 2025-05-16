import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './lib/database.types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  
  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Refresh session if expired - this helps with remembered sessions
  const { data: { session } } = await supabase.auth.getSession();
  
  // Auth pages handling (redirect to dashboard if logged in)
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Protected routes handling (redirect to login if no session)
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/chat')) && !session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/auth/:path*'
  ],
}; 