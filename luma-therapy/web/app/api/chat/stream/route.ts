import { NextRequest } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth-helpers";

// Force dynamic rendering and specify Edge runtime
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const preferredRegion = 'auto';

// API config
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  
  try {
    // Get the user session from Supabase using our helper
    const { data: { session }, error: authError } = await getAuthenticatedSession();
    
    if (authError || !session) {
      const errorMessage = authError ? `Auth error: ${authError.message}` : "Unauthorized";
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
    
    // Parse the user's message from the request
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Invalid messages format" })}\n\n`));
      writer.close();
      return new Response(responseStream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }
    
    // Create the chat request payload
    const payload = {
      messages,
      user_id: session.user.id,
      stream: true
    };
    
    // Start streaming from the FastAPI backend with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
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
      throw new Error(errorData.detail || "Failed to get streaming response");
    }
    
    // Create a reader from the API response
    const reader = apiResponse.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }
    
    // Process the streaming response
    const decoder = new TextDecoder();
    
    // Read from the API response and write to our response
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value);
      writer.write(encoder.encode(chunk));
    }
    
    // Close the writer when done
    writer.close();
  } catch (error: any) {
    console.error("Error in chat stream:", error);
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