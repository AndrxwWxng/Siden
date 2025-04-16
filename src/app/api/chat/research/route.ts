import { mastra } from "@/mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const researchAgent = mastra.getAgent("researchAgent");
  const stream = await researchAgent.stream(messages);
 
  return stream.toDataStreamResponse();
} 