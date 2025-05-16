# Security Best Practices for Luma Therapy Chat

This document outlines security best practices for the Luma Therapy Chat application, with a special focus on API key management.

## API Key Management

### Types of Supabase Keys

Supabase provides different types of keys, each with different security requirements:

1. **Anon/Public Key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`):
   - Intended for client-side use
   - Limited by Row Level Security (RLS) policies
   - Safe to expose in browser code
   - Prefixed with `NEXT_PUBLIC_` to indicate it's safe for client-side

2. **Service Key** (`SUPABASE_API_KEY`):
   - Full database access bypassing RLS
   - Must NEVER be exposed to the client
   - Only used in server-side code (API routes, Edge functions)
   - Not prefixed with `NEXT_PUBLIC_` to prevent accidental exposure

### How We Secure API Keys

In Luma Therapy Chat, we follow these practices:

1. **Two Separate Supabase Clients**:
   - `supabase.ts`: Client-side client using the public anon key only
   - `supabase-server.ts`: Server-side client with two functions:
     - `createClient()`: For authenticated user operations (uses anon key)
     - `createAdminClient()`: For admin operations (uses service key)

2. **Environment Variable Handling**:
   - Public keys: Stored in `.env.local` with `NEXT_PUBLIC_` prefix
   - Private keys: Stored in `.env.local` WITHOUT `NEXT_PUBLIC_` prefix
   - Vercel environment variables for production deployment

3. **Access Control**:
   - Admin routes (`/api/admin/*`) protected by middleware
   - Service key only used within protected API routes
   - All other authentication goes through the anon key + RLS

## Example Usage

### Client-side Authentication (Safe)

```typescript
// This is safe for client-side components
import { supabase } from '@/lib/supabase';

// User sign-in (uses anon key, which is safe)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

### Server-side Standard Operations (Safe)

```typescript
// This is for server components and API routes
import { createClient } from '@/lib/supabase-server';

// Server-side function
export async function getData() {
  const supabase = createClient();
  
  // This still uses RLS policies for data access
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id);
}
```

### Admin Operations (Restricted)

```typescript
// ONLY use in server-side API routes, never in client code
import { createAdminClient } from '@/lib/supabase-server';

// Admin function in API route
export async function adminFunction() {
  const supabaseAdmin = createAdminClient();
  
  // This bypasses RLS and has full access
  const { data } = await supabaseAdmin.auth.admin.listUsers();
}
```

## Row Level Security (RLS)

We enforce data security with RLS policies:

1. Users can only access their own data
2. Admins have special policies for broader access
3. Service key operations bypass RLS altogether (use with caution)

## Security Headers and Middleware

1. Admin routes are protected with dedicated middleware
2. All API routes implement proper authentication checks
3. CSP headers prevent XSS attacks
4. Rate limiting protects against abuse

## Monitoring and Auditing

1. All admin operations are logged for audit purposes
2. Regular security reviews of API key usage
3. Monitoring for suspicious admin operations

Remember: Never expose the `SUPABASE_API_KEY` to client-side code or check it into version control systems. 