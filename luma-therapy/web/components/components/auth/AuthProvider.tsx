"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth status
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log('[AUTH PROVIDER] Initial user:', user);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        console.log(`[AUTH PROVIDER] Auth event: ${event}, User:`, session?.user);
        if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Client-side sign out
      await supabase.auth.signOut();
      // Server-side sign out (clears cookies/session)
      await fetch('/auth/signout', { method: 'POST' });
      // Redirect to sign-in page
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.refreshSession();
      setUser(data.user);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 