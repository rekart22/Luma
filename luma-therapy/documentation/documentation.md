# Luma Therapy Project Documentation

## Project Structure

```
luma-therapy/                # Root project directory
├── node_modules/           # Project-wide Node.js dependencies
├── web/                    # Next.js frontend (UI files migrated here)
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Web-specific dependencies
├── ai-orchestra/           # TypeScript agent system
│   ├── agents/            # Agent definitions
│   └── states/            # State machine logic
├── api/                    # FastAPI service
│   ├── routers/           # API endpoints
│   └── services/          # Business logic
├── db/                     # Database migrations
│   └── supabase/          # Supabase schema definitions
├── documentation/          # Project documentation
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Root project dependencies
└── package-lock.json      # Dependency lock file
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

## Password Change Security (Update 19 May 2025)

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

## Security Improvements (19 May 2025)

### Critical Security Fixes
1. **CORS Configuration**
   - Removed wildcard (*) CORS configuration
   - Implemented strict origin checking
   - Added environment variable `ALLOWED_ORIGINS` for configurable origins
   - Separate CORS policies for development and production

2. **Debug Logging**
   - Implemented structured logging with Winston (TypeScript) and Loguru (Python)
   - Removed sensitive information from logs
   - Added log redaction for PII and sensitive data
   - Implemented proper log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)

3. **Authentication URLs**
   - Removed hardcoded localhost URLs
   - Implemented dynamic URL configuration based on environment
   - Added environment variables for auth endpoints
   - Proper URL handling in development and production

### High Priority Security Fixes
1. **Rate Limiting**
   - Implemented rate limiting for all authentication endpoints
   - Added exponential backoff for failed attempts
   - Configured per-IP and per-user rate limits
   - Added monitoring for rate limit violations

2. **SQL Injection Prevention**
   - Implemented parameterized queries in all database functions
   - Added input validation and sanitization
   - Updated database migrations to use proper parameter binding
   - Regular security scanning for SQL injection vulnerabilities

3. **Password Security**
   - Enhanced password storage with proper hashing
   - Implemented secure password change verification
   - Added comprehensive password change auditing
   - Enforced strong password policies

4. **Content Security Policy**
   - Added CSP headers
   - Configured strict CSP rules
   - Implemented nonce-based CSP for inline scripts
   - Regular CSP reporting and monitoring

## Common Issues and Solutions

### Signout Flow Issues
**Problem**: Next.js cookie handling during signout causing "nextCookies.get is not a function" error

**Solution**:
1. Implemented proper async/await handling for cookie operations
2. Added systematic cookie cleanup:
   ```typescript
   // Clear all Supabase-related cookies
   cookies.delete('sb-access-token')
   cookies.delete('sb-refresh-token')
   // Additional cookie cleanup...
   ```
3. Enhanced error handling and logging during signout
4. Added proper redirection after successful signout

**Key Learnings**:
- Cookie operations in Next.js route handlers must be handled asynchronously
- All auth-related cookies must be systematically cleared
- Proper error handling is crucial for auth operations
- Logging helps track auth flow issues 

## OpenAI Integration Architecture (19 May 2025)

### Architecture Overview
```
Client (Next.js) -> AI-Orchestra -> FastAPI -> OpenAI
                        ↓             ↓
                    State Mgmt     mem0
