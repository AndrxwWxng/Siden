"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      // Update the user's password using the reset token
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
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
        <Link href="/signin" className="inline-flex items-center text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to sign in
        </Link>
      </div>
      
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mx-auto">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Password reset successful</h2>
              <p className="text-[#A0A0A0] text-sm max-w-sm mx-auto">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <div className="pt-4">
                <Link
                  href="/signin"
                  className="inline-block rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] transition-all"
                >
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="inline-block mb-4 p-2 bg-gradient-to-br from-indigo-500 to-indigo-500 rounded-xl bg-opacity-10 backdrop-blur-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 10.5V6.5C16.5 4.01 14.49 2 12 2C9.51 2 7.5 4.01 7.5 6.5V10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14.5V17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.2 15.79L18.94 19.25C18.77 21.68 18.13 22 15.22 22H8.78C5.87 22 5.23 21.68 5.06 19.25L4.8 15.79C4.65 13.73 4.82 12.21 8.5 11.21V8.5C8.5 7.12 9.62 6 11 6H13C14.38 6 15.5 7.12 15.5 8.5V11.21C19.18 12.21 19.35 13.73 19.2 15.79Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white">Create new password</h1>
                <p className="mt-2 text-[#A0A0A0] text-sm">Enter a new secure password for your account</p>
              </div>
              
              <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-[#A0A0A0] mb-2">
                    New Password
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

                <div>
                  <label htmlFor="confirm-password" className="block text-xs font-medium text-[#A0A0A0] mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-lg border-0 bg-[#1A1A1A] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-[#333] focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-70 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 