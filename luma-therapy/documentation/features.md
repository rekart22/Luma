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

### Implementation Notes
- Used Next.js App Router with Supabase Auth Helpers
- Created auth middleware for route protection
- Implemented automatic profile creation on first sign-in
- Added Row Level Security to database tables
- Session duration: 24 hours (default) or 30 days (remember me)
- Magic link authentication now supports both PKCE and hash-based flows
- Error handling improved: if user is signed in, errors are suppressed and user is redirected
- All successful sign-ins (OAuth or magic link) redirect to /chat-app
- Uses createPagesBrowserClient from @supabase/auth-helpers-nextjs for correct PKCE/session handling

### Testing Strategy
- Test OAuth flows with Google and GitHub
- Verify email magic link authentication (both PKCE and hash-based)
- Check session persistence across browser restarts
- Validate redirection to protected routes
- Verify profile creation and data retrieval
- Confirm no error toasts are shown on successful sign-in
- Test sign-out and ensure session/cookies are cleared

### Next Steps
- Monitor for edge-case auth issues
- Continue to improve error messaging and UX

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