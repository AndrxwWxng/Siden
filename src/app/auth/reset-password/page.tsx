"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      setMessage('Your password has been updated successfully. You can now sign in with your new password.');
      setLoading(false);
      
      // Clear form
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] text-white">
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/signin" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
            
            <h2 className="text-3xl font-bold text-white">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-400">
              Choose a new password for your account
            </p>
          </div>
          
          {message && (
            <div className="rounded-lg bg-green-900/30 border border-green-800/50 px-4 py-3">
              <div className="text-sm text-green-400">{message}</div>
              <Link 
                href="/signin" 
                className="mt-2 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          )}
          
          {!message && (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
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
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#A0A0A0] mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
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
                className="relative overflow-hidden flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-70 transition-all group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {loading ? (
                  <span className="flex items-center relative z-10">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating password...
                  </span>
                ) : <span className="relative z-10">Update password</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 