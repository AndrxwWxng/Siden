import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // First refresh the router for server components
      router.refresh();
      
      // Then do a full page refresh to ensure auth state is fully updated
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        // Refresh router for server components
        router.refresh();
        
        // Do a full page refresh to ensure auth state is fully updated
        window.location.href = '/dashboard';
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Failed to sign in' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Failed to sign up' };
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
} 