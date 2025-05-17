"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function MagicLinkHandler() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        setMessage("Processing your sign-in...");
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        
        if (access_token && refresh_token) {
          // Set the session with proper error handling
          supabase.auth.setSession({ access_token, refresh_token })
            .then(({ data, error }) => {
              if (error) {
                setMessage("Sign-in failed!");
                toast.error("Failed to sign in: " + error.message);
                router.replace("/auth/signin?error=magiclink_failed");
              } else {
                setMessage("Success! Redirecting...");
                toast.success("Successfully signed in!");
                
                // Wait a bit to ensure session is properly set and persisted
                setTimeout(() => {
                  // Force full page refresh to ensure auth state is fresh
                  window.location.href = "/chat-app";
                }, 1500);
              }
            });
        } else {
          setMessage("Invalid link!");
          toast.error("Invalid magic link. Please try signing in again.");
          router.replace("/auth/signin?error=missing_token");
        }
      } else {
        setMessage("No valid link found!");
        toast.error("No magic link found in URL.");
        router.replace("/auth/signin?error=no_magiclink");
      }
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">{message}</div>
        {loading && (
          <div className="w-8 h-8 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        )}
      </div>
    </div>
  );
} 