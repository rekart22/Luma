"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get the initial session
        const { data: { session: initialSession }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            console.log('[AUTH] Initial session loaded:', {
              userId: initialSession.user.id,
              email: initialSession.user.email,
              expiresAt: new Date(initialSession.expires_at! * 1000).toISOString()
            });
          } else {
            console.log('[AUTH] No initial session found');
          }
          setLoading(false);
        }

        // Set up real-time auth subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log(`[AUTH] Auth state change: ${event}`);
            
            if (mounted) {
              if (currentSession) {
                setSession(currentSession);
                setUser(currentSession.user);
                console.log('[AUTH] Session updated:', {
                  userId: currentSession.user.id,
                  event
                });
              } else {
                setSession(null);
                setUser(null);
                console.log('[AUTH] Session cleared');
              }
            }
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error('[AUTH] Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('[AUTH] Starting sign out process');

      // Client-side sign out
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) throw supabaseError;

      // Server-side sign out
      const response = await fetch('/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Server signout failed: ${response.status}`);
      }

      setUser(null);
      setSession(null);
      console.log('[AUTH] Sign out successful');
      
      // Use router for client-side navigation
      router.push('/auth/signin');
      router.refresh();

    } catch (error) {
      console.error('[AUTH] Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      console.log('[AUTH] Refreshing session');
      const { data: { session: refreshedSession }, error } = 
        await supabase.auth.refreshSession();

      if (error) throw error;

      if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        console.log('[AUTH] Session refreshed successfully');
      } else {
        console.log('[AUTH] No session after refresh');
      }
    } catch (error) {
      console.error('[AUTH] Session refresh error:', error);
    }
  };

  // Debug output for auth state changes
  useEffect(() => {
    console.log('[AUTH] Current state:', {
      isAuthenticated: !!user,
      loading,
      userId: user?.id,
      sessionExpires: session?.expires_at 
        ? new Date(session.expires_at * 1000).toISOString()
        : null
    });
  }, [user, session, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 