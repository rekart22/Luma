# Luma Therapy Chat - Enhanced Project Blueprint

## Overview
\n## Project Structure

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

Luma is a supportive chat application designed to provide meaningful conversations through a multi-agent AI system. The MVP will focus on text-based interaction, with voice capabilities reserved for future iterations. The system features enhanced memory management through mem0 integration for improved personalization and contextual understanding. Luma is positioned as a companion for personal development, not just a therapeutic tool.

## System Architecture

```
 ┌──────────────────────────────────────────────────────────────────┐
 │                   Client (web / mobile PWA)                      │
 │      React UI (Vibe-coded, Macaly source) • Text Chat           │
 └─────────▲───────────────────────┬───────────────────────────────┘
           │                       │ WebSocket (agent coordination)
           │                       │ SSE (AI responses)
           │               Edge Function (Next.js on Vercel)
           │               ─ handles auth cookie, rate limits ──────
           │                       │
   OAuth   │   WebSocket          ▼
  (Google/ ▼ )         ┌────────────────────────────┐
 GitHub)  └──────────► │    AI-Orchestra (TypeScript)│
                       │  • Agent coordination       │
                       │  • State machines           │
                       │  • Conversation flow        │
                       │  • Memory orchestration     │
                       └─────────┬──────────────────┘
                                │
                                │ REST/WebSocket
                                ▼
                    ┌───────────────────────┐
                    │    FastAPI (Python)   │◄─────────┐
                    │  • OpenAI integration │          │
                    │  • Memory operations  │          │
                    │  • Token management   │          │
                    └────────▲─────┬────────┘          │
                             │     │                   │
                             │     │                   │
                             │     │                   │
                    SQL/Vector│     ▼            OpenAI Calls
                             │  ┌──────────────┐       │
                             │  │    mem0     │       │
                             │  │ • memory ops│       │
                             │  └──────┬──────┘       │
                             │         │              │
                             ▼         ▼              ▼
                     Supabase Postgres    ┌────────────────┐
                     (+pgvector)          │    OpenAI      │
                     • users / auth       │  • Chat GPT-4  │
                     • messages           │  • Embeddings  │
                     • persona_scores     └────────────────┘
                     • conversations
                     • goals & progress
                     • journal_entries
                     • test_questions
```

### Architecture Components

1. **AI-Orchestra (TypeScript)**
   - Central coordinator for all system operations
   - Manages state machines for all agents (Core-Therapist, Safety-Sentinel, Session-Summary)
   - Controls conversation flow and agent transitions
   - Orchestrates calls to FastAPI for AI and memory operations
   - Maintains conversation context and agent states
   - Makes decisions about when to call which service
   - Handles WebSocket connections with frontend

2. **FastAPI Service (Python)**
   - Executes AI operations through OpenAI
   - Implements memory operations via mem0
   - Handles token management and rate limiting
   - Processes embeddings and vector operations
   - Provides RESTful and WebSocket endpoints for AI-Orchestra
   - Manages API keys and security

3. **Next.js Frontend**
   - Implements real-time chat UI
   - Manages WebSocket connection to AI-Orchestra
   - Handles user authentication
   - Provides responsive interface

### Communication Protocols

1. **Server-Sent Events (SSE)**
   - Primary protocol for AI response streaming
   - Efficient handling of OpenAI token stream
   - One-way communication optimized for text delivery
   - Lower overhead compared to WebSocket for streaming
   - Automatic reconnection and HTTP/2 support

2. **WebSocket**
   - Used for real-time agent orchestration
   - Bi-directional communication for state management
   - Low-latency agent coordination
   - Status updates and control signals
   - Connection management with heartbeat

3. **Hybrid Approach Benefits**
   - Optimized resource usage
   - Clear separation of concerns
   - Better error handling and recovery
   - Proven pattern in production systems
   - Scalable architecture

### Key Architecture Decisions

1. **AI-Orchestra as Central Coordinator**
   - Acts as the "brain" of the system
   - Makes decisions about agent transitions
   - Coordinates all service calls
   - Maintains system state and conversation flow
   - Delegates heavy lifting to specialized services

2. **Python for AI Operations**
   - Leverages OpenAI's official Python SDK
   - Better memory management capabilities
   - Superior token handling and embeddings
   - Robust ML/AI ecosystem support
   - Enhanced security for API keys

3. **Communication Flow**
   - Frontend ←→ AI-Orchestra: WebSocket for real-time chat
   - AI-Orchestra ←→ FastAPI: REST/WebSocket for AI operations
   - FastAPI ←→ OpenAI: SDK calls for AI operations
   - FastAPI ←→ mem0: Direct integration for memory operations

4. **Hybrid Language Approach**
   - TypeScript (AI-Orchestra): Coordination and state management
   - Python (FastAPI): AI and memory operations
   - Next.js: Modern UI development
   - Clear separation of concerns

## Tech Stack

