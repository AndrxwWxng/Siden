/**
 * OAuth Providers Configuration
 * This file contains utility functions for third-party OAuth providers
 */
import React from 'react';
import { createClient } from '@/utils/supabase/client';

// List of supported OAuth providers
export type OAuthProvider = 'google' | 'github';

/**
 * Sign in with OAuth provider
 * @param provider - The OAuth provider to use (google, github)
 * @param redirectTo - Optional URL to redirect to after successful authentication
 */
export async function signInWithOAuth(provider: OAuthProvider, redirectTo?: string) {
  try {
    const supabase = createClient();
    
    // Default redirect to auth callback
    const callbackUrl = redirectTo || `${window.location.origin}/auth/callback`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: callbackUrl,
        queryParams: provider === 'google' 
          ? { 
              access_type: 'offline', 
              prompt: 'consent' 
            } 
          : undefined,
        scopes: provider === 'github' 
          ? 'user:email,read:user' 
          : provider === 'google'
            ? 'profile email'
            : undefined,
      }
    });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Error signing in with ${provider}:`, error);
    return { data: null, error: error.message || `Failed to sign in with ${provider}` };
  }
}

/**
 * Link an OAuth provider to an existing account
 * @param provider - The OAuth provider to link
 */
export async function linkOAuthProvider(provider: OAuthProvider) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?linking=true`,
        // Add additional scopes as needed
        scopes: provider === 'github' 
          ? 'user:email,read:user' 
          : provider === 'google'
            ? 'profile email'
            : undefined,
      }
    });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Error linking ${provider}:`, error);
    return { data: null, error: error.message || `Failed to link ${provider} account` };
  }
}

// Get user's provider accounts
export const getUserProviderAccounts = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  // Extract identities from user data
  return user.identities?.map(identity => ({
    provider: identity.provider,
    id: identity.id,
    // Add any other relevant properties
  })) || [];
};

// Check if user has connected a specific provider
export const hasConnectedProvider = async (provider: OAuthProvider): Promise<boolean> => {
  const accounts = await getUserProviderAccounts();
  return !!accounts?.some(account => account.provider === provider);
};

interface ProviderInfo {
  name: string;
  icon: string;
}

/**
 * Get provider display information
 */
export function getProviderInfo(provider: OAuthProvider): ProviderInfo {
  switch (provider) {
    case 'github':
      return {
        name: 'GitHub',
        icon: 'github'
      };
    case 'google':
      return {
        name: 'Google',
        icon: 'google'
      };
    default:
      return {
        name: provider,
        icon: provider
      };
  }
} 