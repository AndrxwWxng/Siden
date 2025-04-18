import { openai } from '@ai-sdk/openai';
import { papersVectorQueryTool } from '@/mastra/storage';
import { NextResponse } from 'next/server';

// Check if we're in a build/static environment
const isBuildEnvironment = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const isVercelBuild = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production';

// This API route handles CEO research queries
export async function POST(request) {
  // Return static mock response during build to prevent telemetry errors
  if (isBuildEnvironment) {
    console.log('[Build] Returning mock CEO research response');
    return NextResponse.json({
      status: 'success',
      message: 'This is a static build-time response. The actual AI response will be available in production.',
      mockBuildResponse: true
    });
  }
  
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      );
    }
    
    // Use the vector query tool to search for research papers
    const queryResults = await papersVectorQueryTool.execute({
      query: query,
      topK: 3
    });
    
    // Generate a response using OpenAI
    const model = openai('gpt-4o-mini');
    const completion = await model.complete({
      messages: [
        { role: 'system', content: 'You are a CEO research assistant. You analyze research papers and provide insights for executive decision making. Be concise and focus on business implications.' },
        { role: 'user', content: `I need insights on the following research query: ${query}. Here are some relevant research papers I found:\n\n${JSON.stringify(queryResults.results, null, 2)}` }
      ],
      max_tokens: 500
    });
    
    return NextResponse.json({
      status: 'success',
      query: query,
      results: queryResults.results,
      response: completion.content
    });
  } catch (error) {
    console.error('CEO research API error:', error);
    return NextResponse.json(
      { error: 'Failed to process research query', details: error.message },
      { status: 500 }
    );
  }
} 