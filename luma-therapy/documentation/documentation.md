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
16. **Signout Implementation** - Enhanced signout flow with:
    - Systematic clearing of all Supabase-related cookies
    - Proper async/await handling for Next.js cookie management
    - Comprehensive logging with trace IDs
    - Secure cookie clearing with appropriate flags (sameSite, secure)
    - Graceful error handling and redirection
17. **Cookie Management** - Implemented secure cookie handling:
    - Async cookie operations following Next.js best practices
    - Systematic cleanup of all auth-related cookies on signout
    - Production-ready cookie security attributes

## Environment Variable Loading (Update May 2025)

- The FastAPI backend now loads environment variables from the `.env` file located in the project root (one level above `luma-therapy/`).
- All password setup/change events are now logged securely, with no sensitive information exposed in logs.

## Known Issues

- All known authentication and profile creation issues have been resolved as of the latest update.
- Previous issues with missing profile rows, RLS, and password setup are fixed.

## Next Steps
- Monitor for edge-case auth/profile issues
- Continue documenting each feature and update this file as the project progresses
- Begin implementing the Text Chat UI feature
- Continue to improve error messaging, logging, and UX 

## Password Change Security (Update June 2025)

- Password changes now require verification of the current password before allowing updates.
- This is enforced via two new PostgreSQL functions:
  - `verify_user_password(password text)`
  - `change_user_password(current_plain_password text, new_plain_password text)`
- The migration for these functions is in `db/supabase/migrations/20240630_verify_current_password.sql`.
- The frontend profile page now verifies the current password before updating, using a Supabase RPC call.
- For maximum security, the `change_user_password` function can be used to verify and update in a single transaction.
- All password changes are logged with trace IDs for auditability.

## Port Configuration

- By default, the Next.js frontend runs on port 3000.
- For local development, you can run it on port 3004 using `npm run dev -- -p 3004` or `npm run start -- -p 3004`.
- The FastAPI backend runs on port 8000.
- CORS and API endpoints should be configured to match the frontend port in use.

## Migration & Setup Steps (addendum)

17. **Password Security Migration** - Run the migration in `db/supabase/migrations/20240630_verify_current_password.sql` to enable secure password change functionality.
18. **Password Change Flow** - All password changes now require the current password and are verified server-side before updating.

## Known Issues (update)
- All password change flows are now secure and require current password verification.
- No known issues with password setup/change as of this update. 