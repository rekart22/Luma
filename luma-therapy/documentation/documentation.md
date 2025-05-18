# Luma Therapy Project Documentation

## Project Structure

```
luma-therapy/
├── web/                   # Next.js frontend (UI files migrated here)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   └── ...config and package files
├── ai-orchestra/          # TypeScript agent system
│   ├── agents/
│   └── states/
├── api/                   # FastAPI service
│   ├── routers/
│   └── services/
└── db/                    # Database migrations
    └── supabase/
    └── documentation/     # Project documentation
```

## Migration & Setup Steps

1. **Created the new project structure** in `luma-therapy/` with subfolders for frontend, backend, agents, and database.
2. **Moved all UI files** from the Macaly UI source into `luma-therapy/web/` and verified the correct placement of all components, hooks, and utilities.
3. **Fixed all import paths** to match the new structure (e.g., `@/components/components/...`, `@/lib/lib/utils`).
4. **Cleaned and reinstalled dependencies** using `npm install` in the web directory.
5. **Fixed Next.js configuration** to remove deprecated/experimental settings and ensure compatibility with Next.js 15.
6. **Resolved all build and runtime errors** by correcting import paths and configuration issues.
7. **Successfully started the development server** and verified the UI loads at the correct port (e.g., http://localhost:3004).

## Authentication Implementation

1. **Supabase Integration** - Implemented authentication using Supabase Auth Helpers for Next.js.
2. **Multiple Auth Methods** - Added support for Google OAuth, GitHub OAuth, and magic link email authentication (supports both PKCE and hash-based flows).
3. **Protected Routes** - Set up middleware for route protection for dashboard and chat routes.
4. **Session Management** - Implemented "Remember me" functionality with configurable session duration.
5. **User Profiles** - Automatically create user profiles on first sign-in using a database trigger on `auth.users` (see below).
6. **Redirection** - All successful sign-ins (OAuth or magic link) redirect to /chat-app.
7. **Session Detection** - Uses createPagesBrowserClient from @supabase/auth-helpers-nextjs for correct PKCE/session handling.
8. **Error Handling** - If user is signed in, errors are suppressed and user is redirected; no error toasts on successful sign-in.
9. **Password Storage** - Passwords are securely hashed and stored in `auth.users` (never accessible in plaintext).
10. **Password Setup/Change** - UI and backend logic ensure users can set/change passwords, with logging and trace IDs for all events.
11. **Logging** - Frontend and backend log all password setup/change attempts, successes, and failures with trace IDs for auditability.
12. **RLS Security** - Row Level Security (RLS) is enabled on `profiles` and policies restrict access to only the user's own profile (using `id`).
13. **Database Schema** - The `profiles` table no longer has a redundant `user_id` column; all logic uses `id` (matching `auth.users.id`).
14. **Database Trigger** - A trigger on `auth.users` automatically creates a row in `profiles` for every new user.
15. **Schema Fixes** - All NOT NULL constraints and defaults are set to allow trigger-based inserts.
16. **Testing & Verification** - All flows (signup, password setup/change, profile access) tested and confirmed working as of latest update.

## Known Issues

- All known authentication and profile creation issues have been resolved as of the latest update.
- Previous issues with missing profile rows, RLS, and password setup are fixed.

## Next Steps
- Monitor for edge-case auth/profile issues
- Continue documenting each feature and update this file as the project progresses
- Begin implementing the Text Chat UI feature
- Continue to improve error messaging, logging, and UX 