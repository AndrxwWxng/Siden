"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OAuthProviders from '@/components/OAuthProviders';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        
        // Format error message for common errors
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in.');
        } else {
          setError(error.message);
        }
        
        setLoading(false);
        return;
      }
      
      if (data?.session) {
        // Get redirect path from URL query params or default to dashboard
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('next') || '/dashboard';
        
        // Refresh router for server components
        router.refresh();
        
        // Force a hard refresh to ensure new session is fully applied
        window.location.href = redirectTo;
      } else {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      setResetEmailSent(true);
      setLoading(false);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Failed to send reset email. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] text-white">
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            
            <h2 className="text-3xl font-bold text-white">
              {resetMode ? 'Reset your password' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {resetMode && 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>
          
          {oauthError && (
            <div className="rounded-lg bg-red-900/30 border border-red-800/50 px-4 py-3 mt-4">
              <div className="text-sm text-red-400">{oauthError}</div>
            </div>
          )}

          {resetMode ? (
            <>
              {resetEmailSent ? (
                <div className="rounded-lg bg-green-900/30 border border-green-800/50 px-4 py-3 mt-4">
                  <div className="text-sm text-green-400">
                    <p className="font-medium">Reset email sent!</p>
                    <p className="mt-1">Check your inbox for a link to reset your password.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setResetMode(false);
                      setResetEmailSent(false);
                    }}
                    className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Return to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="reset-email" className="block text-xs font-medium text-[#A0A0A0] mb-2">
                      Email
                    </label>
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-lg border-0 bg-[#1A1A1A] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-[#333] focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  {error && (
                    <div className="rounded-lg bg-red-900/30 border border-red-800/50 px-4 py-3">
                      <div className="text-sm text-red-400">{error}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setResetMode(false)}
                      className="flex-1 py-3 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors rounded-lg border border-[#333] hover:border-[#444]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative overflow-hidden flex-1 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-70 transition-all group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {loading ? (
                        <span className="flex items-center relative z-10">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : <span className="relative z-10">Send reset link</span>}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="mt-8">
                <OAuthProviders 
                  onError={setOauthError}
                />
              </div>
              
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0F0F0F] px-4 text-sm text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <form onSubmit={handleSignIn} className="mt-6 space-y-5">
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
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-xs font-medium text-[#A0A0A0]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setResetMode(true)}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-lg border-0 bg-[#1A1A1A] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-[#333] focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-900/30 border border-red-800/50 px-4 py-3">
                    <div className="text-sm text-red-400">{error}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-70 transition-all group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {loading ? (
                    <span className="flex items-center relative z-10">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : <span className="relative z-10">Sign in</span>}
                </button>

                <div className="flex items-center justify-center mt-6">
                  <div className="text-center text-sm">
                    <p className="text-[#A0A0A0]">
                      Don't have an account?{' '}
                      <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        Create account
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}