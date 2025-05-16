# Authentication Implementation with Supabase MCP - Feature #1

## What You Need to Do

This document outlines the remaining steps needed to complete the authentication implementation for Luma Therapy Chat using Supabase MCP.

### 1. Configure Supabase Project

Your Supabase project "Luma-therapist" has been set up, and the profiles table has been created. You need to:

- [ ] Enable Google OAuth in the Supabase dashboard (Authentication → Providers → Google)
  - Create OAuth credentials in Google Cloud Console ([Instructions](https://supabase.com/docs/guides/auth/social-login/auth-google))
  - Add your Google Client ID and Secret to the Supabase dashboard

- [ ] Enable GitHub OAuth in the Supabase dashboard (Authentication → Providers → GitHub)
  - Create OAuth App in GitHub Developer Settings ([Instructions](https://supabase.com/docs/guides/auth/social-login/auth-github))
  - Add your GitHub Client ID and Secret to the Supabase dashboard

- [ ] Configure allowed callback URLs for both providers:
  ```
  https://qwtcgfmfxqjbkmbkymdr.supabase.co/auth/v1/callback
  ```

### 2. Set Environment Variables

The setup script has been created to securely transfer your API keys to the application:

- [ ] Create a `.env` file in the project root (Luma/Luma) with your service role key:
  ```
  SUPABASE_API_KEY=your-actual-service-role-key
  ```
  (Find this in Supabase dashboard → Project Settings → API)

- [ ] Run the setup script to generate your `.env.local` file:
  ```
  cd luma-therapy/web
  node setup-env.js
  ```

- [ ] For production, add these environment variables to your Vercel project:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_API_KEY` (as a secret environment variable)

### 3. Test Authentication Flow

- [ ] Start the development server:
  ```
  npm run dev
  ```

- [ ] Navigate to `/auth/signin` to test each authentication method:
  - Google OAuth
  - GitHub OAuth
  - Email magic link

- [ ] Verify you're redirected to the dashboard after successful authentication

- [ ] Test protected routes to ensure middleware is working correctly

### 4. Admin Functionality (Optional)

If you need admin functionality, you'll need to:

- [ ] Add a `role` column to the profiles table:
  ```sql
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT;
  ```

- [ ] Set admin role for your user:
  ```sql
  UPDATE public.profiles SET role = 'admin' WHERE user_id = 'your-user-id';
  ```

- [ ] Test admin routes at `/api/admin/users` when logged in as admin user

## Security Best Practices

Please review the security documentation at `documentation/security-best-practices.md` for details on how API keys are managed securely.

Key points:
- Never expose the `SUPABASE_API_KEY` to client-side code
- Use `createClient()` for authenticated user operations
- Use `createAdminClient()` only in server-side API routes
- Ensure `.env` and `.env.local` are in your `.gitignore` 