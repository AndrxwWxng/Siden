import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { OAuthProvider, signInWithOAuth } from '@/utils/oauth';
import { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Set up auth state listener
    const supabase = createClient();
    
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Update auth state
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Debug auth events
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN') {
        // Force refresh to ensure server components pick up the new session
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        // Force refresh to ensure server components pick up the removed session
        router.refresh();
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery initiated');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Force a hard refresh to clear any cached data
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
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Failed to sign in' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      // Sign up without requiring email confirmation
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // Skip email confirmation by not specifying emailRedirectTo
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      // If account was created successfully, immediately sign in
      if (data?.user) {
        // Automatically sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          throw signInError;
        }
        
        // Refresh the router for server components
        router.refresh();
        
        // Navigate to dashboard
        window.location.href = '/dashboard';
      }
      
      return { error: null };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Failed to sign up' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: OAuthProvider) => {
    setLoading(true);
    
    try {
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        throw new Error(error);
      }
      
      return { error: null };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : `Failed to sign in with ${provider}` };
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Failed to send password reset email' };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : 'Failed to update password' };
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
    signOut,
    signInWithProvider,
    resetPasswordForEmail,
    updatePassword
  };
} 