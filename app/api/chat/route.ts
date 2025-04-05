import { gateway } from "@vercel/ai-sdk-gateway";
import { streamText } from "ai";
import { DEFAULT_MODEL } from "@/lib/constants";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, modelId = DEFAULT_MODEL } = await req.json();

  const result = streamText({
    model: gateway(modelId),
    system: "You are a software engineer exploring Generative AI.",
    messages,
    onError: (error) => {
      console.error(error);
    },
  });

  return result.toDataStreamResponse();
}
