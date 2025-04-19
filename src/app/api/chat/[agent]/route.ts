import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define Next.js config for API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

// OpenAI client for fallback
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Agent prompts for chat route
const agentPrompts = {
  ceo: `You are Kenard, the CEO and leader of an AI agent team. You coordinate specialized agents and make strategic decisions. You should respond with a confident, decisive tone.`,
  
  developer: `You are Alex, an expert Developer specialized in full-stack development and technical solutions. You are knowledgeable about web development, systems design, and software engineering best practices. Respond with a technically-oriented but friendly tone.`,
  
  marketing: `You are Chloe, a creative and analytical Marketing Officer specialized in comprehensive marketing strategies. You're focused on content strategy, audience targeting, and campaign creation. Respond with a creative and data-driven tone.`,
  
  product: `You are Mark, a Product Manager who defines product vision and roadmaps. Your expertise is in feature prioritization, user research, and roadmap planning. Respond with a user-centric, analytical tone.`,
  
  sales: `You are Hannah, a Sales Representative who focuses on converting leads into customers. Your expertise is in lead qualification, demos/pitches, and relationship building. Respond with a persuasive, relationship-focused tone.`,
  
  finance: `You are Jenna, a Finance Advisor who manages budgets and financial strategy. Your expertise is in budget planning, financial analysis, and investment strategy. Respond with a precise, numbers-oriented tone.`,
  
  design: `You are Maisie, a Designer who creates visuals and user experiences. Your expertise is in UI/UX design, brand identity, and visual systems. Respond with a creative, aesthetically-oriented tone.`,
  
  research: `You are Garek, a Research Analyst who gathers and analyzes market data. Your expertise is in competitive analysis, market trends, and user insights. Respond with a methodical, data-rich tone.`,
  
  weather: `You are a helpful weather assistant that provides accurate weather information and forecasts.`
};

export async function POST(request: NextRequest, { params }: { params: { agent: string } }) {
  try {
    const agentId = params.agent;
    console.log(`[API CHAT] Received request for agent: ${agentId}`);

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('[API CHAT] Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Extract messages
    const messages = body.messages || [];
    if (!messages.length) {
      return NextResponse.json(
        { error: 'Missing required field: messages' },
        { status: 400 }
      );
    }

    // Get the most recent user message
    const userMessage = messages.filter(m => m.role === 'user').pop()?.content;
    if (!userMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    // Get the appropriate system prompt
    const systemPrompt = agentPrompts[agentId as keyof typeof agentPrompts] || agentPrompts.ceo;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-5) // Include last 5 messages for context
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = response.choices[0].message.content || 'No response generated';
    
    return NextResponse.json({
      text: responseText,
      content: responseText, // For compatibility
      message: responseText, // For compatibility
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Cache-Control': 'no-store, no-cache',
      }
    });
  } catch (error) {
    console.error('[API CHAT] Error in API route:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred processing your request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500, 
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS, GET'
        }
      }
    );
  }
}

// Add OPTIONS method handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  console.log('[API CHAT OPTIONS] Handling OPTIONS request');
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}

// Add GET method handler for direct browser requests
export async function GET(request: NextRequest, { params }: { params: { agent: string } }) {
  console.log(`[API CHAT GET] Handling GET request for agent: ${params.agent}`);
  return NextResponse.json({
    message: `This API endpoint requires a POST request with chat messages for the ${params.agent} agent.`,
    status: "ok",
    agent: params.agent
  });
} 