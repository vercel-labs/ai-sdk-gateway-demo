"use client";

import { useChat } from "@ai-sdk/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModelSelector } from "@/components/model-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { useRef, useEffect, Suspense, useState, useCallback } from "react";
import { DEFAULT_MODEL } from "@/lib/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function ModelSelectorHandler({
  onModelIdChange,
}: {
  onModelIdChange: (newModelId: string) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modelId = searchParams.get("modelId") || DEFAULT_MODEL;

  useEffect(() => {
    onModelIdChange(modelId);
  }, [modelId, onModelIdChange]);

  const handleSelectChange = useCallback(
    (newModelId: string) => {
      onModelIdChange(newModelId);
      const params = new URLSearchParams(searchParams.toString());
      params.set("modelId", newModelId);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router, onModelIdChange]
  );

  return <ModelSelector modelId={modelId} onModelChange={handleSelectChange} />;
}

function ChatComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentModelId, setCurrentModelId] = useState(DEFAULT_MODEL);

  const handleModelIdChange = useCallback((newModelId: string) => {
    setCurrentModelId(newModelId);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, error, reload } =
    useChat({
      key: currentModelId,
      body: {
        modelId: currentModelId,
      },
    });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="grid w-screen h-screen grid-rows-[1fr_auto] max-w-[800px] m-auto">
      <div className="flex flex-col-reverse gap-8 p-8 overflow-y-auto">
        {messages.toReversed().map((m) =>
          m.role === "user" ? (
            <div
              key={m.id}
              className="whitespace-pre-wrap bg-muted/50 rounded-md p-3 ml-auto max-w-[80%]"
            >
              {m.content}
            </div>
          ) : (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.content}
            </div>
          )
        )}
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
        onSubmit={handleSubmit}
        className="flex justify-center px-8 pt-0 pb-8"
      >
        <Card className="w-full p-0">
          <CardContent className="flex items-center gap-3 p-2">
            <Suspense
              fallback={
                <ModelSelector
                  modelId={DEFAULT_MODEL}
                  onModelChange={() => {}}
                />
              }
            >
              <ModelSelectorHandler onModelIdChange={handleModelIdChange} />
            </Suspense>

            <div className="flex flex-1 items-center">
              <Input
                ref={inputRef}
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

export default function Page() {
  return <ChatComponent />;
}
