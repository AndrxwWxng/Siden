// This file has been deprecated in favor of /api/agent-to-agent/route.ts
// which provides a more direct and reliable agent-to-agent communication mechanism.
// Keeping this file for reference, but it should not be used in production.

import { mastra } from "@/mastra";
import { Step } from "@mastra/core/workflows";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Return a message indicating this endpoint is deprecated
  return Response.json({
    error: "This endpoint is deprecated. Please use /api/agent-to-agent instead.",
    details: "We've replaced this workflow-based delegation with a more direct agent-to-agent communication mechanism."
  }, { status: 410 }); // 410 Gone status code
} 