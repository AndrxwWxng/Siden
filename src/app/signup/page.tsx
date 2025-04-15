"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const supabase = createClient();
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // Skip email confirmation by using an empty string instead of null
          emailRedirectTo: '',
          // Auto-confirm the user
          data: {
            email_confirmed: true
          }
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        // Immediately sign in the user after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          setError(signInError.message);
        } else {
          // Redirect to dashboard on successful signup and sign in
          router.push('/dashboard');
          router.refresh();
        }
      }
    } catch (err) {
      console.error('Sign up error:', err);
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
          <div className="text-center">
            <div className="inline-block mb-4 p-2 bg-gradient-to-br from-indigo-500 to-indigo-500 rounded-xl bg-opacity-10 backdrop-blur-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 9L12 15M9 12L15 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Create account</h1>
            <p className="mt-2 text-[#A0A0A0] text-sm">Get started with your new account</p>
          </div>
          
          <form onSubmit={handleSignUp} className="mt-8 space-y-5">
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
              />
              <p className="mt-1 text-xs text-[#A0A0A0]">
                Password must be at least 6 characters
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-900/30 border border-red-800/50 px-4 py-3">
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-green-900/30 border border-green-800/50 px-4 py-3">
                <div className="text-sm text-green-400">{message}</div>
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
                  Creating account...
                </span>
              ) : <span className="relative z-10">Create account</span>}
            </button>

            <div className="flex items-center justify-center mt-6">
                  <div className="text-center text-sm">
                    <p className="text-[#A0A0A0]">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      Sign in
                    </Link>
                    </p>
                  </div>
                </div>
          </form>
        </div>
      </div>
    </div>
  );
}
