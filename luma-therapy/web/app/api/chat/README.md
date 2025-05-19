# Chat API Implementation

This directory contains the Next.js API routes that handle chat functionality for the Luma Therapy Chat application.

## Architecture

```
Client (Next.js) → API Routes → FastAPI → OpenAI API
```

The implementation follows a hybrid communication approach:
- **Server-Sent Events (SSE)** for streaming AI responses
- **REST API** for regular chat completions

## API Routes

1. `/api/chat/route.ts` - Main chat endpoint that handles:
   - Authentication via Supabase
   - Message validation
   - Passing user messages to the FastAPI backend
   - Returning AI responses

2. `/api/chat/stream/route.ts` - Streaming chat endpoint that:
   - Establishes a SSE connection
   - Streams tokens from OpenAI (via FastAPI)
   - Handles proper error management

## Integration Points

### Frontend Integration
- `ChatContainer.tsx` uses the streaming API to display real-time responses
- Messages are securely sent with user authentication
- Proper error handling with fallback error messages

### Backend Integration
- FastAPI endpoints handle the connection to OpenAI
- Reads `OPENAI_API_KEY` from the root `.env` file
- Uses GPT-4.1.mini (approximated with gpt-4-1106-preview)
- Handles both streaming and non-streaming responses

## System Prompt

The system prompt defines Luma as an emotionally intelligent AI therapist that:
- Builds deep, trusting relationships
- Proactively leads conversations
- Uses open-ended questions and reflections
- Maintains a calm, safe, and intuitive tone
- Avoids clinical language
- Focuses on growth, autonomy, and self-awareness

## Security Considerations

- Authentication with Supabase ensures only logged-in users can access the chat
- User context is maintained in the conversation
- API keys are securely stored in environment variables
- Error messages don't expose sensitive information

## Error Handling

- Network errors show a friendly error message
- API errors are properly caught and displayed
- Streaming errors are handled gracefully

## Future Improvements

- Add conversation history storage
- Implement memory operations with mem0
- Add Safety-Sentinel agent integration
- Implement session summaries 