/**
 * Agent Tools Utility
 * Provides helper functions for AI agents to interact with connected services
 */
import { createClient } from '@/utils/supabase/server';

// Interface for the user identity with OAuth tokens
interface OAuthIdentity {
  provider: string;
  id: string;
  access_token?: string;
  scopes?: string[];
  expires_at?: number;
  [key: string]: any;
}

// Interface for the provider token data
interface ProviderToken {
  access_token: string;
  provider: string;
  scopes?: string[];
  expires_at?: number;
}

/**
 * Get a user's access token for a specific provider
 * @param userId The user's ID
 * @param provider The provider name ('google' or 'github')
 * @returns The provider token data or null if not available
 */
export async function getProviderToken(userId: string, provider: 'google' | 'github'): Promise<ProviderToken | null> {
  try {
    const supabase = await createClient();
    
    // Get the user's session to access provider tokens
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error || !data.user) {
      console.error('Error getting user:', error);
      return null;
    }
    
    // Find the provider in identities
    const identity = data.user.identities?.find(id => id.provider === provider) as OAuthIdentity | undefined;
    
    if (!identity || !identity.access_token) {
      console.log(`User has not connected ${provider} or no access token available`);
      return null;
    }
    
    // Extract token information from the identity data
    return {
      access_token: identity.access_token,
      provider: provider,
      scopes: identity.scopes,
      expires_at: identity.expires_at
    };
  } catch (error) {
    console.error(`Error getting ${provider} token:`, error);
    return null;
  }
}

/**
 * Helper for AI agents to access Google Drive, Sheets, and Docs
 * @param userId The user's ID
 * @returns Object with methods to interact with Google services
 */
export async function getGoogleHelper(userId: string) {
  const token = await getProviderToken(userId, 'google');
  
  if (!token) {
    return {
      isConnected: false,
      error: 'Google account not connected. Please ask the user to connect their Google account in settings.'
    };
  }
  
  return {
    isConnected: true,
    accessToken: token.access_token,
    
    // Drive methods
    async listDriveFiles(query = '', pageSize = 10) {
      try {
        const queryParams = new URLSearchParams({
          pageSize: pageSize.toString(),
          ...(query ? { q: query } : {})
        }).toString();
        
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Google API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error listing Drive files:', error);
        return { error: 'Failed to list Drive files' };
      }
    },
    
    // Sheets methods
    async getSpreadsheet(spreadsheetId: string) {
      try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
          headers: {
            'Authorization': `Bearer ${token.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Google Sheets API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting spreadsheet:', error);
        return { error: 'Failed to get spreadsheet' };
      }
    },
    
    async getSpreadsheetValues(spreadsheetId: string, range: string) {
      try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
          headers: {
            'Authorization': `Bearer ${token.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Google Sheets API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting spreadsheet values:', error);
        return { error: 'Failed to get spreadsheet values' };
      }
    },
    
    async updateSpreadsheetValues(spreadsheetId: string, range: string, values: any[][]) {
      try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values })
        });
        
        if (!response.ok) {
          throw new Error(`Google Sheets API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error updating spreadsheet values:', error);
        return { error: 'Failed to update spreadsheet values' };
      }
    },
    
    // Docs methods
    async getDocument(documentId: string) {
      try {
        const response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
          headers: {
            'Authorization': `Bearer ${token.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Google Docs API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting document:', error);
        return { error: 'Failed to get document' };
      }
    },
    
    async createDocument(title: string) {
      try {
        const response = await fetch('https://docs.googleapis.com/v1/documents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title })
        });
        
        if (!response.ok) {
          throw new Error(`Google Docs API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error creating document:', error);
        return { error: 'Failed to create document' };
      }
    },
    
    async updateDocument(documentId: string, requests: any[]) {
      try {
        const response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ requests })
        });
        
        if (!response.ok) {
          throw new Error(`Google Docs API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error updating document:', error);
        return { error: 'Failed to update document' };
      }
    }
  };
}

/**
 * Helper for AI agents to access GitHub repositories
 * @param userId The user's ID
 * @returns Object with methods to interact with GitHub API
 */
export async function getGitHubHelper(userId: string) {
  const token = await getProviderToken(userId, 'github');
  
  if (!token) {
    return {
      isConnected: false,
      error: 'GitHub account not connected. Please ask the user to connect their GitHub account in settings.'
    };
  }
  
  return {
    isConnected: true,
    accessToken: token.access_token,
    // GitHub API methods
    async listRepositories() {
      try {
        const response = await fetch('https://api.github.com/user/repos?sort=updated', {
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error listing repositories:', error);
        return { error: 'Failed to list repositories' };
      }
    },
    
    async getRepository(owner: string, repo: string) {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting repository:', error);
        return { error: 'Failed to get repository' };
      }
    },
    
    async getRepositoryContents(owner: string, repo: string, path: string) {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting repository contents:', error);
        return { error: 'Failed to get repository contents' };
      }
    },
    
    async createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string) {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            head,
            base,
            body
          })
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error creating pull request:', error);
        return { error: 'Failed to create pull request' };
      }
    }
  };
} 