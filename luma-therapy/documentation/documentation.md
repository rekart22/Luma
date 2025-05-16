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
2. **Multiple Auth Methods** - Added support for Google OAuth, GitHub OAuth, and magic link email authentication.
3. **Protected Routes** - Set up middleware for route protection for dashboard and chat routes.
4. **Session Management** - Implemented "Remember me" functionality with configurable session duration.
5. **User Profiles** - Automatically create user profiles on first sign-in.

## Known Issues

1. **Magic Link Authentication** - Currently encountering an issue where clicking on the authentication link in emails redirects to the sign-in page with "No authorization code provided" error. This is likely due to a port mismatch between development URLs.
2. **Environment Configuration** - Issues with loading Supabase environment variables consistently between different parts of the application.

## Next Steps
- Fix the magic link authentication issue by ensuring consistent URL and port usage
- Begin implementing the Text Chat UI feature
- Continue documenting each feature and update this file as the project progresses 