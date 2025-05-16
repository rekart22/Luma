# Luma Therapy Chat - Project Blueprint

## Overview
Luma is a therapeutic chat application designed to provide supportive conversations through a multi-agent AI system. The MVP will focus on text-based interaction, with voice capabilities reserved for future iterations.

## System Architecture

```
 ┌──────────────────────────────────────────────────────────────────┐
 │                   Client (web / mobile PWA)                      │
 │      React UI (Vibe-coded, Macaly source) • Text Chat • SSE      │
 └─────────▲───────────────────────┬───────────────────────────────┘
           │                       │ streamText()
           │                       │
           │               Edge Function (Next.js on Vercel)
           │               ─ handles auth cookie, rate limits ──────
           │                       │
   OAuth   │   REST/RPC            ▼                                   
  (Google/ ▼ )         ┌────────────────────────────┐  function-call
 GitHub)  └──────────► │  AI-Orchestra (TypeScript) │ ─────────────┐
                       │  • state-machine agents    │              │
                       │  • openAI stream           │              │
                       └─────────┬──────────────────┘              │
                                 │ RPC: /profile /embed /analyse   │
                                 ▼                                 ▼
                    ┌───────────────────────┐        ┌────────────────────┐
                    │   FastAPI micro-svc   │        │  OpenAI (chat)     │
                    │  • create embeddings  │        └────────────────────┘
                    │  • personality logic  │
                    └────────▲──────────────┘
                             │ SQL / Vector
                             ▼
                     Supabase Postgres (+pgvector)
                     • users / auth
                     • messages (vectors)
                     • persona_scores (JSONB)
                     • future test_questions & results
```

## Tech Stack

| Layer | Tech | Rationale |
|-------|------|-----------|
| Frontend | Next.js 15 on Vercel Edge | Instant global deployments, built-in streaming capability |
| Agent orchestration | AI-Orchestra (TypeScript) | Lightweight FSM for streamText, simpler than LangGraph for our 3-agent system |
| Database | Supabase (Postgres + pgvector) | SQL for structured traits, vector search for chat memory |
| Auth | Supabase OAuth (Google, GitHub) | Secure, SSR-ready, SOC 2 compliant |
| Back-end API | FastAPI service | Python ecosystem for embeddings & ML tooling |
| LLM | OpenAI GPT-4o | Low-latency responses; prompt-prefix caching to lower costs |
| IDE & UI scaffolding | Macaly vibe-code template | Reuse existing React codebase with style customizations |
| DevTool | Cursor AI editor | Rapid code generation & inline refactors for each milestone |

## MVP Feature Roadmap

| # | Feature | Description | Implementation |
|---|---------|-------------|----------------|
| 1 | Auth gateway | Google & GitHub OAuth via Supabase SSR helpers | Scaffold @supabase/auth-helpers pages; implement callback route |
| 2 | Text chat UI | Text input + response stream; adapt Macaly chat component | Modify Macaly UI, connect to /api/chat endpoint |
| 3 | Core-Therapist agent | Primary LLM agent with warm, supportive system prompt ("Luma") | Generate TypeScript agent file; integrate streamText |
| 4 | Memory service | Messages & embeddings tables; top-k retrieval via pgvector | Create SQL migrations; implement cosine search |
| 5 | Safety-Sentinel agent | Regex & model-based detection of self-harm risks; can interrupt stream | Add new Orchestra state + FastAPI /safety endpoint |
| 6 | Profile loader | Fetch static persona JSONB for each session | Implement getProfile tool; verify prompt-cache effectiveness |
| 7 | Session summary agent | After 10 conversation turns, summarize & store to summaries table | Develop summarizer state; implement embedding write |
| 8 | Admin dashboard | Protected view listing users, sessions, risk flags | Create dashboard route using Next.js App Router; utilize RLS in Supabase |
| 9 | Test infrastructure | Create tables for big5_questions, via_questions, test_results | Establish FK relations; create FastAPI stubs for future scoring |
| 10 | Performance optimization | Enable prompt-prefix caching; implement per-user rate limiting | Configure Vercel Edge; monitor and optimize token usage |

## Security Considerations

- Implement Supabase OAuth with SSO only (disable email-password authentication)
- Enable Row-Level Security so users can only access their own data
- Store embeddings in a separate schema with encryption-at-rest
- Configure pgvector performance tuning following Azure guidance
- Rate-limit /api/chat with Edge middleware (IP + user-id bucket)
- Maintain comprehensive audit logs of all LLM interactions

## Future Enhancements

- Voice input/output integration
- Advanced psychometric testing
- Expanded therapeutic modalities
- Mobile app with offline capabilities
- Additional authentication providers
- Enhanced analytics dashboard

## Development Approach

Cursor's inline GPT will be used to generate boilerplate code for each feature, allowing the development team to focus on Luma's therapeutic tone and clinical logic. The system is designed with extensibility in mind, particularly for future psychometric testing capabilities through the pre-established test_results table and FastAPI /score routes.

## Cost Optimization

- OpenAI prompt-prefix caching to reduce token costs for static persona information
- Efficient embedding storage and retrieval
- Strategic rate limiting to prevent abuse
- Optimized context window management