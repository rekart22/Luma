# Luma Therapy Chat - Feature Roadmap

## Feature #1: Auth Gateway
**Status**: Complete
**Dependencies**: None
**Owner**: Dev Team

### Requirements
- Implement Google & GitHub OAuth via Supabase SSR helpers
- Create authentication sign-in page
- Implement protected routes
- Add "Remember me" functionality
- Handle session expiration and refresh
- Support both PKCE (?code=...) and hash-based (#access_token=...) magic link flows
- Robust error handling for all auth flows
- Redirect to /chat-app after successful sign-in
- Automatically create user profiles on first sign-in using a database trigger on `auth.users`
- Remove redundant `user_id` column from `profiles` (use `id` only)
- Enable RLS on `profiles` and restrict access to only the user's own profile (using `id`)
- Passwords are securely hashed and stored in `auth.users` (never accessible in plaintext)
- Password setup/change UI and backend logic with logging and trace IDs for all events
- Logging for all password setup/change attempts, successes, and failures (frontend and backend)

### Implementation Notes
- Used Next.js App Router with Supabase Auth Helpers
- Created auth middleware for route protection
- Implemented automatic profile creation on first sign-in using a database trigger on `auth.users`
- Removed `user_id` column from `profiles` and updated all logic to use `id`
- Added RLS policies to restrict access to only the user's own profile (using `id`)
- Passwords are securely hashed and stored in `auth.users` (never accessible in plaintext)
- Password setup/change UI and backend logic with logging and trace IDs for all events
- Logging for all password setup/change attempts, successes, and failures (frontend and backend)
- All known authentication and profile creation issues have been resolved as of the latest update
- Previous issues with missing profile rows, RLS, and password setup are fixed
- All flows (signup, password setup/change, profile access) tested and confirmed working as of latest update

### Testing Strategy
- Test OAuth flows with Google and GitHub
- Verify email magic link authentication (both PKCE and hash-based)
- Check session persistence across browser restarts
- Validate redirection to protected routes
- Verify profile creation and data retrieval (trigger-based)
- Confirm no error toasts are shown on successful sign-in
- Test sign-out and ensure session/cookies are cleared
- Test password setup/change and verify logging
- Test RLS policies to ensure users can only access their own profile

### Next Steps
- Monitor for edge-case auth/profile issues
- Continue to improve error messaging, logging, and UX
- Continue documenting each feature and update this file as the project progresses

## Feature #2: Text Chat UI
**Status**: Planning
**Dependencies**: Feature #1
**Owner**: TBD

### Requirements
- Text input + response stream
- Adapt Macaly chat component
- Connect to /api/chat endpoint

### Implementation Notes
- TBD

### Testing Strategy
- TBD

## Feature #3: Core-Therapist Agent
**Status**: Planning
**Dependencies**: Feature #2
**Owner**: TBD

### Requirements
- Primary LLM agent with warm, supportive system prompt ("Luma")
- Generate TypeScript agent file
- Integrate streamText

### Implementation Notes
- TBD

### Testing Strategy
- TBD

## Feature #4: Memory Service
**Status**: Planning
**Dependencies**: Feature #3
**Owner**: TBD

### Requirements
- Messages & embeddings tables
- Top-k retrieval via pgvector
- Create SQL migrations
- Implement cosine search

### Implementation Notes
- TBD

### Testing Strategy
- TBD

## Feature #5: Safety-Sentinel Agent
**Status**: Planning
**Dependencies**: Feature #3, Feature #4
**Owner**: TBD

### Requirements
- Regex & model-based detection of self-harm risks
- Can interrupt stream
- Add new Orchestra state
- Create FastAPI /safety endpoint

### Implementation Notes
- TBD

### Testing Strategy
- TBD

## UI Migration & Project Setup (Roadmap #0)

**Status**: Complete
**Dependencies**: None
**Owner**: [Unassigned]

### Requirements
- Migrate Macaly UI source code into new luma-therapy project structure
- Fix all import paths and configuration issues
- Ensure the UI builds and runs successfully

### Implementation Notes
- All UI files moved to luma-therapy/web
- Import paths updated for new structure
- Next.js config cleaned up for v15 compatibility

### Testing Strategy
- Run `npm run dev` and verify UI loads at the correct port
- Check for and resolve all build/runtime errors

---

## Auth gateway (Roadmap #1)

**Status**: In Progress
**Dependencies**: UI Migration & Project Setup
**Owner**: [Unassigned]

### Requirements
- Google & GitHub OAuth via Supabase SSR helpers
- Scaffold @supabase/auth-helpers pages
- Implement callback route

### Implementation Notes
- Use Supabase OAuth for authentication
- Integrate with Next.js App Router
- Ensure SSR compatibility and secure session handling
- **Current Issues**:
  - Email magic link authentication fails with "No authorization code provided" error
  - Port mismatch between URLs (3000 vs 3004) causing callback issues
  - Environment variables not consistently loaded across the application

### Testing Strategy
- Test login with Google and GitHub
- Verify session persistence and logout
- Check error handling for failed logins 