| Layer | Tech | Rationale |
|-------|------|-----------|
| Frontend | Next.js 15 on Vercel Edge | Instant global deployments, built-in streaming capability, Edge Runtime compatibility |
| Logging | Edge-compatible Logger | Lightweight, structured logging for Edge Functions without Node.js dependencies |
| Agent orchestration | AI-Orchestra (TypeScript) | Lightweight FSM for streamText, simpler than LangGraph for our 3-agent system |
| Database | Supabase (Postgres + pgvector) | SQL for structured traits, vector search for chat memory |
| Memory Management | mem0 | Hierarchical memory organization, improved context awareness, memory operations |
| Auth | Supabase OAuth (Google, GitHub) | Secure, SSR-ready, Edge-compatible, SOC 2 compliant |
| Back-end API | FastAPI service | Python ecosystem for embeddings & ML tooling |
| LLM | OpenAI GPT-4o | Low-latency responses; prompt-prefix caching to lower costs |
| IDE & UI scaffolding | Macaly vibe-code template | Reuse existing React codebase with style customizations |
| DevTool | Cursor AI editor | Rapid code generation & inline refactors for each milestone |

### Edge Runtime Considerations (Added 20 May 2025)

1. **Logging Strategy**
   - Custom Edge-compatible logger implementation
   - No dependency on Node.js-specific modules
   - Structured JSON logging with metadata
   - Trace ID support for request tracking

2. **Cookie Handling**
   - Async cookie operations for Edge compatibility
   - Proper error handling and fallbacks
   - Session management optimized for Edge

3. **Dependencies**
   - Careful selection of Edge-compatible packages
   - Removal of Node.js-specific dependencies
   - Lightweight alternatives for common utilities

## Enhanced MVP Feature Roadmap

| # | Feature | Description | Implementation |
|---|---------|-------------|----------------|
| 1 | Auth gateway | Google & GitHub OAuth via Supabase SSR helpers | Scaffold @supabase/auth-helpers pages; implement callback route |
| 2 | Text chat UI | Text input + response stream; adapt Macaly chat component | Modify Macaly UI, connect to /api/chat endpoint |
| 3 | Core-Therapist agent | Primary LLM agent with warm, supportive system prompt ("Luma") | Generate TypeScript agent file; integrate streamText |
| 4 | Memory service | Setup mem0 for hierarchical memory & Supabase for persistent storage | Configure mem0 client; implement memory operations API |
| 5 | Safety-Sentinel agent | Regex & model-based detection of self-harm risks; can interrupt stream | Add new Orchestra state + FastAPI /safety endpoint |
| 6 | Profile loader | Fetch user profile with consolidated memory insights | Implement getProfile tool with mem0 context retrieval |
| 7 | Session summary agent | After 10 conversation turns, summarize & store to mem0 memory | Develop summarizer state; implement memory consolidation |
| 8 | Admin dashboard | Protected view listing users, sessions, risk flags | Create dashboard route using Next.js App Router; utilize RLS in Supabase |
| 9 | Test infrastructure | Create tables for big5_questions, via_questions, test_results | Establish FK relations; create FastAPI stubs for future scoring |
| 10 | Performance optimization | Enable prompt-prefix caching; implement per-user rate limiting | Configure Vercel Edge; monitor and optimize token usage |
| 11 | Conversation history sidebar | Displays past conversations with AI-generated titles | Create conversation_history table; implement sidebar component with pagination |
| 12 | Conversation title generator | Auto-name chats based on intent/topic | Add post-session title generation function using conversation summary |
| 13 | Conversation management | Edit titles, delete conversations | Implement CRUD operations with proper auth checks |
| 14 | Memory deletion controls | Allow users to request memory wipes with confirmation | Create memory deletion API with safeguards and confirmation flow |
| 15 | Enhanced data protection | Advanced encryption and access controls | Implement field-level encryption, audit logging, and access restrictions |
| 16 | Personal development focus | Reposition as growth companion beyond therapy | Update system prompts, UI language, and marketing materials |
| 17 | Goal setting & tracking | Create and monitor personal growth objectives | Build goal schema, tracking UI, and integration with conversation context |
| 18 | Progress visualization | Charts and insights on personal growth journey | Implement data visualization components and progress calculations |
| 19 | Reflective journaling | Journal entries with AI-guided prompts and insights | Create journal schema, entry interface, and retrospective analysis |

## mem0 Integration Architecture

The mem0 system enhances our application with sophisticated memory management capabilities:

### 1. Memory Hierarchy

```
mem0 Memory Structure
├── Episodic Memory
│   ├── Session Records
│   │   └── Chronological conversation events with timestamps
│   └── Emotional Responses
│       └── Tracked emotional shifts during conversations
├── Semantic Memory
│   ├── User Profiles
│   │   └── Consolidated user traits, preferences, behavioral patterns
│   ├── Development Insights
│   │   └── Recurring themes, progress markers, potential concerns
│   ├── Goals & Progress
│   │   └── Current objectives, milestones, and achievements
│   └── Domain Knowledge
│       └── Personal development techniques, references, frameworks
└── Procedural Memory
    ├── Conversation Strategies
    │   └── Effective approaches for this specific user
    ├── Growth Patterns
    │   └── Successful development techniques with measurable outcomes
    └── Journal Analysis
        └── Patterns and insights derived from reflective journaling
```

### 2. Memory Operations

