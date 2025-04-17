"use client";

import { useState } from 'react';
import { OAuthProvider, getProviderInfo, signInWithOAuth } from '@/utils/oauth';

// Icon components
const GithubIcon = () => (
  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
  </svg>
);

interface OAuthProvidersProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function OAuthProviders({ 
  redirectTo,
  onSuccess,
  onError 
}: OAuthProvidersProps) {
  const [isLoading, setIsLoading] = useState<OAuthProvider | null>(null);

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setIsLoading(provider);
    try {
      const { error } = await signInWithOAuth(provider, redirectTo);
      
      if (error) {
        onError?.(error);
        console.error(`Error signing in with ${provider}:`, error);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      onError?.(err.message || `Failed to sign in with ${provider}`);
      console.error(`Error signing in with ${provider}:`, err);
    } finally {
      setIsLoading(null);
    }
  };

  // Available providers
  const providers: OAuthProvider[] = ['github', 'google'];
  
  // Render provider icon
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'github':
        return <GithubIcon />;
      case 'google':
        return <GoogleIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 w-full">
      {providers.map((provider) => {
        const { name, icon } = getProviderInfo(provider);
        const isProviderLoading = isLoading === provider;
        
        return (
          <button
            key={provider}
            type="button"
            disabled={isLoading !== null}
            onClick={() => handleOAuthSignIn(provider)}
            className={`
              flex w-full items-center justify-center gap-2 rounded-lg border
              ${isProviderLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-900'}
              border-gray-700 bg-[#111111] px-4 py-3 text-sm font-medium text-white
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              focus:ring-offset-[#0F0F0F]
            `}
          >
            {isProviderLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                {renderIcon(icon)}
                <span>Continue with {name}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
} 