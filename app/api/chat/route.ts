import { gateway } from "@vercel/ai-sdk-gateway";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: gateway("xai/grok-2-1212"),
    system: "You are a helpful assistant.",
    messages,
  });
  return result.toDataStreamResponse();
}
