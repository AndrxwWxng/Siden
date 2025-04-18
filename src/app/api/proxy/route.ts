import { NextRequest, NextResponse } from 'next/server';

// Define Next.js config for API route - these ensure the route is always dynamic
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0; 
export const runtime = 'nodejs';

// This is a single proxy endpoint that will handle all agent requests
// It consolidates all the separate agent endpoints into a single one to avoid 405 errors
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { target, payload } = body;
    
    console.log(`[PROXY] Handling request for target: ${target}`);

    // Determine which internal API endpoint to call based on the target
    let internalEndpoint = '';
    let internalPayload;
    
    switch (target) {
      case 'developerAgent':
        internalEndpoint = '/api/chat/developer';
        // Format payload for developer agent endpoint
        internalPayload = {
          messages: Array.isArray(payload.messages) ? payload.messages : [{ role: 'user', content: payload.message || '' }]
        };
        break;
      
      case 'mastra/generate':
        internalEndpoint = '/api/mastra/generate';
        // Pass through the payload directly
        internalPayload = payload;
        break;
        
      default:
        // Default to mastra generate for other agent types
        internalEndpoint = '/api/mastra/generate';
        internalPayload = payload;
    }
    
    // Make the internal request - using the original URL's origin to ensure it's local
    const url = new URL(request.url);
    const internalUrl = `${url.origin}${internalEndpoint}`;
    
    console.log(`[PROXY] Forwarding to internal endpoint: ${internalUrl}`);
    
    // Make the internal request - this is server-to-server so CORS isn't an issue
    const internalResponse = await fetch(internalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Request': '1',  // Mark as internal to avoid infinite loops
      },
      body: JSON.stringify(internalPayload),
    });
    
    // If the internal request failed, log the error and return a generic error
    if (!internalResponse.ok) {
      console.error(`[PROXY] Internal request failed: ${internalResponse.status} ${internalResponse.statusText}`);
      const errorText = await internalResponse.text();
      console.error(`[PROXY] Error response body: ${errorText}`);
      
      return NextResponse.json(
        { 
          error: 'Failed to process request',
          details: `Internal endpoint returned ${internalResponse.status}` 
        }, 
        { status: 500 }
      );
    }
    
    // Return the internal response
    const data = await internalResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[PROXY] Error processing request:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// Implement OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Add GET method handler for direct browser requests and health checks
export async function GET() {
  return NextResponse.json({
    message: "API Proxy is running",
    status: "ok",
  });
}