```

### Component Responsibilities

1. **AI-Orchestra (TypeScript)**
   - Acts as the central coordinator for all system operations
   - Manages state machines for all agents (Core-Therapist, Safety-Sentinel, Session-Summary)
   - Controls conversation flow and agent transitions
   - Orchestrates calls to FastAPI for AI and memory operations
   - Maintains conversation context and agent states
   - Makes decisions about when to call which service
   - Handles WebSocket connections with frontend

2. **FastAPI (Python)**
   - Executes AI operations through OpenAI
   - Implements memory operations via mem0
   - Handles token management and rate limiting
   - Processes embeddings and vector operations
   - Provides RESTful and WebSocket endpoints for AI-Orchestra
   - Manages API keys and security

3. **Next.js (Frontend)**
   - Manages UI state and real-time updates
   - Maintains WebSocket connection to AI-Orchestra
   - Handles user session
   - Provides chat interface

### Architecture Decision Rationale

1. **AI-Orchestra as Central Coordinator**
   - Acts as the "brain" of the system
   - Makes decisions about agent transitions
   - Coordinates all service calls
   - Maintains system state and conversation flow
   - Delegates heavy lifting to specialized services

2. **Why Python for OpenAI Integration**
   - First-class support from OpenAI's Python SDK
   - Superior memory management with mem0
   - Better token counting and context management
   - Robust ML/AI ecosystem for future extensions
   - More secure API key management
   - Native async support with AsyncOpenAI

3. **Communication Flow**
   - Frontend ←→ AI-Orchestra: WebSocket for real-time chat
   - AI-Orchestra ←→ FastAPI: REST/WebSocket for AI operations
   - FastAPI ←→ OpenAI: SDK calls for AI operations
   - FastAPI ←→ mem0: Direct integration for memory operations

### Implementation Notes

1. **AI-Orchestra Implementation**
   - State machine definitions for each agent
   - WebSocket server for frontend communication
   - Service client for FastAPI communication
   - Conversation context management
   - Agent coordination logic

2. **FastAPI Implementation**
   - OpenAI service integration
   - Memory service integration
   - WebSocket and REST endpoints
   - Token management
   - Security middleware

3. **Communication Protocol**
   - WebSocket for real-time bidirectional communication
   - REST endpoints for specific operations
   - State synchronization between services
   - Error handling and retry logic

### Communication Strategy (19 May 2025)

The system implements a hybrid approach using both Server-Sent Events (SSE) and WebSocket, each optimized for specific use cases:

1. **Server-Sent Events (SSE)**
   - Used for AI response streaming
   - Handles the "token firehose" from OpenAI
   - One-directional, efficient text streaming
   - Lower overhead for high-bandwidth text transfer
   - Native HTTP/2 support and automatic reconnection
   - Example use cases:
     ```typescript
     // AI response streaming
     async function streamAIResponse(message: string) {
       const response = await fetch('/api/chat/stream', {
         method: 'POST',
         headers: { 'Accept': 'text/event-stream' },
         body: JSON.stringify({ message })
       });
       // Handle streaming response...
     }
     ```

2. **WebSocket**
   - Used for agent orchestration and state management
   - Bi-directional communication for agent coordination
   - Low-latency state updates and transitions
   - Real-time agent status and control signals
   - Example use cases:
     ```typescript
     // Agent state updates
     interface AgentStateUpdate {
       agentId: string;
       state: 'thinking' | 'responding' | 'analyzing';
       context: Record<string, unknown>;
     }
     ```

3. **Rationale for Hybrid Approach**
   - SSE optimizes high-bandwidth, one-way text streaming
   - WebSocket enables real-time agent coordination
   - Reduced server resource usage
   - Better error handling and recovery
   - Proven pattern (used by production-grade agents)
   - Clear separation of concerns

4. **Implementation Strategy**
   - SSE endpoints in FastAPI for AI responses
   - WebSocket connections for AI-Orchestra coordination
   - Clear protocol boundaries and error handling
   - Automatic reconnection and fallback mechanisms

### Deployment Considerations

1. **Service Organization**
   ```
   /luma-therapy
     /web                 # Next.js frontend
     /ai-orchestra        # Agent coordination
     /api                 # FastAPI service
     /db                  # Database migrations
   ```

2. **Environment Setup**
   - Separate environment variables for each service
   - Clear documentation of all required configurations
   - Development and production environment parity

3. **Monitoring Strategy**
   - Service health checks
   - WebSocket connection monitoring
   - Memory usage tracking
   - Agent state logging

4. **Scaling Considerations**
   - Horizontal scaling of FastAPI service
   - WebSocket connection management
   - Memory operation optimization
   - State synchronization at scale 

## Cookie Management & Auth Updates (19 May 2025)

### Recent Improvements
1. **Cookie Handling Architecture**
   - Implemented proper async cookie handling for Next.js 15
   - Created dedicated Supabase client utilities:
     ```typescript
     /web/lib/supabase/server.ts    // Server-side client
     /web/lib/auth-helpers.ts       // Auth helper functions
     /web/middleware.ts             // Auth middleware
     ```
   - Simplified cookie management using createRouteHandlerClient
   - Enhanced error logging and tracing

2. **Authentication Flow**
   - Streamlined auth middleware implementation
   - Improved session refresh handling
   - Better error propagation and logging
   - Protected route handling with proper redirects

3. **Known Issues**
   - Cookie warning in /api/chat/stream route:
     ```
     Error: Route "/api/chat/stream" used cookies().get(...). 
     cookies() should be awaited before using its value.
     ```
   - This warning appears but doesn't affect functionality
   - Chat streaming works despite the warning

### Next Steps
1. **High Priority**
   - Resolve async cookie warning in chat stream route
   - Implement proper cookie awaiting in stream handler
   - Add error boundary for chat stream failures

2. **Medium Priority**
   - Enhance logging for chat stream errors
   - Add retry logic for stream failures
   - Improve error messaging for users

3. **Low Priority**
   - Document all cookie-related configurations
   - Add monitoring for auth flow success rates
   - Create troubleshooting guide for common issues 