"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OAuthProviders from '@/components/OAuthProviders';

/**
 * SignUp Page Component
 * 
 * Handles user registration with email/password and OAuth providers.
 * Includes form validation and error handling.
 */
export default function SignUp() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthError, setOauthError] = useState('');
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/dashboard');
      }
    };
    
    checkSession();
  }, [router]);

  /**
   * Handle form submission for user registration
   */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      const supabase = createClient();
      
      // Create the user account
      const { error: signUpError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: email.split('@')[0], // Default username from email
          }
        }
      });
      
      if (signUpError) {
        console.error('Sign up error:', signUpError);
        
        // Format error message for common errors
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists.');
        } else if (signUpError.message.includes('weak password')) {
          setError('Password is too weak. Please use a stronger password.');
        } else {
          setError(signUpError.message);
        }
        
        setLoading(false);
        return;
      }
      
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }
      
      // Check if email confirmation is required
      if (data?.user?.confirmation_sent_at && !data?.session) {
        setMessage('Success! Check your email to confirm your account before signing in.');
        setLoading(false);
        return;
      }
      
      // If email confirmation is not required, or auto-confirmed
      if (data?.session) {
        router.push('/dashboard');
      } else {
        setMessage('Account created successfully. You can now sign in.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#0F0F0F] text-white">
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header section */}
          <header>
            <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            
            <h1 className="text-3xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-sm text-gray-400">
              Join our platform to access all features
            </p>
          </header>
          
          {/* Success message */}
          {message && (
            <div className="rounded-lg bg-green-900/30 border border-green-800/50 px-4 py-3" role="alert">
              <div className="text-sm text-green-400">{message}</div>
            </div>
          )}
          
          {/* OAuth error */}
          {oauthError && (
            <div className="rounded-lg bg-red-900/30 border border-red-800/50 px-4 py-3 mt-4" role="alert">
              <div className="text-sm text-red-400">{oauthError}</div>
            </div>
          )}

          {/* OAuth providers section */}
          <section className="mt-8">
            <OAuthProviders 
              onError={setOauthError}
            />
          </section>
          
          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0F0F0F] px-4 text-sm text-gray-500">Or continue with</span>
            </div>
          </div>
          
          {/* Sign up form */}
          <form onSubmit={handleSignUp} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#A0A0A0] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-lg border-0 bg-[#1A1A1A] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-[#333] focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="email-description"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#A0A0A0] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-lg border-0 bg-[#1A1A1A] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-[#333] focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-description"
              />
              <p className="mt-1 text-xs text-[#A0A0A0]" id="password-description">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Form error */}
            {error && (
              <div className="rounded-lg bg-red-900/30 border border-red-800/50 px-4 py-3" role="alert">
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-70 transition-all group"
              aria-live="polite"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {loading ? (
                <span className="flex items-center relative z-10">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : <span className="relative z-10">Create account</span>}
            </button>
            
            {/* Sign in link */}
            <footer className="flex items-center justify-center mt-6">
              <div className="text-center text-sm">
                <p className="text-[#A0A0A0]">
                  Already have an account?{' '}
                  <Link href="/signin" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </main>
  );
}