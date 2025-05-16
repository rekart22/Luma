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

### Implementation Notes
- Used Next.js App Router with Supabase Auth Helpers
- Created auth middleware for route protection
- Implemented automatic profile creation on first sign-in
- Added Row Level Security to database tables
- Session duration: 24 hours (default) or 30 days (remember me)

### Testing Strategy
- Test OAuth flows with Google and GitHub
- Verify email magic link authentication
- Check session persistence across browser restarts
- Validate redirection to protected routes
- Verify profile creation and data retrieval

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

**Status**: Planning
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

### Testing Strategy
- Test login with Google and GitHub
- Verify session persistence and logout
- Check error handling for failed logins

--- 