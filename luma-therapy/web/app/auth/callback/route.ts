import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

// Constants for consistent URL use
const BASE_URL = 'http://localhost:3004';
const SIGNIN_URL = `${BASE_URL}/auth/signin`;
const DASHBOARD_URL = `${BASE_URL}/dashboard`;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  console.log('Auth callback triggered. URL:', requestUrl.toString())
  console.log('Query parameters:', Object.fromEntries(requestUrl.searchParams.entries()))
  
  // Check if we have an error parameter (some OAuth providers return errors this way)
  const errorParam = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  if (errorParam) {
    console.error(`Auth error returned: ${errorParam}`, errorDescription)
    return NextResponse.redirect(
      new URL(`${SIGNIN_URL}#error=${errorParam}&error_description=${encodeURIComponent(errorDescription || 'Authentication error')}`)
    )
  }
  
  const code = requestUrl.searchParams.get('code')
  
  // Handle cases where the code is missing but there's a fragment or hash
  const hasFragment = requestUrl.hash && requestUrl.hash.length > 0
  if (hasFragment) {
    console.log('URL has fragment:', requestUrl.hash)
    // In some cases, the code might be in the fragment
    try {
      const fragmentParams = new URLSearchParams(requestUrl.hash.substring(1));
      const fragmentCode = fragmentParams.get('code');
      if (fragmentCode && !code) {
        console.log('Found code in fragment, using that instead')
        // Create a new URL with the code in the query parameters
        const newUrl = new URL(requestUrl.toString());
        newUrl.searchParams.set('code', fragmentCode);
        return NextResponse.redirect(newUrl);
      }
    } catch (error) {
      console.error('Error parsing fragment:', error)
    }
  }
  
  // If there's no code, redirect to sign-in with an error
  if (!code) {
    console.error('No auth code provided in the request')
    return NextResponse.redirect(
      new URL(`${SIGNIN_URL}#error=no_code&error_description=No authorization code provided. Please try signing in again.`)
    )
  }
  
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    console.log('Exchanging code for session...')
    // Exchange the code for a session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      
      // Handle specific error cases
      if (sessionError.message.includes('expired')) {
        return NextResponse.redirect(
          new URL(`${SIGNIN_URL}#error=link_expired&error_description=Your login link has expired. Please request a new one.`)
        )
      }
      
      return NextResponse.redirect(
        new URL(`${SIGNIN_URL}#error=${sessionError.name || 'SessionError'}&error_description=${encodeURIComponent(sessionError.message)}`)
      )
    }
    
    console.log('Session created successfully, getting user details...')
    // Get the user details
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('User error:', userError)
      return NextResponse.redirect(
        new URL(`${SIGNIN_URL}#error=user_fetch_failed&error_description=Failed to get user details`)
      )
    }
    
    console.log('User authenticated successfully:', user.email)
    
    // Create/update user profile if needed
    console.log('Checking for existing profile...')
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user.id)
      .single()
    
    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileFetchError)
    }
    
    if (!existingProfile) {
      console.log('Creating new user profile...')
      const { error: profileCreateError } = await supabase.from('profiles').insert({
        user_id: user.id,
        display_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata.avatar_url,
      })
      
      if (profileCreateError) {
        console.error('Profile creation error:', profileCreateError)
        // Continue anyway, as this isn't critical for auth
      }
    } else {
      console.log('User profile already exists')
    }
    
    // Redirect to the dashboard on success
    console.log('Authentication complete, redirecting to dashboard')
    return NextResponse.redirect(new URL(DASHBOARD_URL))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL(`${SIGNIN_URL}#error=callback_error&error_description=An unexpected error occurred during authentication. Please try again.`)
    )
  }
} 