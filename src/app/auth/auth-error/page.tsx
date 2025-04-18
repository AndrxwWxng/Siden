"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

// Component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const [errorReason, setErrorReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const reason = searchParams?.get('reason') || 'unknown';
    const error = searchParams?.get('error') || '';

    setErrorReason(reason);
    setErrorMessage(error);
  }, [searchParams]);

  const getErrorDetails = () => {
    switch (errorReason) {
      case 'missing_token':
        return 'Authentication failed due to a missing token.';
      case 'code_exchange_failed':
        return 'Authentication failed while exchanging the authorization code.';
      case 'recovery_failed':
        return `Password reset failed: ${errorMessage || 'Invalid or expired token'}`;
      case 'verification_failed':
        return `Email verification failed: ${errorMessage || 'Invalid or expired token'}`;
      case 'auth_error':
        return 'An error occurred during authentication.';
      case 'server_error':
        return 'A server error occurred during authentication.';
      default:
        return 'An unknown authentication error occurred.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:px-6 lg:px-8 bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10 bg-[#111111] rounded-lg border border-[#222222] shadow-xl">
          <div className="text-center">
            
            <h1 className="text-3xl font-bold text-white mb-2">Authentication Error</h1>
            <p className="text-[#A0A0A0] text-base mb-8">{getErrorDetails()}</p>
            
            <div className="flex flex-col space-y-4">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center space-x-2 rounded bg-[#6366F1] px-4 py-2 font-semibold text-white transition hover:bg-[#4F46E5] hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" /> <span>Return to Sign In</span>
              </Link>
              
              <Link
                href="/"
                className="text-[#888888] hover:text-white font-medium transition-colors"
              >
                Go to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback for suspense
function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:px-6 lg:px-8 bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10 bg-[#111111] rounded-lg border border-[#222222] shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Authentication Error</h1>
            <p className="text-[#A0A0A0] text-base mb-8">Loading error details...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<ErrorFallback />}>
      <ErrorContent />
    </Suspense>
  );
} 