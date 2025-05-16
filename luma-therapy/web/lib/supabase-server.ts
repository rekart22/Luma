import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

// Define types locally if database.types doesn't exist yet
type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          role?: string | null;
        };
      };
      // Other tables as needed
    };
  };
};

// Public client for authenticated user operations
export const createClient = () => {
  return createServerComponentClient<Database>({ 
    cookies
  });
};

// Secure admin client for privileged operations - only available server-side
export const createAdminClient = () => {
  // IMPORTANT: Only use this on server-side functions like API routes
  // Never expose the service_role key to the client
  
  // This uses the direct supabase-js client instead of the auth-helpers client
  // because we need to use the service role key
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_API_KEY || '',
    {
      auth: {
        autoRefreshToken: true,
        persistSession: false
      }
    }
  );
}; 