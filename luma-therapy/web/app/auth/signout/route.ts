import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logger, generateTraceId } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// Constants for consistent URL use
const BASE_URL = 'http://localhost:3004';

export async function POST() {
  const traceId = generateTraceId();
  logger.debug(`[SIGNOUT] Server-side signout route called`, { traceId });

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  // Sign out the user
  await supabase.auth.signOut()

  // Explicitly clear the Supabase auth cookie (for Edge runtime)
  const response = NextResponse.redirect(new URL('/', BASE_URL))
  response.cookies.set({ name: 'sb-access-token', value: '', path: '/', maxAge: 0 })
  response.cookies.set({ name: 'sb-refresh-token', value: '', path: '/', maxAge: 0 })
  logger.debug(`[SIGNOUT] Cleared sb-access-token and sb-refresh-token cookies`, { traceId });

  return response
} 