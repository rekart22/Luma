# FastAPI Chat Routers

This directory contains the FastAPI routers responsible for handling chat functionality in the Luma Therapy application.

## Overview

The chat routers connect the frontend to OpenAI services, enabling both traditional and streaming responses.

## Key Features

### Chat Completion Endpoint (`/chat/completion`)

- Handles non-streaming chat requests
- Validates message format 
- Enforces proper role assignment (system, user, assistant)
- Logs request details for debugging and monitoring
- Ensures proper error handling and user feedback

### Chat Streaming Endpoint (`/chat/stream`)

- Implements Server-Sent Events (SSE) for real-time token streaming
- Creates a sustainable streaming connection to the client
- Ensures proper buffering and error handling
- Optimizes for low-latency response delivery
- Follows best practices for streaming architecture

## Integration with OpenAI

- Utilizes the latest OpenAI Python SDK with `AsyncOpenAI`
- Configures appropriate parameters for the therapy context:
  - `temperature`: 0.7 (warm, slightly varied responses)
  - `max_tokens`: 1000 (sufficient for detailed responses)
  - `frequency_penalty`: 0.5 (ensures some variation in responses)
  - `presence_penalty`: 0.5 (encourages topic exploration)

## System Prompt

The system prompt is configured to create a therapeutic persona named Luma with these characteristics:
- Emotionally intelligent and empathetic
- Proactive rather than reactive in conversations
- Focuses on emotional clarity and personal growth
- Speaks with warmth while maintaining professionalism
- Avoids clinical terminology in favor of accessible language

## Security Considerations

- Environment variables are loaded from the root `.env` file
- API keys are never exposed to the client
- Proper error handling prevents leaking sensitive information
- Input validation protects against malicious requests

## Future Improvements

- Add rate limiting to prevent abuse
- Implement memory operations through mem0
- Add Safety-Sentinel integration for content moderation
- Deploy as a containerized service for better scaling 