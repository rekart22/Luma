import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { logger, generateTraceId } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'

export async function POST(request: Request) {
  const traceId = generateTraceId();
  logger.debug(`[SIGNOUT-ALT] Starting alternative signout process`, { traceId });
  
  try {
    // Use the regular Supabase client instead of the Next.js specific one
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Try to read the sb-auth-token cookie from the request
    const cookieHeader = request.headers.get('cookie') || '';
    logger.debug(`[SIGNOUT-ALT] Cookie header: ${cookieHeader}`, { traceId });
    
    // Sign out - will only affect server-side state
    await supabase.auth.signOut();
    logger.debug(`[SIGNOUT-ALT] Server-side signout completed`, { traceId });
    
    // Create response that will clear cookies
    const response = NextResponse.redirect(new URL('/auth/signin', BASE_URL), {
      status: 303,
    });
    
    // Manually clear any Supabase cookies
    const sbCookies = ['sb-access-token', 'sb-refresh-token', 'sb-auth-token'];
    for (const name of sbCookies) {
      response.cookies.set({
        name,
        value: '',
        path: '/',
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      logger.debug(`[SIGNOUT-ALT] Cleared cookie: ${name}`, { traceId });
    }
    
    logger.debug(`[SIGNOUT-ALT] Redirect response prepared`, { traceId });
    return response;
  } catch (error) {
    logger.error(`[SIGNOUT-ALT] Error: ${error}`, { traceId });
    return NextResponse.redirect(new URL('/auth/signin', BASE_URL), { status: 303 });
  }
} 