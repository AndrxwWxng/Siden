'use client';

/**
 * Client-side Mastra adapter for use in client components
 * Provides a typed API for communicating with server-side Mastra agents through API routes
 */

export async function callMastraAgent(agentId: string, message: string, options?: { metadata?: any }) {
  try {
    console.log(`[MASTRA CLIENT] Calling agent: ${agentId} with message length: ${message.length}`);
    
    // Create the request URL with a cache-busting parameter
    const timestamp = Date.now();
    const url = `/api/mastra/generate?t=${timestamp}`;
    
    // Fix for Vercel production: ensure proper absolute URL handling
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const apiUrl = baseUrl ? `${baseUrl}${url}` : url;
    
    // Try a direct POST request first
    let response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache',
      },
      body: JSON.stringify({ 
        agentId, 
        message,
        metadata: options?.metadata || {}
      }),
      cache: 'no-store',
    });

    // If we get a 405, try an OPTIONS request first to warm up the endpoint
    if (response.status === 405) {
      console.log('[MASTRA CLIENT] Received 405 error, attempting OPTIONS preflight...');
      
      // Make an OPTIONS request first
      await fetch(apiUrl, { 
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Accept, X-Requested-With',
        }
      });
      
      // Wait a moment for the route to be properly initialized
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try the POST request again
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store',
        },
        body: JSON.stringify({ 
          agentId, 
          message,
          metadata: options?.metadata || {}
        }),
        cache: 'no-store',
      });
    }

    // If the response contains a database connection error, try the direct OpenAI fallback
    if (response.status === 500) {
      const errorText = await response.text();
      if (errorText.includes('ENOTFOUND') || errorText.includes('database') || errorText.includes('supabase')) {
        console.error('[MASTRA CLIENT] Database connection error detected, using direct OpenAI fallback');
        
        // Use a direct OpenAI fallback from the client if possible
        try {
          // Try the generate route with a fallback querystring param
          response = await fetch(`${apiUrl}&fallback=true`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ 
              agentId, 
              message,
              metadata: {
                ...options?.metadata || {},
                forceFallback: true
              }
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            return data;
          }
        } catch (fallbackError) {
          console.error('[MASTRA CLIENT] Direct fallback failed:', fallbackError);
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MASTRA CLIENT] HTTP Error: ${response.status} `);
      console.error(`[MASTRA CLIENT] Error Response Body:`, errorText);
      
      let errorMessage = `Error calling Mastra agent:`;
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