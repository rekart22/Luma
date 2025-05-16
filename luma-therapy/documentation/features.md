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