"use client";

import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { ModelSelector } from "@/components/model-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { DEFAULT_MODEL } from "@/lib/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { defaultChatStore } from "ai";
import { cn } from "@/lib/utils";

function ModelSelectorHandler({
  modelId,
  onModelIdChange,
}: {
  modelId: string;
  onModelIdChange: (newModelId: string) => void;
}) {
  const router = useRouter();

  const handleSelectChange = (newModelId: string) => {
    onModelIdChange(newModelId);
    const params = new URLSearchParams();
    params.set("modelId", newModelId);
    router.push(`?${params.toString()}`);
  };

  return <ModelSelector modelId={modelId} onModelChange={handleSelectChange} />;
}

export function Chat({ modelId = DEFAULT_MODEL }: { modelId: string }) {
  const [currentModelId, setCurrentModelId] = useState(modelId);

  const handleModelIdChange = (newModelId: string) => {
    setCurrentModelId(newModelId);
  };

  const { messages, input, handleInputChange, handleSubmit, error, reload } =
    useChat({
      chatStore: defaultChatStore({
        api: "/api/chat",
        maxSteps: 3,
      }),
    });

  return (
    <div className="grid w-screen h-screen grid-rows-[1fr_auto] max-w-[800px] m-auto">
      <div className="flex flex-col-reverse gap-8 p-8 overflow-y-auto">
        {messages.toReversed().map((m) => (
          <div
            key={m.id}
            className={cn(
              "whitespace-pre-wrap",
              m.role === "user" &&
                "bg-muted/50 rounded-md p-3 ml-auto max-w-[80%]",
            )}
          >
            {m.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${m.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
      </div>

      {error && (
        <div className="px-8 pb-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              An error occurred while generating the response.
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => reload()}
            >
              Retry
            </Button>
          </Alert>
        </div>
      )}

      <form
        onSubmit={(e) => {
          handleSubmit(e, { body: { modelId: currentModelId } });
        }}
        className="flex justify-center px-8 pt-0 pb-8"
      >
        <Card className="w-full p-0">
          <CardContent className="flex items-center gap-3 p-2">
            <ModelSelectorHandler
              modelId={modelId}
              onModelIdChange={handleModelIdChange}
            />
            <div className="flex flex-1 items-center">
              <Input
                name="prompt"
                placeholder="Type your message..."
                onChange={handleInputChange}
                value={input}
                autoFocus
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.metaKey && e.key === "Enter") {
                    handleSubmit(e, { body: { modelId: currentModelId } });
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
