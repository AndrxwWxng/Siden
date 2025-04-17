'use client';

/**
 * Client-side Mastra adapter for use in client components
 * Provides a typed API for communicating with server-side Mastra agents through API routes
 */

export async function callMastraAgent(agentId: string, message: string) {
  try {
    const response = await fetch('/api/mastra/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agentId, message }),
    });

    if (!response.ok) {
      throw new Error(`Error calling Mastra agent: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Mastra agent:', error);
    return {
      text: `Sorry, there was an error communicating with the ${agentId}. Please try again later.`,
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
    generate: async (message: string) => {
      const result = await callMastraAgent(agentId, message);
      return {
        text: result.text,
        object: result.object || null
      };
    }
  })
};

export default mastraClient; 