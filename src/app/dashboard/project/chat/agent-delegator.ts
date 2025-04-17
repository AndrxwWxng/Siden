/**
 * Client-side helper for agent delegation
 * This file provides utility functions to handle direct agent-to-agent communication
 */

'use client';

import mastraClient from '@/lib/mastraClient';

// Valid agent IDs in the system (client-side IDs)
type AgentId = 'ceo' | 'marketing' | 'developer' | 
              'sales' | 'product' | 'finance' | 'design' | 'research';

interface DelegationRequest {
  requesterId: AgentId;
  targetAgentId: AgentId;
  prompt: string;
  originalQuery?: string;
  availableAgentIds?: string[];
}

interface DelegationResponse {
  result: string;
  rawResponse?: string;
  error?: string;
}

// Map from role IDs to agent IDs that match the server-side Mastra implementation
const roleToAgentId: Record<string, string> = {
  ceo: 'ceoAgent',
  dev: 'developerAgent',
  marketing: 'marketingAgent',
  product: 'productAgent',
  sales: 'salesAgent',
  finance: 'financeAgent',
  design: 'designAgent',
  research: 'researchAgent',
};

// Track pending requests to prevent duplicates
const pendingRequests = new Map<string, Promise<any>>();

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
    prompt: `Research this topic thoroughly and provide a comprehensive analysis: ${query}`,
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
    prompt: `${task}
    
    Provide a detailed technical plan and initial code for this project, including technology stack recommendations and implementation details.`,
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
    prompt: `${task}
    
    Provide detailed design recommendations and visual concepts for this request.`,
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
    prompt: `${task}
    
    Provide a comprehensive marketing strategy and content plan.`,
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

/**
 * Detect which agent should handle a message and delegate to that agent
 * Added request deduplication to prevent duplicate responses
 * @param message The user message
 * @param currentAgent The current agent ID
 * @param availableAgentIds Optional array of available agent IDs in the project
 */
export async function detectAndDelegateMessage(
  message: string, 
  currentAgent: string = 'ceo',
  availableAgentIds?: string[]
) {
  // Get the corresponding agent ID for the current role
  const agentId = roleToAgentId[currentAgent] || 'ceoAgent';
  
  // Handle direct delegation requests from user (like "ask Chloe to...")
  if (currentAgent === 'ceo') {
    // Detect requests to ask another agent to do something
    const askPattern = /(?:ask|have|get|tell)\s+(alex|chloe|mark|hannah|jenna|maisie|garek)\s+to\s+(.+)/i;
    const match = message.match(askPattern);
    
    if (match) {
      const targetName = match[1].toLowerCase();
      const task = match[2];
      
      // Map from first names to agent IDs
      const nameToAgentId: Record<string, string> = {
        'alex': 'dev',
        'chloe': 'marketing',
        'mark': 'product',
        'hannah': 'sales',
        'jenna': 'finance',
        'maisie': 'design',
        'garek': 'research'
      };
      
      const targetAgentId = nameToAgentId[targetName];
      
      // Check if the target agent is available
      if (targetAgentId && (!availableAgentIds || availableAgentIds.includes(targetAgentId))) {
        console.log(`[AGENT DELEGATOR] Detected request to delegate to ${targetAgentId}: "${task}"`);
        
        try {
          // First, create a direct instruction from CEO to the target agent (not shown to user)
          const delegationPrompt = `
          I need you to ${task}
          
          Complete this task directly without explanations or mentioning our communication.
          Provide only the results as if you're directly responding to the user's request.
          `;
          
          // Call the target agent directly
          const targetAgentMastraId = roleToAgentId[targetAgentId];
          const targetResponse = await mastraClient.getAgent(targetAgentMastraId as any).generate(delegationPrompt);
          
          // Create a response that makes it look like the CEO coordinated this behind the scenes
          const finalResponse = {
            text: targetResponse.text
          };
          
          return finalResponse;
        } catch (error) {
          console.error(`[AGENT DELEGATOR] Error delegating to ${targetAgentId}:`, error);
        }
      }
    }
    
    // Direct implementation requests to the developer without CEO planning
    if (message.toLowerCase().includes('make') || 
        message.toLowerCase().includes('create') || 
        message.toLowerCase().includes('build') || 
        message.toLowerCase().includes('develop') || 
        message.toLowerCase().includes('landing page') ||
        message.toLowerCase().includes('site') ||
        message.toLowerCase().includes('rn') ||
        message.toLowerCase().includes('right now')) {
      
      // Check if dev agent is available
      if (!availableAgentIds || availableAgentIds.includes('dev')) {
        console.log(`[AGENT DELEGATOR] Directly delegating to developer from CEO`);
        
        try {
          // Developer implementation - skip planning and go straight to implementation
          const devPrompt = `
          IMPORTANT: Do not ask questions. Immediately start implementing based on what you know.
          
          You need to create ${message} immediately. Do not waste time asking questions or planning.
          Start by showing the HTML, CSS and JavaScript code for a modern, responsive implementation.
          
          Focus on actual implementation, not discussion. The CEO needs this delivered NOW.
          
          Show complete code that can be used right away. Make sure it's visually appealing and functional.
          `;
          
          const requestKey = `developerAgent:implementation:${Date.now()}`;
          
          const developerResponse = await mastraClient.getAgent('developerAgent').generate(devPrompt);
          
          // Have the CEO deliver the developer's response as if they coordinated it behind the scenes
          const ceoDeliveryPrompt = `
          The developer has created the implementation requested. Here is what they built:
          
          ${developerResponse.text}
          
          Deliver this response directly without mentioning working with a developer. Just say "Here's the implementation" 
          and present the code as if you coordinated this yourself. Don't add commentary about teamwork.
          `;
          
          // Create the promise for this request
          const requestPromise = mastraClient.getAgent('ceoAgent').generate(ceoDeliveryPrompt, {
            metadata: {
              availableAgentIds: availableAgentIds || []
            }
          });
          
          return await requestPromise;
        } catch (error) {
          console.error(`[AGENT DELEGATOR] Error in direct developer delegation:`, error);
        }
      }
    }
  }
  
  // Create a unique key for this request to prevent duplicates
  const requestKey = `${agentId}:${message}`;
  
  try {
    // Check if we already have a pending request for this exact message and agent
    if (pendingRequests.has(requestKey)) {
      console.log(`[AGENT DELEGATOR] Using existing request for ${agentId}`);
      return await pendingRequests.get(requestKey);
    }
    
    // Create the promise for this request
    console.log(`[AGENT DELEGATOR] Creating new request for ${agentId}`);
    const requestPromise = mastraClient.getAgent(agentId as any).generate(message, {
      metadata: {
        availableAgentIds: availableAgentIds || []
      }
    })
      .then(response => {
        // On successful completion, remove from pending requests
        pendingRequests.delete(requestKey);
        return response;
      })
      .catch(error => {
        // On error, also remove from pending and return error response
        pendingRequests.delete(requestKey);
        console.error(`[AGENT DELEGATOR] Error delegating to ${agentId}:`, error);
        return {
          text: `Sorry, there was an error communicating with the ${currentAgent} agent. Please try again later.`
        };
      });
    
    // Store the promise so we can reuse it for duplicate requests
    pendingRequests.set(requestKey, requestPromise);
    
    // Wait for and return the result
    return await requestPromise;
  } catch (error) {
    pendingRequests.delete(requestKey);
    console.error(`[AGENT DELEGATOR] Unexpected error with ${agentId}:`, error);
    return {
      text: `Sorry, there was an error communicating with the ${currentAgent} agent. Please try again later.`
    };
  }
} 