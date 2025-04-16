import { mastra } from "@/mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const salesAgent = mastra.getAgent("salesAgent");
  const stream = await salesAgent.stream(messages);
 
  return stream.toDataStreamResponse();
} 