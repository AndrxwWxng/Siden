import { mastra } from "@/mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const designAgent = mastra.getAgent("designAgent");
  const stream = await designAgent.stream(messages);
 
  return stream.toDataStreamResponse();
} 