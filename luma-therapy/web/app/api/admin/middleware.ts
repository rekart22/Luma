import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// This middleware protects all routes under /api/admin
// It verifies that the user has admin privileges before allowing access

export async function middleware(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user has admin role (you would need to implement this check)
    // This could be a database lookup to a user_roles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    if (!profile || profile.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: '/api/admin/:path*',
}; 