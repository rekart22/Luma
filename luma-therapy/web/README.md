# Luma Therapy Chat - Web Frontend

## Authentication Setup

To set up the authentication system, follow these steps:

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com/) and create a new project
   - Under Authentication -> Providers, enable Google and GitHub OAuth providers
   - Configure your OAuth credentials for each provider (client IDs and secrets)
   - Set authorized redirect URIs to: `https://your-domain.com/auth/callback`

2. **Configure environment variables**:
   - Copy `.env.local.example` to `.env.local` (created by `cp .env.local.example .env.local`)
   - Add your Supabase project URL and anon key from the Supabase dashboard

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Create database tables**:
   Run the following SQL in the Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE IF NOT EXISTS public.profiles (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     display_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
   );

   -- Set up Row Level Security
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow users to view only their own profile
   CREATE POLICY "Users can view only their own profile"
     ON public.profiles
     FOR SELECT
     USING (auth.uid() = user_id);

   -- Create policy to allow users to update only their own profile
   CREATE POLICY "Users can update only their own profile"
     ON public.profiles
     FOR UPDATE
     USING (auth.uid() = user_id);

   -- Create policy to allow users to insert only their own profile
   CREATE POLICY "Users can insert only their own profile"
     ON public.profiles
     FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   ```

4. **Start the development server**:
   ```
   npm run dev
   ```

5. **Access the application**:
   - Open `http://localhost:3000` in your browser
   - Navigate to `/auth/signin` to test the authentication flow
   - After successful login, you'll be redirected to `/dashboard`

## Features

The authentication system includes:

- **Multiple Sign-in Options**:
  - Google OAuth
  - GitHub OAuth
  - Email magic link authentication

- **Session Management**:
  - 24-hour default session duration
  - 30-day "Remember me" option

- **Protected Routes**:
  - Middleware automatically protects `/dashboard` and `/chat` routes
  - Redirects unauthenticated users to login

- **User Profiles**:
  - Automatic profile creation on first sign-in
  - Displays user name and avatar in dashboard

## Development Notes

- The authentication system uses Supabase Auth Helpers for Next.js
- Session management is handled via secure cookies
- User data is protected with Row Level Security in Supabase 