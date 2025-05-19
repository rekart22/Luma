import { NextRequest } from "next/server";
import { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

interface AuthError {
  message: string;
}

/**
 * Helper function to get the authenticated user's session from a request
 * Updated for Next.js 15's async cookies API
 */
export async function getAuthenticatedSession() {
  try {
    console.log("Auth helper: Starting session retrieval with async cookie handling");
    
    // Create a new Supabase client using our server utility
    const supabase = createClient();

    console.log("Auth helper: Client created, retrieving session");
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Auth error:", error.message);
      return { data: { session: null }, error: error as AuthError };
    }

    console.log("Auth helper: Session retrieved successfully");
    return { data: { session }, error: null };
  } catch (e) {
    const error = e as Error;
    console.error("Auth helper error:", error.message, error.stack);
    return { data: { session: null }, error: { message: error.message } };
  }
}

/**
 * Get the user ID from the request if authenticated
 * Returns null if not authenticated
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const { data: { session }, error } = await getAuthenticatedSession();
    if (error || !session) {
      return null;
    }
    return session?.user?.id || null;
  } catch (e) {
    const error = e as Error;
    console.error("User ID fetch error:", error.message);
    return null;
  }
} 