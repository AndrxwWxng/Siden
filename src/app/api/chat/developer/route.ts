import { mastra } from "@/mastra";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const developerAgent = mastra.getAgent("developerAgent");
  const stream = await developerAgent.stream(messages);
 
  return stream.toDataStreamResponse();
} 