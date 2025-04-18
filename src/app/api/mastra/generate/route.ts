import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/mastra';
import OpenAI from 'openai';

// Define Next.js config for API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 30;

// Generate the CEO prompt based on available agents
function generateCEOPrompt(availableAgentIds: string[] = []) {
  // Always include the CEO
  if (!availableAgentIds.includes('ceo')) {
    availableAgentIds.push('ceo');
  }
  
  // Map of all possible agents with their descriptions
  const allAgents = {
    ceo: "Kenard (CEO) - Leads the overall strategy and vision",
    dev: "Alex (Developer) - Builds and implements technical solutions with expertise in full-stack development",
    marketing: "Chloe (Marketing Officer) - Creates and executes marketing strategies",
    product: "Mark (Product Manager) - Defines product vision and roadmap",
    sales: "Hannah (Sales Representative) - Converts leads into customers",
    finance: "Jenna (Finance Advisor) - Manages budgets and financial strategy",
    design: "Maisie (Designer) - Creates visuals and user experiences",
    research: "Garek (Research Analyst) - Gathers and analyzes market data"
  };
  
  // Filter to only include available agents
  const teamDescription = availableAgentIds
    .filter(id => allAgents[id as keyof typeof allAgents])
    .map((id, index) => `${index + 1}. ${allAgents[id as keyof typeof allAgents]}`)
    .join('\n');
  
  return `You are Kenard, the CEO and leader of an AI agent team. ${availableAgentIds.length > 1 ? 
    `Your team consists of the following agents that you can refer to and collaborate with:

${teamDescription}

When asked about your team, always refer to these specific roles rather than inventing new ones.` : 
    'You are currently the only agent available in this project.'}

Your role is to coordinate specialized agents and make strategic decisions. You should respond with a confident, decisive tone.`;
}

// Agent prompts for fallback mode
const agentPrompts = {
  ceoAgent: generateCEOPrompt(), // Default prompt with all agents - will be replaced dynamically
  
  developerAgent: `You are Alex, an expert Developer specialized in full-stack development and technical solutions. You are knowledgeable about web development, systems design, and software engineering best practices. Respond with a technically-oriented but friendly tone.`,
  
  marketingAgent: `You are Chloe, a creative and analytical Marketing Officer specialized in comprehensive marketing strategies. You're focused on content strategy, audience targeting, and campaign creation. Respond with a creative and data-driven tone.`,
  
  productAgent: `You are Mark, a Product Manager who defines product vision and roadmaps. Your expertise is in feature prioritization, user research, and roadmap planning. Respond with a user-centric, analytical tone.`,
  
  salesAgent: `You are Hannah, a Sales Representative who focuses on converting leads into customers. Your expertise is in lead qualification, demos/pitches, and relationship building. Respond with a persuasive, relationship-focused tone.`,
  
  financeAgent: `You are Jenna, a Finance Advisor who manages budgets and financial strategy. Your expertise is in budget planning, financial analysis, and investment strategy. Respond with a precise, numbers-oriented tone.`,
  
  designAgent: `You are Maisie, a Designer who creates visuals and user experiences. Your expertise is in UI/UX design, brand identity, and visual systems. Respond with a creative, aesthetically-oriented tone.`,
  
  researchAgent: `You are Garek, a Research Analyst who gathers and analyzes market data. Your expertise is in competitive analysis, market trends, and user insights. Respond with a methodical, data-rich tone.`,
  
  weatherAgent: `You are a helpful weather assistant that provides accurate weather information and forecasts.`
};

// OpenAI client for fallback
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback function to use OpenAI directly if Mastra fails
async function openAIFallback(agentId: string, message: string, metadata?: any) {
  console.log(`[FALLBACK] Using OpenAI directly for agent: ${agentId}`);
  
  // Get the appropriate system prompt
  let systemPrompt = agentPrompts[agentId as keyof typeof agentPrompts] || agentPrompts.ceoAgent;
  
  // If this is the CEO agent and we have available agent IDs, generate a custom prompt
  if (agentId === 'ceoAgent' && metadata?.availableAgentIds) {
    systemPrompt = generateCEOPrompt(metadata.availableAgentIds);
  }
  
  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  
  return {
    text: response.choices[0].message.content || 'No response generated',
    object: null
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('[MASTRA API] Starting request processing');
    
    const { agentId, message, metadata } = await request.json();
    console.log(`[MASTRA API] Received request for agent: ${agentId}`, metadata ? 'with metadata' : '');

    if (!agentId || !message) {
      console.log('[MASTRA API] Missing fields:', { agentId, message });
      return NextResponse.json(
        { error: 'Missing required fields: agentId or message' },
        { status: 400 }
      );
    }

    try {
      // Try to use Mastra
      console.log(`[MASTRA API] Getting agent: ${agentId}`);
      const agent = mastra.getAgent(agentId);
      
      if (!agent) {
        console.log(`[MASTRA API] Agent not found: ${agentId}, using fallback`);
        const fallbackResult = await openAIFallback(agentId, message, metadata);
        return NextResponse.json(fallbackResult);
      }

      // For CEO agent, update the system prompt if we have available agent information
      if (agentId === 'ceoAgent' && metadata?.availableAgentIds) {
        // Update the agentPrompts entry dynamically based on available agents
        agentPrompts.ceoAgent = generateCEOPrompt(metadata.availableAgentIds);
      }

      // Generate a response from the agent
      console.log(`[MASTRA API] Generating response with agent: ${agentId}`);
      const result = await agent.generate(message);
      console.log(`[MASTRA API] Successfully generated response`);

      // Return the result
      return NextResponse.json({
        text: result.text,
        object: result.object
      });
    } catch (mastraError) {
      // If Mastra fails, use the OpenAI fallback
      console.error('[MASTRA API] Error with Mastra, using fallback:', mastraError);
      const fallbackResult = await openAIFallback(agentId, message, metadata);
      return NextResponse.json(fallbackResult);
    }
  } catch (error) {
    console.error('[MASTRA API] Error in API route:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('[MASTRA API] Error name:', error.name);
      console.error('[MASTRA API] Error message:', error.message);
      console.error('[MASTRA API] Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'An error occurred processing your request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS method handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}

// Add GET method handler for direct browser requests
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "This API endpoint requires a POST request with agent information.",
    status: "ok",
    endpoint: "mastra/generate"
  });
} 