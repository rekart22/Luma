"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function MagicLinkHandler() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Signing you in...");
  const processedRef = useRef(false);

  useEffect(() => {
    console.log("[MAGIC LINK] Handler loaded");
    if (processedRef.current) return;
    processedRef.current = true;
    // Only run on client
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        setMessage("Processing your sign-in (code param)...");
        console.log("[MAGIC LINK] Found code param:", code);
        supabase.auth.exchangeCodeForSession(code)
          .then(async ({ data, error }) => {
            if (error) {
              // Check if user is actually signed in
              const { data: userData } = await supabase.auth.getUser();
              if (!userData?.user) {
                setMessage("Sign-in failed!");
                toast.error("Failed to sign in: " + error.message);
                router.replace("/auth/signin?error=magiclink_failed");
              } else {
                // User is signed in, treat as success
                setMessage("Success! Redirecting...");
                toast.dismiss();
                setTimeout(() => {
                  window.location.replace("/chat-app");
                }, 500);
              }
            } else {
              setMessage("Success! Redirecting...");
              toast.success("Successfully signed in!");
              setTimeout(() => {
                window.location.replace("/chat-app");
              }, 2500);
            }
          });
        return;
      }
      // Fallback: hash-based flow
      const hash = window.location.hash;
      if (hash) {
        setMessage("Processing your sign-in (hash)...");
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          supabase.auth.setSession({ access_token, refresh_token })
            .then(({ data, error }) => {
              if (error) {
                setMessage("Sign-in failed!");
                toast.error("Failed to sign in: " + error.message);
                router.replace("/auth/signin?error=magiclink_failed");
              } else {
                setMessage("Success! Redirecting...");
                toast.success("Successfully signed in!");
                console.log("[MAGIC LINK] Session set via hash, about to redirect. document.cookie:", document.cookie);
                setTimeout(() => {
                  console.log("[MAGIC LINK] Before redirect, document.cookie:", document.cookie);
                  window.location.replace("/chat-app");
                }, 2500);
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