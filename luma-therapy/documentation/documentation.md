# Luma Therapy Project Documentation

## Project Structurea

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

## Next Steps
- Begin implementing the Auth gateway feature (Google & GitHub OAuth via Supabase SSR helpers)
- Continue documenting each feature and update this file as the project progresses 