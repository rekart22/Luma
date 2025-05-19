import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

export function createClient() {
  const cookieStore = cookies()
  
  return createRouteHandlerClient<Database>({ 
    cookies: () => cookieStore
  })
} 