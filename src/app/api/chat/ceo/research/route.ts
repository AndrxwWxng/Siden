import { mastra } from "@/mastra";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { query } = await req.json();
  
  try {
    // Get the agents
    const ceoAgent = mastra.getAgent("ceoAgent");
    const researchAgent = mastra.getAgent("researchAgent");
    
    // Step 1: CEO formulates the research request (internally)
    const ceoPrompt = `I need to research this topic: "${query}". 
    Create a detailed research request that would help gather comprehensive information.`;
    
    const ceoResponse = await ceoAgent.generate(ceoPrompt);
    const researchRequest = ceoResponse.text;
    
    // Step 2: Research agent conducts the research
    const researchResponse = await researchAgent.generate(researchRequest);
    const researchFindings = researchResponse.text;
    
    // Step 3: CEO reviews and presents the findings as their own expertise
    const summaryPrompt = `I need to respond about "${query}".
    
    I have the following research information:
    
    ${researchFindings}
    
    Provide a comprehensive response that integrates this information naturally, as if it's your own expertise.
    DO NOT mention that you delegated research or worked with a research team.
    Present the expertise as part of your own knowledge base, as the CEO.`;
    
    const summaryResponse = await ceoAgent.generate(summaryPrompt);
    
    return Response.json({
      summary: summaryResponse.text,
      detailedFindings: researchFindings,
      originalRequest: researchRequest
    });
  } catch (error) {
    console.error("Research request failed:", error);
    return Response.json({ 
      error: "An error occurred while processing the research request" 
    }, { status: 500 });
  }
} 