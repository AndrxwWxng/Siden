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
    
    const response = await fetch(`${baseUrl}/api/mastra/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        agentId, 
        message,
        metadata: options?.metadata || {}
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MASTRA CLIENT] HTTP Error: ${response.status} ${response.statusText}`);
      console.error(`[MASTRA CLIENT] Error Response Body:`, errorText);
      
      let errorMessage = `Error calling Mastra agent: ${response.statusText}`;
      try {
        // Try to parse as JSON if possible
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = `Error calling Mastra agent: ${errorJson.message}`;
        }
        if (errorJson.detailedError) {
          console.error(`[MASTRA CLIENT] Detailed Error:`, errorJson.detailedError);
        }
      } catch (e) {
        // If it's not valid JSON, use the text as is
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`[MASTRA CLIENT] Successfully received response from ${agentId}`);
    return data;
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