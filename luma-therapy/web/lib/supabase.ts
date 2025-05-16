import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Simplified Database type
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
        };
      };
      // Other tables as needed
    };
  };
};

// Client-side Supabase client (uses anon key only)
// This is safe to use in the browser as it only has limited permissions
export const supabase = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qwtcgfmfxqjbkmbkymdr.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
); 