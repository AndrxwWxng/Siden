import { mastra } from "@/mastra";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
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
      
      return stream.toDataStreamResponse();
    } catch (error: unknown) {
      console.error('Error streaming from developer agent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      
      return new Response(JSON.stringify({ 
        error: 'Agent streaming error', 
        details: errorMessage,
        code: 'AGENT_STREAM_ERROR'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
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