import { mastra } from "@/mastra";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define valid agent IDs to match what's available in the system
type AgentId = 'weatherAgent' | 'ceoAgent' | 'marketingAgent' | 'developerAgent' | 
               'salesAgent' | 'productAgent' | 'financeAgent' | 'designAgent' | 'researchAgent';

// Try to delegate a task to another agent directly using mastra
async function delegateDirectly(targetAgentId: AgentId, prompt: string) {
  try {
    // Get the target agent directly from mastra
    const targetAgent = mastra.getAgent(targetAgentId);
    if (!targetAgent) {
      throw new Error(`Agent ${targetAgentId} not found`);
    }
    
    // Get response directly
    const response = await targetAgent.generate(prompt);
    return response.text;
  } catch (error) {
    console.error(`Error in direct delegation to ${targetAgentId}:`, error);
    return null;
  }
}

// Summarize findings with the CEO agent without mentioning delegation
async function summarizeWithCEO(originalQuery: string, findings: string) {
  try {
    const ceoAgent = mastra.getAgent("ceoAgent");
    const response = await ceoAgent.generate(
      `I need to respond about "${originalQuery}". 
      
      I have this information available:
      
      ${findings}
      
      Provide a comprehensive response that integrates this information naturally, as if it's your own expertise. 
      DO NOT mention delegation or that you worked with other team members to get this answer.
      Present the expertise as part of your own knowledge base.`
    );
    
    return response.text;
  } catch (error) {
    console.error("Error in CEO summarization:", error);
    return findings; // Fallback to just returning the raw findings
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const ceoAgent = mastra.getAgent("ceoAgent");
  
  // Check if the last user message is asking for research
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === 'user') {
    const content = typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : lastMessage.content.map((part: any) => part.text || '').join('');
    
    // Check if it's a research request
    const researchPattern = /research|find (out|information) about|look up|investigate|tell me about/i;
    if (researchPattern.test(content)) {
      try {
        // Create a clean research query
        const researchQuery = content.replace(/^(can you|please|could you|)\s*(research|tell me about|find out about|investigate|look up)\s*/i, '').trim();
        
        // Direct delegation to research agent
        const researchFindings = await delegateDirectly(
          'researchAgent',
          `Conduct research on the following topic and provide a comprehensive analysis: ${researchQuery}`
        );
        
        if (researchFindings) {
          // Have CEO summarize the findings
          const ceoResponse = await summarizeWithCEO(researchQuery, researchFindings);
          
          // Return as stream response
          return new Response(
            JSON.stringify({
              choices: [
                {
                  index: 0,
                  delta: { content: ceoResponse },
                  finish_reason: "stop"
                }
              ]
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
              },
            }
          );
        }
        throw new Error("Research delegation returned no results");
      } catch (error) {
        console.error("Research delegation failed:", error);
        
        // Create a fallback message for CEO agent explaining the situation
        const fallbackMessages = [
          ...messages.slice(0, -1),
          {
            role: 'user',
            content: `${content}
            
            [Note: I tried to get assistance from the Research team, but there was a technical issue. Please provide a response based on your general knowledge and mention the technical difficulty with the research team.]`
          }
        ];
        
        // Fall back to regular CEO agent response with context about the failure
        const stream = await ceoAgent.stream(fallbackMessages);
        return stream.toDataStreamResponse();
      }
    }
    
    // Check if it's a development request
    const devPattern = /(develop|create|build|code|program|implement|make|design|setup|set up|construct) .*(site|website|app|application|platform|system|page|webpage|landing page)/i;
    if (devPattern.test(content)) {
      try {
        // Check if we need design input too
        const designEmphasis = /(design|layout|ui|ux|visual|appearance|look and feel)/i;
        let devPrompt = content;
        
        if (designEmphasis.test(content)) {
          // Get design recommendations first
          const designFindings = await delegateDirectly(
            'designAgent',
            `The CEO has asked to design: ${content}. Please provide detailed design recommendations and visual concepts.`
          );
          
          if (designFindings) {
            // Include design recommendations in dev prompt
            devPrompt = `${content}\n\nThe Design team has provided these recommendations: ${designFindings}\n\nPlease implement this design with appropriate code.`;
          }
        }
        
        // Get developer implementation
        const devFindings = await delegateDirectly(
          'developerAgent',
          `The CEO has asked you to: ${devPrompt}. Please provide a detailed plan and initial code for this project.`
        );
        
        if (devFindings) {
          // Have CEO summarize the findings
          const ceoResponse = await summarizeWithCEO(content, devFindings);
          
          // Return as stream response
          return new Response(
            JSON.stringify({
              choices: [
                {
                  index: 0,
                  delta: { content: ceoResponse },
                  finish_reason: "stop"
                }
              ]
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
              },
            }
          );
        }
        throw new Error("Development delegation returned no results");
      } catch (error) {
        console.error("Development delegation failed:", error);
        
        // Create a fallback message
        const fallbackMessages = [
          ...messages.slice(0, -1),
          {
            role: 'user',
            content: `${content}
            
            [Note: I tried to coordinate with the Development and Design teams, but there was a technical issue. Please provide a response based on your general knowledge and mention the technical difficulty with the teams.]`
          }
        ];
        
        // Fall back to regular CEO agent
        const stream = await ceoAgent.stream(fallbackMessages);
        return stream.toDataStreamResponse();
      }
    }
    
    // Check if it's a marketing request
    const marketingPattern = /(marketing|promote|advertise|brand|content|social media|seo|audience)/i;
    if (marketingPattern.test(content)) {
      try {
        // Direct delegation to marketing agent
        const marketingFindings = await delegateDirectly(
          'marketingAgent',
          `The CEO has asked you to: ${content}. Please provide a comprehensive marketing strategy and content plan.`
        );
        
        if (marketingFindings) {
          // Have CEO summarize the findings
          const ceoResponse = await summarizeWithCEO(content, marketingFindings);
          
          // Return as stream response
          return new Response(
            JSON.stringify({
              choices: [
                {
                  index: 0,
                  delta: { content: ceoResponse },
                  finish_reason: "stop"
                }
              ]
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
              },
            }
          );
        }
        throw new Error("Marketing delegation returned no results");
      } catch (error) {
        console.error("Marketing delegation failed:", error);
        
        // Create a fallback message
        const fallbackMessages = [
          ...messages.slice(0, -1),
          {
            role: 'user',
            content: `${content}
            
            [Note: I tried to get assistance from the Marketing team, but there was a technical issue. Please provide a response based on your general knowledge and mention the technical difficulty with the marketing team.]`
          }
        ];
        
        // Fall back to regular CEO agent
        const stream = await ceoAgent.stream(fallbackMessages);
        return stream.toDataStreamResponse();
      }
    }
  }
  
  // Handle regular messages
  const stream = await ceoAgent.stream(messages);
  return stream.toDataStreamResponse();
}