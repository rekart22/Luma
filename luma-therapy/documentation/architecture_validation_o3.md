# Luma Therapy Architecture Validation (O3)

This document provides a comprehensive analysis of Luma Therapy's architecture, highlighting strengths, potential friction points, and recommendations for improvement.

## 1. Architectural Strengths ✅

| Area | Why it's sound |
|------|----------------|
| **Separation of concerns by language** | TypeScript for orchestration (low-latency, ergonomic on the same runtime as the UI) and Python for LLM/embeddings (best SDK coverage, rich ecosystem). This leverages strengths of both without forcing polyglot devs to work in one monolith. |
| **Hybrid SSE + WebSocket** | Using SSE solely for token streaming keeps back-pressure simple and avoids the "who owns the duplex channel" problem. WebSockets stay focused on orchestration events. This follows established patterns used by companies like Repl.it and Anthropic. |
| **Supabase + pgvector** | Provides transactional guarantees for structured data and a decent ANN index for recall. Operationally simpler than managing separate Pinecone/Weaviate infrastructure. |
| **AI-Orchestra as explicit FSM** | With only three agents, full LangGraph or Temporal overhead isn't necessary. A deterministic state machine in TypeScript is easier to reason about and debug in Chrome dev-tools. |
| **Edge-first Next.js** | Edge functions handle auth cookies and rate limits close to the user, reducing round-trip latency before hitting Node or Python layers. |
| **mem0 for hierarchical memory** | Provides more structure than naive "dump into vector store" approach. For long-lived sessions, mem0's temporal + semantic hierarchy will optimize prompt length reduction. |

## 2. Friction Points & Improvement Areas ⚠️

### 2.1 Two Independent Realtime Transports

**Current Challenge:**
- Two long-lived connections per client (WebSocket + EventSource)
- Mobile networks may throttle (single-HTTP/2 priority issues)

**Recommendation:**
Consider multiplexing the SSE stream inside WebSocket (e.g., GraphQL-WS multipart messages) unless benchmarking proves the split materially faster.

### 2.2 Double Hop Architecture

**Current Flow:**
```
Browser → Vercel Edge → AI-Orchestra (Node) → FastAPI (Python) → OpenAI
```

**Impact:**
- Adds ~30-70ms (cloud-to-cloud) per hop versus single backend
- May affect ultra-low latency goals for voice in v2

**Potential Solutions:**
1. Collapse FastAPI into Node runtime via Python bindings (Pyodide/PyO3)
2. Move orchestration into Python (LangGraph / custom FSM)
3. Let Node focus solely on UI serving

### 2.3 Split Memory Orchestration

**Current Challenge:**
- Orchestrator decides on memory fetching
- FastAPI service performs actual retrieval
- Creates cross-language coupling for edge cases (retry, partial failure)

**Recommendation:**
Push mem0 retrieval logic fully into orchestrator, limiting Python service to "LLM-in, LLM-out" operations.

### 2.4 Compliance & Data Governance

**Required Implementations:**
- Role-based row-level security (Supabase policies)
- Audit logging for safety-sentinel overrides
- E2EE or at-rest encryption for sensitive data (journal_entries, goals)
- SOC-2 compliance maintenance

### 2.5 GPT-4o Cost & Context Management

**Areas to Monitor:**
- Session-summary agent summarization cadence
- mem0 chunking strategy and hierarchical summary freshness
- Prompt-prefix caching effectiveness

### 2.6 Operations & Observability

**Missing Components:**
- OpenTelemetry spans across Node ↔ Python ↔ OpenAI
- Circuit-breakers for OpenAI rate-limit spikes
- Coordinated scaling policies between FastAPI containers and AI-Orchestra

### 2.7 Testing Strategy Gaps

**Recommended Implementation:**
- Playwright for end-to-end chat flows
- pytest-asyncio for orchestration testing
- Contract tests between AI-Orchestra and FastAPI

## 3. Minor Considerations 📝

1. **Directory Structure:**
   - Clarify sub-folder organization in ai-orchestra/agents/
   - Consider separate locations for system tools (retrievers, evaluators)

2. **Code Quality:**
   - Implement conventional linting (ESLint, ruff)
   - Ensure auto-generated code maintains readability

3. **Safety-Sentinel Implementation:**
   - Decide between token-level vs message-post level blocking
   - Consider latency impact of chosen approach

4. **Infrastructure Limits:**
   - Verify Vercel edge compute limits (50ms on hobby tier)
   - Plan for production tier requirements

5. **Voice Feature Preparation:**
   - Plan abstraction layers for future WebRTC/gRPC streams
   - Consider transport code modularity

## 4. Recommended Experiments 🧪

| Prototype | Goal | Key Metrics |
|-----------|------|-------------|
| **Latency Experiment** | Compare WS-only vs WS+SSE split with 100 streamed requests | p95 time-to-first-token |
| **Memory Recall A/B** | Compare mem0 vs plain pgvector top-k | ROUGE on factual recall + token count |
| **Backpressure Testing** | Simulate 500 concurrent chats on staging | WS disconnects & orchestrator CPU |

## Conclusion

The architecture demonstrates sound principles and modern patterns while leveraging managed services effectively. Primary focus areas should be:

1. Optimizing network hops
2. Consolidating memory responsibility
3. Implementing compliance requirements early

This foundation should support scaling to voice-enabled v2 without requiring a complete architectural overhaul.

## Next Steps

1. Conduct recommended experiments
2. Implement observability infrastructure
3. Establish compliance framework
4. Review and optimize transport layer design
5. Set up comprehensive testing infrastructure 