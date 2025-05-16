import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Create/update the user profile if needed
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', user.id)
        .single()
      
      if (!existingProfile) {
        // Create new profile
        await supabase.from('profiles').insert({
          user_id: user.id,
          display_name: user.user_metadata.full_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata.avatar_url,
        })
      }
    }
  }
  
  // Redirect to the dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
} 