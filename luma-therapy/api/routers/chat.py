from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from loguru import logger
import json
import asyncio
from services.openai_service import OpenAIService

router = APIRouter(prefix="/chat", tags=["chat"])

# Luma's system prompt
LUMA_SYSTEM_PROMPT = """You are Luma, an emotionally intelligent AI therapist designed to build deep, trusting relationships with users. Your approach is:

- Warm and empathetic, creating a safe space for open dialogue
- Proactive in guiding conversations while remaining client-centered
- Using open-ended questions and reflective listening
- Speaking in an accessible, non-clinical way while maintaining professionalism
- Focused on emotional clarity and personal growth
- Building genuine connections through active engagement

Your responses should:
- Show deep emotional intelligence and empathy
- Encourage self-reflection and insight
- Maintain appropriate therapeutic boundaries
- Focus on the user's emotional experience
- Guide towards positive growth and self-awareness

Remember to:
- Always identify yourself as Luma
- Maintain a warm, professional tone
- Focus on emotional support and understanding
- Avoid clinical terminology unless specifically discussed
- Encourage exploration of feelings and experiences"""

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]] = Field(..., description="List of chat messages")
    stream: bool = Field(False, description="Whether to stream the response")
    user_id: Optional[str] = Field(None, description="User ID for context")

# Dependency for OpenAI service
def get_openai_service():
    return OpenAIService()

def prepare_messages(messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Prepare messages by adding system prompt if not present."""
    if not messages or messages[0].get("role") != "system":
        messages.insert(0, {
            "role": "system",
            "content": LUMA_SYSTEM_PROMPT
        })
    return messages

@router.post("/completion")
async def chat_completion(request: ChatRequest, openai_service: OpenAIService = Depends(get_openai_service)):
    """Get a chat completion response."""
    logger.info(f"Received chat request from user: {request.user_id}")
    
    try:
        # Process messages to ensure correct format
        processed_messages = []
        for msg in request.messages:
            # Validate message format
            if "role" not in msg or "content" not in msg:
                raise HTTPException(status_code=400, detail="Invalid message format")
            
            # Ensure role is valid
            if msg["role"] not in ["system", "user", "assistant"]:
                raise HTTPException(status_code=400, detail=f"Invalid role: {msg['role']}")
            
            processed_messages.append(msg)
        
        # Add system prompt if needed
        processed_messages = prepare_messages(processed_messages)
        
        # Get completion from OpenAI service
        response = await openai_service.get_chat_response(processed_messages)
        
        return {"response": response}
    
    except Exception as e:
        logger.error(f"Error in chat completion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def chat_stream(request: ChatRequest, openai_service: OpenAIService = Depends(get_openai_service)):
    """Stream a chat completion response using SSE."""
    logger.info(f"Received streaming chat request from user: {request.user_id}")
    
    try:
        # Process messages to ensure correct format
        processed_messages = []
        for msg in request.messages:
            # Validate message format
            if "role" not in msg or "content" not in msg:
                raise HTTPException(status_code=400, detail="Invalid message format")
            
            # Ensure role is valid
            if msg["role"] not in ["system", "user", "assistant"]:
                raise HTTPException(status_code=400, detail=f"Invalid role: {msg['role']}")
            
            processed_messages.append(msg)
        
        # Add system prompt if needed
        processed_messages = prepare_messages(processed_messages)
        
        # Create streaming response
        async def event_generator():
            try:
                async for token in openai_service.stream_chat_response(processed_messages):
                    if token:
                        # Format as SSE
                        yield f"data: {json.dumps({'token': token})}\n\n"
                # Send end of stream marker
                yield f"data: {json.dumps({'done': True})}\n\n"
            except Exception as e:
                logger.error(f"Error during streaming: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
                yield f"data: {json.dumps({'done': True})}\n\n"
        
        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"  # Disable Nginx buffering
            }
        )
    
    except Exception as e:
        logger.error(f"Error setting up chat stream: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 