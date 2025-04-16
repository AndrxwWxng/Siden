import { mastra } from "@/mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const productAgent = mastra.getAgent("productAgent");
  const stream = await productAgent.stream(messages);
 
  return stream.toDataStreamResponse();
} 