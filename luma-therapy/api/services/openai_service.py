import os
import json
from typing import Dict, List, Any, AsyncGenerator
from openai import AsyncOpenAI
from fastapi import HTTPException

# Import our custom logger
from utils.logger import logger

class OpenAIService:
    """Service for interacting with OpenAI API."""
    
    def __init__(self):
        """Initialize OpenAI client with API key from environment variables."""
        self.api_key = os.environ.get("OPENAI_API_KEY")
        if not self.api_key:
            logger.error("OPENAI_API_KEY not found in environment variables")
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = AsyncOpenAI(
            api_key=self.api_key,
            timeout=30.0,  # 30 second timeout
            max_retries=2  # Limit retries to reduce waiting time
        )
        self.model = "gpt-4-1106-preview"  # Using the latest GPT-4 model
        logger.info(f"OpenAIService initialized with model: {self.model}")
        
        # Configure default parameters for faster responses
        self.default_params = {
            "temperature": 0.7,  # Warm, slightly varied responses
            "max_tokens": 150,   # Reduced for faster initial responses
            "frequency_penalty": 0.3,  # Reduced for faster responses
            "presence_penalty": 0.3,  # Reduced for faster responses
            "timeout": 30        # 30 second timeout
        }
    
    async def get_chat_response(self, messages: List[Dict[str, str]]) -> str:
        """Get a chat completion response."""
        try:
            logger.debug(f"Sending chat request with {len(messages)} messages")
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=False,
                **self.default_params
            )
            
            logger.debug("Received chat response")
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error in get_chat_response: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    async def stream_chat_response(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        """Stream a chat completion response."""
        try:
            logger.debug(f"Starting streaming chat request with {len(messages)} messages")
            
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True,
                **self.default_params
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
                    
            logger.debug("Finished streaming chat response")
            
        except Exception as e:
            logger.error(f"Error in stream_chat_response: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e)) 