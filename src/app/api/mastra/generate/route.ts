import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/mastra';

export async function POST(request: NextRequest) {
  try {
    const { agentId, message } = await request.json();

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: agentId or message' },
        { status: 400 }
      );
    }

    // Get the specified agent from Mastra
    const agent = mastra.getAgent(agentId);
    
    if (!agent) {
      return NextResponse.json(
        { error: `Agent "${agentId}" not found` },
        { status: 404 }
      );
    }

    // Generate a response from the agent
    const result = await agent.generate(message);

    // Return the result
    return NextResponse.json({
      text: result.text,
      object: result.object
    });
  } catch (error) {
    console.error('Error in Mastra API route:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred processing your request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 