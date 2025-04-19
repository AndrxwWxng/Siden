'use client';

/**
 * Client-side Mastra adapter for use in client components
 * Provides a typed API for communicating with server-side Mastra agents through API routes
 */

export async function callMastraAgent(agentId: string, message: string, options?: { metadata?: any }) {
  try {
    console.log(`[MASTRA CLIENT] Calling agent: ${agentId} with message length: ${message.length}`);
    
    // Get the base URL - either the current origin or the environment variable
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : (process.env.NEXT_PUBLIC_BASE_URL || '');
    
    // Try multiple endpoints in order, with the direct serverless function first
    const endpoints = [
      // Direct serverless function endpoint
      `${baseUrl}/api/mastra-generate`,
      // Standard Next.js API route
      `${baseUrl}/api/mastra/generate`,
      // Fallback API route
      `${baseUrl}/api/chat/${agentId.replace('Agent', '')}`
    ];
    
    let lastError: Error | null = null;
    
    // Try each endpoint in order
    for (const endpoint of endpoints) {
      try {
        console.log(`[MASTRA CLIENT] Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(
            endpoint.includes('chat') 
              ? { 
                  messages: [{ role: 'user', content: message }],
                  metadata: options?.metadata || {}
                }
              : { 
                  agentId, 
                  message,
                  metadata: options?.metadata || {}
                }
          ),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[MASTRA CLIENT] Successfully received response from ${endpoint}`);
          return {
            text: data.text || data.content || data.message || "Response received without content",
            object: data.object || null
          };
        }
        
        const errorText = await response.text();
        console.error(`[MASTRA CLIENT] HTTP Error from ${endpoint}: ${response.status} ${response.statusText}`);
        console.error(`[MASTRA CLIENT] Error Response Body:`, errorText);
        
        // Create an error object to throw if all endpoints fail
        lastError = new Error(`Error from ${endpoint}: ${response.status} ${response.statusText}`);
      } catch (error) {
        console.error(`[MASTRA CLIENT] Error with endpoint ${endpoint}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    
    // If all endpoints failed, throw the last error
    throw lastError || new Error('All endpoints failed');
  } catch (error) {
    console.error('[MASTRA CLIENT] Error calling Mastra agent:', error);
    return {
      text: `Sorry, there was an error communicating with the ${agentId}. Please try again later or contact support if the issue persists.`,
      error: true
    };
  }
}

// Typing for Mastra agent IDs to match the ones in the server-side implementation
export type MastraAgentId = 
  | 'weatherAgent' 
  | 'ceoAgent' 
  | 'marketingAgent' 
  | 'developerAgent'
  | 'salesAgent' 
  | 'productAgent' 
  | 'financeAgent' 
  | 'designAgent' 
  | 'researchAgent';

// Client-side implementation of the Mastra interface
const mastraClient = {
  getAgent: (agentId: MastraAgentId) => ({
    generate: async (message: string, options?: { metadata?: any }) => {
      const result = await callMastraAgent(agentId, message, options);
      return {
        text: result.text,
        object: result.object || null
      };
    }
  })
};

export default mastraClient; 