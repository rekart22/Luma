import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logger, generateTraceId } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// Constants for consistent URL use
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004';

export async function POST(request: Request) {
  const traceId = generateTraceId();
  logger.debug(`[SIGNOUT] Starting signout process`, { traceId });

  try {
    // Get cookie store and await it
    const cookieStore = await cookies();
    logger.debug(`[SIGNOUT] Cookie store initialized`, { traceId });

    // List all cookies before clearing
    const allCookies = await cookieStore.getAll();
    logger.debug(`[SIGNOUT] Current cookies:`, { 
      cookieNames: allCookies.map(c => c.name),
      traceId 
    });

    const supabase = createRouteHandlerClient({ 
      cookies: async () => await cookies()
    });
    
    // Sign out from Supabase
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw signOutError;
    }
    logger.debug(`[SIGNOUT] Supabase signOut completed`, { traceId });

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/auth/signin', BASE_URL), {
      status: 307,
    });

    // Clear all Supabase-related cookies
    const supabaseCookies = allCookies.filter(cookie => 
      cookie.name.startsWith('sb-')
    );

    for (const cookie of supabaseCookies) {
      logger.debug(`[SIGNOUT] Clearing cookie: ${cookie.name}`, { traceId });
      response.cookies.set(cookie.name, '', { 
        maxAge: 0,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    logger.debug(`[SIGNOUT] All cookies cleared, redirecting`, { traceId });
    return response;

  } catch (error) {
    logger.error('[SIGNOUT] Error during signout:', { error, traceId });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 