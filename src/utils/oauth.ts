/**
 * OAuth Providers Configuration
 * This file contains utility functions for third-party OAuth providers
 */
import { createClient } from '@/utils/supabase/client';

// List of supported OAuth providers
export type OAuthProvider = 'google' | 'github';

// Function to sign in with an OAuth provider
export const signInWithProvider = async (provider: OAuthProvider) => {
  const supabase = createClient();
  
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // You can add scopes here if needed
      scopes: provider === 'google' 
        ? 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/documents' 
        : 'repo',
    }
  });
};

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

// Utility to get provider display name and icon
export const getProviderInfo = (provider: OAuthProvider) => {
  switch (provider) {
    case 'google':
      return {
        name: 'Google',
        icon: 'google',
        color: '#4285F4',
      };
    case 'github':
      return {
        name: 'GitHub',
        icon: 'github',
        color: '#333',
      };
    default:
      return {
        name: String(provider).charAt(0).toUpperCase() + String(provider).slice(1),
        icon: provider,
        color: '#555',
      };
  }
}; 