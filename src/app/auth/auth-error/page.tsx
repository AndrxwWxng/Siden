"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get('reason');
  const error = searchParams?.get('error');

  const getErrorMessage = () => {
    switch (reason) {
      case 'missing_token':
        return 'Authentication failed due to a missing token.';
      case 'code_exchange_failed':
        return 'Authentication failed while exchanging the authorization code.';
      case 'recovery_failed':
        return `Password reset failed: ${error || 'Invalid or expired token'}`;
      case 'verification_failed':
        return `Email verification failed: ${error || 'Invalid or expired token'}`;
      case 'auth_error':
        return 'An error occurred during authentication.';
      case 'server_error':
        return 'A server error occurred during authentication.';
      default:
        return 'An unknown authentication error occurred.';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0F0F] text-white">
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Authentication Error</h1>
            <p className="text-[#A0A0A0] text-base mb-8">{getErrorMessage()}</p>
            
            <div className="flex flex-col space-y-4">
              <Link
                href="/signin"
                className="relative overflow-hidden w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0F0F0F] transition-all group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/40 to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Return to sign in</span>
              </Link>
              
              <Link
                href="/"
                className="text-[#A0A0A0] hover:text-white text-sm text-center transition-colors"
              >
                Return to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 