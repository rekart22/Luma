import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

// This is a protected admin route that requires the secure API key
// It should only be accessible by authorized administrators

export async function GET(request: Request) {
  try {
    // Use the secure admin client with the SUPABASE_API_KEY
    const supabaseAdmin = createAdminClient();
    
    // This is an admin-level operation that requires service_role permissions
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ users: users.users });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 