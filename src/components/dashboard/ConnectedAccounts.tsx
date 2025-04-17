"use client";

import { useState, useEffect } from 'react';
import { OAuthProvider, signInWithProvider, getProviderInfo, hasConnectedProvider } from '@/utils/oauth';

interface ConnectedAccountsProps {
  className?: string;
}

export default function ConnectedAccounts({ className = '' }: ConnectedAccountsProps) {
  const [connections, setConnections] = useState<Record<OAuthProvider, boolean>>({
    google: false,
    github: false
  });
  const [isLoading, setIsLoading] = useState<Record<OAuthProvider, boolean>>({
    google: false,
    github: false
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Check which providers are connected on component mount
  useEffect(() => {
    const checkConnections = async () => {
      try {
        const googleConnected = await hasConnectedProvider('google');
        const githubConnected = await hasConnectedProvider('github');
        
        setConnections({
          google: googleConnected,
          github: githubConnected
        });
      } catch (error) {
        console.error('Error checking connected providers:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    checkConnections();
  }, []);

  const handleConnect = async (provider: OAuthProvider) => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }));
      
      const { error } = await signInWithProvider(provider);
      
      if (error) {
        console.error(`Error connecting ${provider}:`, error);
        throw error;
      }
      
      // The OAuth flow will redirect the user, so we don't need to do anything else here
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  if (isInitialLoading) {
    return (
      <div className={`rounded-lg border border-[#222] p-6 bg-[#121212] ${className}`}>
        <h2 className="text-xl font-semibold text-white mb-4">Connected Services</h2>
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-[#222] p-6 bg-[#121212] ${className}`}>
      <h2 className="text-xl font-semibold text-white mb-4">Connected Services</h2>
      <p className="text-[#A0A0A0] text-sm mb-6">
        Connect your accounts to enable integrations without API keys
      </p>
      
      <div className="space-y-4">
        {/* Google Connection */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#1A1A1A] border border-[#333]">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">Google</h3>
              <p className="text-xs text-[#A0A0A0]">
                {connections.google ? 'Connected' : 'Connect to access Google Drive and Sheets'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleConnect('google')}
            disabled={isLoading.google || connections.google}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#1A1A1A] ${
              connections.google 
                ? 'bg-green-900/30 text-green-400 border border-green-800/50 cursor-default' 
                : 'bg-white text-[#333] hover:bg-gray-100'
            }`}
          >
            {isLoading.google ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : connections.google ? 'Connected' : 'Connect'}
          </button>
        </div>
        
        {/* GitHub Connection */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#1A1A1A] border border-[#333]">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#24292e]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">GitHub</h3>
              <p className="text-xs text-[#A0A0A0]">
                {connections.github ? 'Connected' : 'Connect to access repositories'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleConnect('github')}
            disabled={isLoading.github || connections.github}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#1A1A1A] ${
              connections.github 
                ? 'bg-green-900/30 text-green-400 border border-green-800/50 cursor-default' 
                : 'bg-[#24292e] text-white hover:bg-[#1a1e22]'
            }`}
          >
            {isLoading.github ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : connections.github ? 'Connected' : 'Connect'}
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-[#222]">
        <p className="text-xs text-[#777]">
          These integrations allow our AI agents to securely interact with your accounts without requiring you to set up API keys manually.
          Your credentials are securely managed by Supabase Auth and are never directly exposed to our application.
        </p>
      </div>
    </div>
  );
} 