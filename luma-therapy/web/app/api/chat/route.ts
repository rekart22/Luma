import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getAuthenticatedSession } from "@/lib/auth-helpers";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// API config
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
  try {
    // Get the user session from Supabase using our helper
    const { data: { session } } = await getAuthenticatedSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the user's message from the request
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }
    
    // Create the chat request payload
    const payload = {
      messages,
      user_id: session.user.id,
      stream: false
    };
    
    // Call our FastAPI backend
    const response = await fetch(`${API_URL}/chat/completion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get chat response");
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      id: nanoid(),
      response: data.response,
      created: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: 500 }
    );
  }
}

// Handler for streaming response
export async function STREAM(request: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  
  try {
    // Get the user session from Supabase
    const { data: { session } } = await getAuthenticatedSession();
    
    if (!session) {
      writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Unauthorized" })}\n\n`));
      writer.close();
      return new Response(responseStream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
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
          "Cache-Control": "no-cache",
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
    
    // Start streaming from the FastAPI backend
    const apiResponse = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
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
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
} 