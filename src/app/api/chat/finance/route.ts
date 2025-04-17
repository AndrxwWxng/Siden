import { mastra } from "@/mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const financeAgent = mastra.getAgent("financeAgent");
  const stream = await financeAgent.stream(messages);
 
  return stream.toDataStreamResponse();
} 