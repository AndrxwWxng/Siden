/**
 * Client-side helper for agent delegation
 * This file provides utility functions to handle direct agent-to-agent communication
 */

// Valid agent IDs in the system (client-side IDs)
type AgentId = 'ceo' | 'marketing' | 'developer' | 
              'sales' | 'product' | 'finance' | 'design' | 'research';

interface DelegationRequest {
  requesterId: AgentId;
  targetAgentId: AgentId;
  prompt: string;
  originalQuery?: string;
}

interface DelegationResponse {
  result: string;
  rawResponse?: string;
  error?: string;
}

/**
 * Delegates a task from one agent to another
 * @param request The delegation request
 * @returns The delegation response
 */
export async function delegateTask(request: DelegationRequest): Promise<DelegationResponse> {
  try {
    const response = await fetch('/api/agent-to-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`Delegation failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error during task delegation:", error);
    return {
      result: `Error delegating task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Helper function to delegate research tasks to the Research Agent
 * @param query The research query
 * @param requesterId The ID of the requesting agent (defaults to CEO)
 * @returns The delegation response
 */
export async function delegateResearch(query: string, requesterId: AgentId = 'ceo'): Promise<DelegationResponse> {
  return delegateTask({
    requesterId,
    targetAgentId: 'research',
    prompt: `Conduct research on the following topic and provide a comprehensive analysis: ${query}`,
    originalQuery: query
  });
}

/**
 * Helper function to delegate development tasks to the Developer Agent
 * @param task The development task
 * @param requesterId The ID of the requesting agent (defaults to CEO)
 * @returns The delegation response
 */
export async function delegateDevelopment(task: string, requesterId: AgentId = 'ceo'): Promise<DelegationResponse> {
  return delegateTask({
    requesterId,
    targetAgentId: 'developer',
    prompt: `The ${requesterId} has asked you to ${task}. Please provide a detailed plan and initial code for this project, including technology stack recommendations and implementation details.`,
    originalQuery: task
  });
}

/**
 * Helper function to delegate design tasks to the Design Agent
 * @param task The design task
 * @param requesterId The ID of the requesting agent (defaults to CEO)
 * @returns The delegation response
 */
export async function delegateDesign(task: string, requesterId: AgentId = 'ceo'): Promise<DelegationResponse> {
  return delegateTask({
    requesterId,
    targetAgentId: 'design',
    prompt: `The ${requesterId} has asked you to design ${task}. Please provide detailed design recommendations and visual concepts.`,
    originalQuery: task
  });
}

/**
 * Helper function to delegate marketing tasks to the Marketing Agent
 * @param task The marketing task
 * @param requesterId The ID of the requesting agent (defaults to CEO)
 * @returns The delegation response
 */
export async function delegateMarketing(task: string, requesterId: AgentId = 'ceo'): Promise<DelegationResponse> {
  return delegateTask({
    requesterId,
    targetAgentId: 'marketing',
    prompt: `The ${requesterId} has asked you to ${task}. Please provide a comprehensive marketing strategy and content plan.`,
    originalQuery: task
  });
}

/**
 * Detects what type of task this is and delegates to the appropriate agent
 * @param query The user query
 * @param requesterId The ID of the requesting agent
 * @param availableAgents Optional array of available agent IDs to consider for delegation
 * @returns The delegation response or null if no delegation was performed
 */
export async function detectAndDelegate(
  query: string, 
  requesterId: AgentId = 'ceo',
  availableAgents?: string[]
): Promise<DelegationResponse | null> {
  // Filter functions based on available agents if provided
  const canDelegateToAgent = (agentId: string): boolean => {
    if (!availableAgents || availableAgents.length === 0) return true;
    return availableAgents.includes(agentId);
  };

  // Check if it's a research request
  const researchPattern = /research|find (out|information) about|look up|investigate|tell me about/i;
  if (researchPattern.test(query) && canDelegateToAgent('research')) {
    const cleanQuery = query.replace(/^(can you|please|could you|)\s*(research|tell me about|find out about|investigate|look up)\s*/i, '').trim();
    return delegateResearch(cleanQuery, requesterId);
  }
  
  // Check if it's a development request - expanded to catch more phrases
  const devPattern = /(develop|create|build|code|program|implement|make|design|setup|set up|construct) .*(site|website|app|application|platform|system|page|webpage|landing page)/i;
  if (devPattern.test(query) && canDelegateToAgent('developer')) {
    // If the request also mentions design a lot, delegate to both developer and design
    const designEmphasis = /(design|layout|ui|ux|visual|appearance|look and feel)/i;
    if (designEmphasis.test(query) && canDelegateToAgent('design')) {
      try {
        // First get design recommendations
        const designResponse = await delegateDesign(query, requesterId);
        
        // Then pass design recommendations to the developer
        const devPrompt = `${query}\n\nThe Design Agent has provided these design recommendations: ${designResponse.result}\n\nPlease implement this design with appropriate code.`;
        
        return delegateDevelopment(devPrompt, requesterId);
      } catch (error) {
        console.error("Multi-agent delegation failed:", error);
        // Fallback to just developer
        return delegateDevelopment(query, requesterId);
      }
    }
    
    return delegateDevelopment(query, requesterId);
  }
  
  // Check if it's a design-specific request
  const designPattern = /(design|layout|ui|ux|visual|appearance|look and feel|mockup|wireframe).*(site|website|app|application|platform|system|page|webpage|landing page)/i;
  if (designPattern.test(query) && !devPattern.test(query) && canDelegateToAgent('design')) {
    return delegateDesign(query, requesterId);
  }
  
  // Check if it's a marketing request
  const marketingPattern = /(marketing|promote|advertise|brand|content|social media|seo|audience)/i;
  if (marketingPattern.test(query) && canDelegateToAgent('marketing')) {
    return delegateMarketing(query, requesterId);
  }
  
  // No delegation performed
  return null;
} 