- **Encoding**: Convert conversation segments into structured memories with metadata
- **Retrieval**: Context-aware fetching based on current conversation relevance
- **Consolidation**: Periodic summarization of episodic memories into semantic insights
- **Decay**: Prioritization of memories based on recency, emotional significance, and relevance
- **Deletion**: Controlled removal of memory segments upon user request

### 3. Integration Points

- **FastAPI Service**: Dedicated memory operations endpoints to handle mem0 interactions
- **AI-Orchestra**: Memory context injected into agent prompts via streamText pipeline
- **Supabase**: Synchronization for persistent backup and multi-instance consistency
- **Session Summary Agent**: Prioritized for memory consolidation operations
- **Memory Deletion Service**: Handles user requests for memory wiping with safeguards

### 4. Memory-Enhanced Features

- **Personalized Responses**: Luma agent accesses consolidated memory insights
- **Contextual Continuity**: Conversations maintain coherence across multiple sessions
- **Progressive Adaptation**: Response strategies evolve based on procedural memory
- **Safety Pattern Recognition**: Safety-Sentinel benefits from historical risk indicators
- **Goal Integration**: Memory incorporates progress toward personal development goals
- **Journal Integration**: Reflective entries enhance memory context and personalization

## User Data Protection Framework

### Multi-layered Security Approach

1. **Authentication & Authorization**
   - Strong OAuth implementation with multi-factor authentication
   - Row-Level Security (RLS) in Supabase for granular access control
   - Session token rotation and automatic expiration

2. **Data Encryption**
   - Field-level encryption for sensitive user data
   - End-to-end encryption for conversation content
   - Encrypted data backups with separate key management

3. **Access Controls**
   - Principle of least privilege for all system components
   - Access logging and real-time monitoring
   - Automated alerts for suspicious access patterns

4. **Privacy Features**
   - Transparent memory deletion process
   - Data minimization practices
   - User-controlled data retention policies

5. **Compliance Measures**
   - GDPR-compliant data handling
   - Regular security audits
   - Privacy impact assessments

## Conversation History & Management

### Conversation History Sidebar
- Persistent sidebar displaying past conversations
- Pagination for efficient loading of conversation history
- Search functionality to locate specific conversations

### Auto-naming System
- AI-generated conversation titles based on:
  - Primary topic/intent detection
  - Key themes and focus areas
  - Significant insights or breakthroughs
- Implementation through post-conversation summary analysis

### User Controls
- Rename conversation functionality
- Delete conversation with confirmation
- Filter conversations by date, topic, or relevance
- Conversation export capability for user records

## Memory Deletion Process

### User-Initiated Memory Deletion
1. User requests memory deletion via dedicated UI option
2. Luma explains implications:
   - Loss of personalization
   - Reset of conversation context
   - Impact on goal tracking and progress
3. Multi-step confirmation process:
   - Initial confirmation dialog
   - Cool-down period option
   - Final verification
4. Graceful memory reset:
   - Selective memory wiping based on user preferences
   - Option for complete or partial memory deletion
   - Immediate verification of deletion completion

## Personal Development Focus

### Repositioning Strategy
- Updated language and terminology throughout the application
- Emphasis on growth, learning, and self-improvement
- Shift from therapeutic model to coaching/companion paradigm

### Goal Setting Framework
- Structured goal creation process:
  - SMART goal methodology integration
  - Template-based goal setting
  - Milestone definition
- Goal categorization (career, relationships, wellness, etc.)
- Integration with conversation context

### Progress Tracking
- Visual progress indicators
- Regular progress check-ins
- Achievement celebration moments
- Obstacle identification and strategy adjustment

### Reflective Journaling
- AI-guided journal prompts
- Mood and energy tracking
- Pattern recognition across entries
- Integration with goals and conversations
- Retrospective analysis and insights

## Development Approach

Cursor's inline GPT will be used to generate boilerplate code for each feature, allowing the development team to focus on Luma's supportive tone and personal development logic. The system is designed with extensibility in mind, particularly for future psychometric testing capabilities through the pre-established test_results table and FastAPI /score routes.

The integration of mem0 will require a phased approach:

1. **Phase 1**: Basic memory storage and retrieval operations
2. **Phase 2**: Memory consolidation and hierarchical organization
3. **Phase 3**: Advanced memory operations (decay, reinforcement, context-aware retrieval, user-controlled deletion)

## Cost Optimization

- OpenAI prompt-prefix caching to reduce token costs for static persona information
- Efficient embedding storage and retrieval
- Strategic rate limiting to prevent abuse
- Optimized context window management
- Memory-based prompt enrichment instead of raw conversation inclusion
- Tiered memory access (frequent access to recent memories, selective access to older ones)
- Batch processing for memory consolidation operations during low-traffic periods


# Colors
Blush & Clay
Mood: Feminine warmth, comfort, earthiness
Very grounded but nurturing.

Background: #FFFAF9 – warm blush white

Primary accent: #E9BBAE – muted peach clay

Secondary accent: #CFA18D – terracotta skin tone

Highlight: #FCE6DF – soft coral glow

Typography: #3F3F3F – warm gray-brown