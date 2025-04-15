"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
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
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setResetEmailSent(true);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0F0F0F]">
      {/* Header with back button */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to home
        </Link>
      </div>
      
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {resetMode ? (
            <>
              {resetEmailSent ? (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mx-auto">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="#A855F7" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Check your email</h2>
                  <p className="text-[#A0A0A0] text-sm max-w-sm mx-auto">
                    We've sent a password reset link to <span className="text-indigo-400">{email}</span>. 
                    Please check your inbox.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setResetMode(false);
                        setResetEmailSent(false);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                    >
                      Back to sign in
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="inline-block mb-4 p-2 bg-gradient-to-br from-indigo-500 to-indigo-500 rounded-xl bg-opacity-10 backdrop-blur-sm">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15V17M12 7V13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Reset your password</h1>
                    <p className="mt-2 text-[#A0A0A0] text-sm">Enter your email and we'll send you a link to reset your password</p>
                  </div>
                  
                  <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
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

                    <div className="flex flex-col space-y-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-70 transition-all"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : 'Send reset link'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setResetMode(false)}
                        className="text-[#A0A0A0] hover:text-white text-sm transition-colors"
                      >
                        Back to sign in
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="inline-block mb-4 p-2 bg-gradient-to-br from-indigo-500 to-indigo-500 rounded-xl bg-opacity-10 backdrop-blur-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                <p className="mt-2 text-[#A0A0A0] text-sm">Sign in to your account</p>
              </div>
              
              <form onSubmit={handleSignIn} className="mt-8 space-y-5">
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
                    className="mb-10 block w-full rounded-lg border-0 bg-[#1A1A1A] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-[#333] focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all"
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
