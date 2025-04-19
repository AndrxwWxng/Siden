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
    
    // First try with the primary endpoint
    try {
      console.log(`[MASTRA CLIENT] Making POST request to ${baseUrl}/api/mastra/generate`);
      
      const response = await fetch(`${baseUrl}/api/mastra/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          agentId, 
          message,
          metadata: options?.metadata || {}
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[MASTRA CLIENT] Successfully received response from ${agentId}`);
        return data;
      }
      
      const errorText = await response.text();
      console.error(`[MASTRA CLIENT] HTTP Error: ${response.status} ${response.statusText}`);
      console.error(`[MASTRA CLIENT] Error Response Body:`, errorText);
      
      // If we got a 405 error, try the fallback endpoint
      if (response.status === 405) {
        throw new Error(`405 Method Not Allowed, trying fallback endpoint`);
      }
      
      // For other errors, process normally
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
    } catch (error) {
      // If primary endpoint fails with 405, try the API route directly
      console.log(`[MASTRA CLIENT] Primary endpoint failed, trying fallback: ${error}`);
      
      // Try the fallback endpoint via /api/chat/{agent}
      const apiPath = `/api/chat/${agentId.replace('Agent', '')}`;
      const apiUrl = `${baseUrl}${apiPath}`;
      
      console.log(`[MASTRA CLIENT] Making POST request to fallback endpoint: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: message }],
          metadata: options?.metadata || {}
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[MASTRA CLIENT] Successfully received response from fallback endpoint`);
        return { 
          text: data.text || data.content || data.message || "Response received but no content found.",
          object: data.object || null
        };
      }
      
      // If fallback also fails, throw the original error
      throw error;
    }
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