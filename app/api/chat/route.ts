import { streamText } from "ai";
import { DEFAULT_MODEL } from "@/lib/constants";
import { gateway } from "@/lib/gateway";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, modelId = DEFAULT_MODEL } = await req.json();

  const result = streamText({
    model: gateway(modelId),
    system: "You are a software engineer exploring Generative AI.",
    messages,
    onError: (e) => {
      console.error(`Error while streaming: ${e}`);
    },
  });
  return result.toDataStreamResponse();
}
