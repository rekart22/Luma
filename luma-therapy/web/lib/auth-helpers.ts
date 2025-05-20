import { NextRequest } from "next/server";
import { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import logger, { generateTraceId } from "@/lib/logger";

interface AuthError {
  message: string;
}

/**
 * Helper function to get the authenticated user's session from a request
 * Updated for Next.js 15's async cookies API
 */
export async function getAuthenticatedSession(traceId: string = generateTraceId()) {
  try {
    logger.info("Starting session retrieval", { traceId });
    
    // Create a new Supabase client using our server utility
    const supabase = await createClient({ traceId });
    logger.debug("Supabase client created", { traceId });

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error("Authentication error", { traceId, error: error.message });
      return { data: { session: null }, error: error as AuthError };
    }

    if (!session) {
      logger.info("No active session found", { traceId });
    } else {
      logger.info("Session retrieved successfully", { traceId, userId: session.user.id });
    }

    return { data: { session }, error: null };
  } catch (e) {
    const error = e as Error;
    logger.error("Auth helper error", { 
      traceId,
      error: error.message,
      stack: error.stack
    });
    return { data: { session: null }, error: { message: error.message } };
  }
}

/**
 * Get the user ID from the request if authenticated
 * Returns null if not authenticated
 */
export async function getAuthenticatedUserId(traceId: string = generateTraceId()): Promise<string | null> {
  try {
    logger.debug("Attempting to get authenticated user ID", { traceId });
    const { data: { session }, error } = await getAuthenticatedSession(traceId);
    
    if (error || !session) {
      logger.info("No authenticated user found", { traceId, error: error?.message });
      return null;
    }
    
    logger.debug("Successfully retrieved user ID", { traceId, userId: session.user.id });
    return session.user.id;
  } catch (e) {
    const error = e as Error;
    logger.error("User ID fetch error", { 
      traceId,
      error: error.message,
      stack: error.stack
    });
    return null;
  }
} 