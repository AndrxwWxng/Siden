"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div 
        className="w-full max-w-md space-y-8 rounded-lg border border-[#333] p-10 bg-[#111] shadow-[0_0_30px_rgba(99,102,241,0.1)] opacity-0 animate-fadeIn"
        style={{animation: 'fadeIn 0.5s forwards'}}
      >
        <div className="text-center opacity-0" style={{animation: 'fadeIn 0.5s 0.2s forwards'}}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">Sign In</h1>
          <p className="mt-2 text-[#AAAAAA]">Welcome back!</p>
        </div>
        
        <form 
          onSubmit={handleSignIn} 
          className="mt-8 space-y-6 opacity-0"
          style={{animation: 'fadeIn 0.5s 0.3s forwards'}}
        >
          <div className="space-y-5">
            <div className="opacity-0" style={{animation: 'slideInFromLeft 0.4s 0.4s forwards'}}>
              <label htmlFor="email" className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border border-[#333] bg-[#1A1A1A] px-4 py-3 text-white shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] focus:outline-none focus:ring-1 transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="opacity-0" style={{animation: 'slideInFromLeft 0.4s 0.5s forwards'}}>
              <label htmlFor="password" className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border border-[#333] bg-[#1A1A1A] px-4 py-3 text-white shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] focus:outline-none focus:ring-1 transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-[#2D0B0B] border border-[#5A1D1D] p-4">
              <div className="text-sm text-[#F87171]">{error}</div>
            </div>
          )}

          <div className="opacity-0" style={{animation: 'fadeIn 0.5s 0.6s forwards'}}>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#6366F1] px-5 py-3 text-sm font-medium text-white hover:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 focus:ring-offset-[#111] transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-[2px]"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm opacity-0" style={{animation: 'fadeIn 0.5s 0.7s forwards'}}>
          <p className="text-[#AAAAAA]">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-[#6366F1] hover:text-[#4F46E5] transition-colors duration-300 relative group">
              Sign up
              <span className="absolute inset-x-0 bottom-0 h-[1px] bg-[#6366F1] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </p>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromLeft {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
