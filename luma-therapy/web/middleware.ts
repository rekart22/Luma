import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './lib/database.types';
import { logger, generateTraceId } from './lib/utils';

// Constants for consistent URL handling
const BASE_URL = 'http://localhost:3004';
const SIGNIN_URL = `${BASE_URL}/auth/signin`;
const CHAT_URL = `${BASE_URL}/chat-app`;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  const traceId = generateTraceId();

  logger.debug(`[MIDDLEWARE ENTRY] Path: ${pathname}`, { traceId });

  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Refresh session if expired - this helps with remembered sessions
  const { data: { session } } = await supabase.auth.getSession();
  logger.debug(`[SESSION CHECK] Path: ${pathname}, Session: ${!!session}, SessionObj: ${JSON.stringify(session)}`, { traceId });
  
  // Auth pages handling (redirect to chat if logged in)
  if (pathname.startsWith('/auth') && session && session.user) {
    logger.info(`[AUTH REDIRECT] User already signed in, redirecting to /chat-app`, { traceId });
    return NextResponse.redirect(new URL(CHAT_URL));
  }
  
  // Protected routes handling (redirect to login if no session)
  if ((pathname.startsWith('/dashboard') || 
       pathname.startsWith('/chat') || 
       pathname.startsWith('/chat-app')) && (!session || !session.user)) {
    logger.warn(`[PROTECTED REDIRECT] No session found, redirecting to /auth/signin`, { traceId });
    return NextResponse.redirect(new URL(SIGNIN_URL));
  }
  
  if (pathname.startsWith('/chat-app')) {
    logger.debug(`[MIDDLEWARE COOKIES] Cookies for /chat-app:`, { traceId, cookies: req.cookies });
  }
  
  logger.debug(`[MIDDLEWARE PASS] Path: ${pathname} allowed`, { traceId });
  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/chat-app/:path*',
    '/auth/:path*'
  ],
};