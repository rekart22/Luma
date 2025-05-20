import { NextRequest } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth-helpers";
import logger, { generateTraceId } from "@/lib/logger";

// Force dynamic rendering and specify Edge runtime
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const preferredRegion = 'auto';

// API config
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
  const traceId = generateTraceId();
  logger.info("Chat stream request received", { traceId, url: request.url });
  
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  
  try {
    logger.debug("Attempting to get authenticated session", { traceId });
    const { data: { session }, error: authError } = await getAuthenticatedSession(traceId);
    
    if (authError || !session) {
      const errorMessage = authError ? `Auth error: ${authError.message}` : "Unauthorized";
      logger.warn("Authentication failed", { traceId, error: errorMessage });
      
      writer.write(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
      writer.close();
      return new Response(responseStream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }
    
    logger.debug("Parsing request body", { traceId });
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      const error = "Invalid messages format";
      logger.warn("Invalid request format", { traceId, error });
      
      writer.write(encoder.encode(`data: ${JSON.stringify({ error })}\n\n`));
      writer.close();
      return new Response(responseStream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }
    
    logger.debug("Creating chat request payload", { 
      traceId, 
      userId: session.user.id,
      messageCount: messages.length 
    });
    
    const payload = {
      messages,
      user_id: session.user.id,
      stream: true
    };
    
    // Start streaming from the FastAPI backend with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      logger.error("Chat stream request timed out", { traceId });
    }, 30000); // 30 second timeout
    
    logger.info("Initiating FastAPI stream request", { 
      traceId, 
      endpoint: `${API_URL}/chat/stream` 
    });
    
    const apiResponse = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      logger.error("FastAPI request failed", { 
        traceId, 
        status: apiResponse.status,
        error: errorData.detail 
      });
      throw new Error(errorData.detail || "Failed to get streaming response");
    }
    
    logger.debug("FastAPI stream connected successfully", { traceId });
    
    // Create a reader from the API response
    const reader = apiResponse.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }
    
    // Process the streaming response
    const decoder = new TextDecoder();
    let chunkCount = 0;
    
    // Read from the API response and write to our response
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value);
      writer.write(encoder.encode(chunk));
      chunkCount++;
      
      if (chunkCount % 10 === 0) { // Log every 10th chunk to avoid excessive logging
        logger.debug("Stream progress", { traceId, chunksProcessed: chunkCount });
      }
    }
    
    logger.info("Chat stream completed successfully", { 
      traceId, 
      totalChunks: chunkCount 
    });
    writer.close();
  } catch (error: any) {
    logger.error("Error in chat stream", {
      traceId,
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message || "Failed to stream response" })}\n\n`));
    writer.close();
  }
  
  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
} 