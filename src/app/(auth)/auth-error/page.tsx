"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorReason, setErrorReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const reason = searchParams.get('reason') || 'unknown';
    const error = searchParams.get('error') || '';

    setErrorReason(reason);
    setErrorMessage(error);
  }, [searchParams]);

  const getErrorDetails = () => {
    switch (errorReason) {
      case 'missing_token':
        return 'No authentication token was found in the URL.';
      case 'verification_failed':
        return 'The verification process failed. The token may have expired or already been used.';
      case 'code_exchange_failed':
        return 'Failed to exchange the authentication code.';
      case 'server_error':
        return 'An unexpected server error occurred during authentication.';
      default:
        return 'There was a problem with your authentication request.';
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-[#333] p-10 bg-[#111] shadow-[0_0_30px_rgba(99,102,241,0.1)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F43F5E] to-[#EC4899] bg-clip-text text-transparent">Authentication Error</h1>
          <p className="mt-4 text-[#AAAAAA]">
            {getErrorDetails()}
          </p>
          {errorMessage && (
            <p className="mt-2 text-[#F87171] text-sm">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="mt-8">
          <p className="mb-4 text-[#AAAAAA] font-medium">Possible reasons:</p>
          <ul className="list-disc text-left pl-5 mb-8 text-[#AAAAAA] space-y-2">
            <li className="transition-all duration-300 hover:text-white">The authentication link has expired</li>
            <li className="transition-all duration-300 hover:text-white">The link has already been used</li>
            <li className="transition-all duration-300 hover:text-white">The email address was entered incorrectly</li>
            <li className="transition-all duration-300 hover:text-white">There was a problem with your account</li>
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="inline-block rounded-md bg-[#6366F1] px-6 py-3 text-center text-white hover:bg-[#4F46E5] transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-[2px]"
            >
              Return to Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-block rounded-md bg-transparent border border-[#6366F1] px-6 py-3 text-center text-[#6366F1] hover:bg-[#6366F1]/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
