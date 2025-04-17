import { mastra } from "@/mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const marketingAgent = mastra.getAgent("marketingAgent");
  const stream = await marketingAgent.stream(messages);
 
  return stream.toDataStreamResponse();
}