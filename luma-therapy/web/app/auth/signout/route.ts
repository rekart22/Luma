import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Constants for consistent URL use
const BASE_URL = 'http://localhost:3004';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Sign out the user
  await supabase.auth.signOut()
  
  // Redirect to home page
  return NextResponse.redirect(new URL('/', BASE_URL))
} 