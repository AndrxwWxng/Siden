import { mastra } from "@/mastra";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define the valid agent IDs based on what's available in the system
type AgentId = 'weatherAgent' | 'ceoAgent' | 'marketingAgent' | 'developerAgent' | 
               'salesAgent' | 'productAgent' | 'financeAgent' | 'designAgent' | 'researchAgent';

interface AgentRequest {
  requesterId: AgentId;
  targetAgentId: AgentId;
  prompt: string;
  originalQuery?: string;
}

export async function POST(req: Request) {
  try {
    const { requesterId, targetAgentId, prompt, originalQuery } = await req.json() as AgentRequest;
    
    // Get the agents
    const requesterAgent = mastra.getAgent(requesterId);
    const targetAgent = mastra.getAgent(targetAgentId);
    
    if (!requesterAgent || !targetAgent) {
      return Response.json({ 
        error: "One or more agents not found" 
      }, { status: 404 });
    }
    
    // Get response from target agent
    const targetResponse = await targetAgent.generate(prompt);
    
    // If there's an original query, have the requester agent summarize the response
    if (originalQuery) {
      const summary = await requesterAgent.generate(
        `You asked me about "${originalQuery}" and I delegated this to the ${targetAgent.name}. Here's what they found:
        
        ${targetResponse.text}
        
        Please provide a helpful response that integrates this information and acknowledges that you worked with the ${targetAgent.name} to get this answer.`
      );
      
      return Response.json({
        result: summary.text,
        rawResponse: targetResponse.text,
      });
    }
    
    // Otherwise just return the target agent's response
    return Response.json({
      result: targetResponse.text
    });
  } catch (error) {
    console.error("Error in agent-to-agent communication:", error);
    return Response.json({ 
      error: "An error occurred during agent-to-agent communication" 
    }, { status: 500 });
  }
} 