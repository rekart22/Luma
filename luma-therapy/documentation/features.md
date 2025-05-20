# Luma Therapy Chat - Feature Roadmap

## Security Update: Password Change Flow (June 2025)

- Password changes now require the current password to be verified before allowing updates.
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

## Auth Gateway (Feature #1)
**Status**: Complete
**Dependencies**: None
**Owner**: Dev Team

### Recent Updates (20 May 2025)
- Implemented Edge-compatible cookie handling for Next.js 15
- Created custom Edge-compatible logger
- Resolved cookie warning in chat stream route
- Enhanced error handling and tracing

### Previously Known Issues (RESOLVED)
1. Cookie warning in chat stream route:
   ```
   Error: Route "/api/chat/stream" used cookies().get(...). 
   cookies() should be awaited before using its value.
   ```
   **Resolution**:
   - Implemented async cookie handling
   - Replaced Winston logger with Edge-compatible solution
   - Removed Node.js-specific dependencies
   - Added proper error handling and tracing
   - Chat streaming now works without warnings

### Requirements
- ✅ Implement Google & GitHub OAuth via Supabase SSR helpers
- ✅ Create authentication sign-in page
- ✅ Implement protected routes
- ✅ Add "Remember me" functionality
- ✅ Handle session expiration and refresh
- ✅ Support both PKCE and hash-based magic link flows
- ✅ Robust error handling for all auth flows
- ✅ Redirect to /chat-app after successful sign-in
- ✅ Edge Runtime compatibility
- ✅ Proper async cookie handling
- ✅ Edge-compatible logging solution

### Implementation Notes
- Used Next.js App Router with Supabase Auth Helpers
- Created auth middleware for route protection
- Implemented Edge-compatible cookie handling:
  ```typescript
  // Example of proper cookie handling in Edge Runtime
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ 
    cookies: () => cookieStore 
  });
  ```
- Created custom Edge-compatible logger:
  ```typescript
  // Example of Edge-compatible logging
  class EdgeLogger {
    static log(level: string, message: string, metadata = {}) {
      const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...metadata
      };
      console.log(JSON.stringify(entry));
    }
  }
  ```

### Testing Strategy
- ✅ Test OAuth flows with Google and GitHub
- ✅ Verify email magic link authentication
- ✅ Check session persistence
- ✅ Validate redirection to protected routes
- ✅ Test Edge Runtime compatibility
- ✅ Verify async cookie handling
- ✅ Test logging functionality
- ✅ Validate error handling

### Next Steps
1. **Monitoring**
   - Implement comprehensive logging analytics
   - Set up error tracking and alerting
   - Monitor Edge Function performance

2. **Improvements**
   - Add more detailed error messages
   - Enhance logging metadata
   - Implement performance tracking

## Text Chat UI (Feature #2)
**Status**: Partially Complete
**Dependencies**: Feature #1
**Owner**: Dev Team

### Requirements
- ✅ Text input + response stream
- ✅ Adapt Macaly chat component
- ✅ Connect to /api/chat endpoint
- ⚠️ Resolve cookie warning in stream route
- ⚠️ Add error boundaries and retry logic

### Implementation Notes
- Chat streaming is functional
- Basic UI components implemented
- Cookie warning needs resolution
- Error handling needs improvement

### Testing Strategy
- ✅ Basic chat functionality
- ✅ Message streaming
- ✅ UI component rendering
- ⏳ Error boundary testing
- ⏳ Retry logic testing

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