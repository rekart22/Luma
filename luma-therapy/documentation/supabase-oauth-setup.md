# Setting Up OAuth Providers in Supabase

This guide will walk you through setting up Google and GitHub OAuth providers for your Luma Therapy Chat application.

## Prerequisites

- Supabase project (already created: "Luma-therapist")
- Google Developer account (for Google OAuth)
- GitHub account (for GitHub OAuth)

## Google OAuth Setup

1. **Create OAuth credentials in Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Set a name for your OAuth client
   - Add authorized redirect URIs:
     - `https://qwtcgfmfxqjbkmbkymdr.supabase.co/auth/v1/callback`
   - Click "Create"
   - Note your Client ID and Client Secret

2. **Add Google OAuth credentials to Supabase**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your "Luma-therapist" project
   - Navigate to "Authentication" > "Providers"
   - Find "Google" and click "Enable"
   - Enter your Google Client ID and Client Secret
   - Save changes

## GitHub OAuth Setup

1. **Create OAuth App in GitHub**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the form:
     - Application name: "Luma Therapy Chat"
     - Homepage URL: Your website or `http://localhost:3000` for development
     - Authorization callback URL: `https://qwtcgfmfxqjbkmbkymdr.supabase.co/auth/v1/callback`
   - Click "Register application"
   - Note your Client ID
   - Generate a new Client Secret and note it

2. **Add GitHub OAuth credentials to Supabase**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your "Luma-therapist" project
   - Navigate to "Authentication" > "Providers"
   - Find "GitHub" and click "Enable"
   - Enter your GitHub Client ID and Client Secret
   - Save changes

## Verify Configuration

To verify your OAuth configuration:

1. Ensure your `.env.local` file has the correct Supabase URL and Anon Key
2. Run the application: `npm run dev`
3. Navigate to `/auth/signin`
4. Try signing in with Google and GitHub
5. You should be redirected to the respective OAuth provider's login page
6. After successful authentication, you should be redirected back to your application's dashboard

## Troubleshooting

- **Redirect URI Mismatch**: Ensure the callback URL in your OAuth provider settings exactly matches your Supabase callback URL
- **CORS Errors**: Check your browser console for CORS-related errors
- **Session Not Persisting**: Ensure cookies are properly configured in your Supabase client

## Next Steps

After setting up OAuth, you should:

1. Test the authentication flow thoroughly
2. Implement additional security measures as needed
3. Create user profiles for authenticated users 