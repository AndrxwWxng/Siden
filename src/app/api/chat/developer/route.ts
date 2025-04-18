import { mastra } from "@/mastra";
import { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define Next.js config for API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Simple in-memory request tracking
const recentRequests = new Map<string, { timestamp: number, response?: any }>();
const REQUEST_THROTTLE_MS = 1000; // 1 second minimum between identical requests

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Check if this is an implementation request
    const lastMessage = messages[messages.length - 1];
    const content = typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : JSON.stringify(lastMessage.content);
    
    // For implementation requests, add implementation-focused system message
    if (content.toLowerCase().includes('immediately') || 
        content.toLowerCase().includes('right now') || 
        content.toLowerCase().includes('rn') ||
        content.toLowerCase().includes('make') && content.toLowerCase().includes('landing page')) {
      
      // Add implementation-focused system message
      messages.unshift({
        role: 'system',
        content: `IMPORTANT: You are Alex, the Developer. Your task is to IMMEDIATELY CREATE CODE without asking clarifying questions. 
        Focus on producing working implementation right away. Do not discuss, plan, or ask questions.
        Always start with full HTML, CSS, and JavaScript code for the requested feature.
        Skip explanations until after you've shown the implementation.
        The user needs this delivered NOW - be concise, practical, and focused on delivering code.`
      });
    }
    
    // Create a hash of the last message to identify potential duplicates
    const requestHash = content.substring(0, 100) || 'unknown';
    const requestKey = `developer-${requestHash}`;
    
    // Check if this is a very recent duplicate request
    const now = Date.now();
    const recentRequest = recentRequests.get(requestKey);
    
    if (recentRequest && (now - recentRequest.timestamp < REQUEST_THROTTLE_MS)) {
      console.log('Developer Agent: Detected duplicate request within throttle window');
      
      // If we already have a response for this request, return it
      if (recentRequest.response) {
        console.log('Developer Agent: Returning cached response');
        return recentRequest.response;
      }
      
      // Otherwise wait a bit to prevent race conditions
      console.log('Developer Agent: Throttling duplicate request');
      await new Promise(resolve => setTimeout(resolve, REQUEST_THROTTLE_MS));
    }
    
    // Record this request
    recentRequests.set(requestKey, { timestamp: now });
    
    // Clean up old requests (keep last 50)
    if (recentRequests.size > 50) {
      const keys = Array.from(recentRequests.keys());
      for (let i = 0; i < keys.length - 50; i++) {
        recentRequests.delete(keys[i]);
      }
    }
    
    // Enhanced debugging for multimodal content
    console.log('Developer Agent received messages:', 
      JSON.stringify(messages.map((m: any) => ({
        role: m.role,
        contentType: typeof m.content,
        isArray: Array.isArray(m.content),
        length: Array.isArray(m.content) ? m.content.length : (typeof m.content === 'string' ? m.content.length : 'unknown'),
        contentSample: Array.isArray(m.content) 
          ? m.content.map((part: any) => ({ type: part.type, dataLength: part.data ? part.data.substring(0, 20) + '...' : 'no data' }))
          : (typeof m.content === 'string' ? m.content.substring(0, 30) + '...' : 'non-string content')
      })))
    );
    
    // Prevent any potential modifications to the original messages
    const processedMessages = [...messages];
    
    try {
      const developerAgent = mastra.getAgent("developerAgent");
      if (!developerAgent) {
        throw new Error("Developer agent not found");
      }
      
      const stream = await developerAgent.stream(processedMessages);
      const response = stream.toDataStreamResponse();
      
      // Store the response for potential reuse
      recentRequests.set(requestKey, { 
        timestamp: now, 
        response: response.clone() 
      });
      
      return response;
    } catch (error: unknown) {
      console.error('Error streaming from developer agent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      
      const errorResponse = new Response(JSON.stringify({ 
        error: 'Agent streaming error', 
        details: errorMessage,
        code: 'AGENT_STREAM_ERROR'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Store the error response for potential reuse
      recentRequests.set(requestKey, {
        timestamp: now,
        response: errorResponse.clone()
      });
      
      return errorResponse;
    }
  } catch (error: unknown) {
    console.error('Error in developer agent API route:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request', 
      details: error instanceof Error ? error.message : 'Unknown error',
      code: 'REQUEST_PROCESSING_ERROR'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Add OPTIONS method handler for CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
} 