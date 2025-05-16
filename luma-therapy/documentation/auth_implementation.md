# Authentication Implementation - Feature #1

## Overview

This document details the implementation of the authentication system for Luma Therapy Chat, focusing on Google OAuth, GitHub OAuth, and email magic link authentication with "Remember me" functionality.

## Key Components

### 1. Supabase Integration

- **Client-Side Integration**: `@supabase/supabase-js` for browser interactions
  - File: `lib/supabase.ts`
  - Purpose: Handles client-side authentication flows (OAuth redirects, magic links)

- **Server-Side Integration**: `@supabase/auth-helpers-nextjs` for secure server operations
  - File: `lib/supabase-server.ts`
  - Purpose: Server-side session validation and secure data fetching

### 2. Authentication Routes

- **Sign-In Page**: User-facing authentication interface
  - File: `app/auth/signin/page.tsx`
  - Features:
    - Google OAuth button
    - GitHub OAuth button
    - Email magic link form
    - "Remember me" checkbox (30-day session vs 24-hour default)

- **OAuth Callback Handler**: Processes OAuth provider redirects
  - File: `app/auth/callback/route.ts`
  - Actions:
    - Exchanges temporary code for session
    - Creates/updates user profile
    - Redirects to dashboard

- **Sign-Out Handler**: Terminates user sessions
  - File: `app/auth/signout/route.ts`
  - Actions:
    - Invalidates current session
    - Redirects to home page

### 3. Route Protection & Middleware

- **Auth Middleware**: Guards protected routes
  - File: `middleware.ts`
  - Functions:
    - Validates session on protected routes
    - Redirects unauthenticated users to login
    - Refreshes expired tokens automatically
    - Redirects authenticated users away from auth pages

### 4. Database Schema

```sql
-- profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

- User authentication data is stored in Supabase's built-in `auth.users` table
- Profile data is stored in a custom `profiles` table with RLS policies
- User-message relationships are established through the `user_id` foreign key

### 5. Security Measures

- **Row Level Security**: Ensures users can only access their own data
- **CSRF Protection**: Managed by Next.js and Supabase Auth Helpers
- **Secure Cookies**: HTTP-only, secure cookies for session management 
- **Token Refresh**: Automatic token rotation for extended sessions
- **Rate Limiting**: Implemented at the middleware level

## Session Management

1. **Default Sessions**: 24-hour duration
2. **Remembered Sessions**: 30-day duration when "Remember me" is selected
3. **Session Storage**: HTTP-only cookies (not accessible via JavaScript)
4. **Token Refresh**: Automatic refresh of expired tokens via middleware

## Authentication Flow

1. User navigates to `/auth/signin`
2. User selects authentication method:
   - Google/GitHub → OAuth flow → provider site → callback
   - Email → Enter email → Receive magic link → Click link → callback
3. Callback route exchanges temporary code for session
4. Profile is created/updated in database
5. User is redirected to dashboard
6. Protected routes are now accessible until session expires

## Implementation Decisions

1. **Multiple Auth Methods**: Providing different options increases accessibility
2. **Magic Links vs Passwords**: Password-less auth improves security
3. **Server Components**: Using Next.js RSC for secure data fetching
4. **Middleware Approach**: Route protection at the Edge for performance
5. **Profile Creation**: Automatic profile creation for streamlined onboarding

## Future Enhancements

1. **Multi-factor Authentication**: Add additional security layer
2. **Session Management UI**: Allow users to view and manage active sessions
3. **Account Linking**: Connect multiple providers to the same account
4. **Enhanced Rate Limiting**: More sophisticated rate limiting and abuse prevention 