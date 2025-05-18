import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

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
export const supabase = createBrowserSupabaseClient(); 