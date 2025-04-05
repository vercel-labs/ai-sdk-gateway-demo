"use client";

import { useChat } from "@ai-sdk/react";
import { useSearchParams } from "next/navigation";
import { ModelSelector } from "@/components/model-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const modelId = searchParams.get("modelId") || "xai/grok-2-1212";

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      modelId,
    },
  });

  return (
    <div className="grid w-screen h-screen grid-rows-[1fr_auto] max-w-[800px] m-auto">
      <div className="flex flex-col-reverse gap-8 p-8 overflow-y-auto">
        {messages.toReversed().map((m) =>
          m.role === "user" ? (
            <Card key={m.id} className="whitespace-pre-wrap">
              <CardContent className="p-3">{m.content}</CardContent>
            </Card>
          ) : (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.content}
            </div>
          )
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex justify-center px-8 pt-0 pb-8"
      >
        <Card className="w-full p-0">
          <CardContent className="flex items-center gap-3 p-2">
            <ModelSelector modelId={modelId} />

            <div className="flex flex-1 items-center">
              <Input
                name="prompt"
                placeholder="Type your message..."
                onChange={handleInputChange}
                value={input}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.metaKey && e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />

              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-8 w-8 ml-1"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
