"use client";

import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { ModelSelector } from "@/components/model-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { SendIcon, PlusIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DEFAULT_MODEL } from "@/lib/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
  const [input, setInput] = useState("");
  const [currentModelId, setCurrentModelId] = useState(modelId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleModelIdChange = (newModelId: string) => {
    setCurrentModelId(newModelId);
  };

  const { messages, error, sendMessage, regenerate, setMessages, stop } = useChat();

  const hasMessages = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    stop();
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex gap-2 animate-fade-in">
        <Button
          onClick={handleNewChat}
          variant="outline"
          size="icon"
          className="h-9 w-9 shadow-border-small hover:shadow-border-medium bg-background/80 backdrop-blur-sm border-0 hover:bg-background hover:scale-[1.02] transition-all duration-150 ease"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 animate-fade-in">
          <div className="w-full max-w-2xl text-center space-y-8 md:space-y-12">
            <h1 className="text-3xl md:text-6xl font-light tracking-tight text-foreground animate-slide-up">
              <span className="font-mono font-semibold tracking-tight bg-foreground text-background px-4 py-3 rounded-2xl shadow-border-medium">
                AI GATEWAY
              </span>
            </h1>
            <div className="w-full animate-slide-up" style={{ animationDelay: '100ms' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage({ text: input }, { body: { modelId: currentModelId } });
                  setInput("");
                }}
              >
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-2xl glass-effect shadow-border-medium transition-all duration-200 ease-out">
                  <ModelSelectorHandler
                    modelId={modelId}
                    onModelIdChange={handleModelIdChange}
                  />
                  <div className="flex flex-1 items-center">
                    <Input
                      name="prompt"
                      placeholder="Ask a question..."
                      onChange={(e) => setInput(e.target.value)}
                      value={input}
                      autoFocus
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60"
                      onKeyDown={(e) => {
                        if (e.metaKey && e.key === "Enter") {
                          sendMessage(
                            { text: input },
                            { body: { modelId: currentModelId } },
                          );
                          setInput("");
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl hover:bg-muted/50"
                      disabled={!input.trim()}
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {hasMessages && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full animate-fade-in overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 hide-scrollbar">
            <div className="flex flex-col gap-4 md:gap-6 pb-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "whitespace-pre-wrap",
                    m.role === "user" &&
                      "bg-foreground text-background rounded-2xl p-3 md:p-4 ml-auto max-w-[90%] md:max-w-[75%] shadow-border-small font-medium text-sm md:text-base",
                    m.role === "assistant" && "max-w-[95%] md:max-w-[85%] text-foreground/90 leading-relaxed text-sm md:text-base"
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

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pb-4 animate-slide-down">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              An error occurred while generating the response.
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto transition-all duration-150 ease-out hover:scale-105"
              onClick={() => regenerate()}
            >
              Retry
            </Button>
          </Alert>
        </div>
      )}

      {hasMessages && (
        <div className="w-full max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input }, { body: { modelId: currentModelId } });
              setInput("");
            }}
            className="px-4 md:px-8 pb-6 md:pb-8"
          >
            <div className="flex items-center gap-3 p-4 rounded-2xl glass-effect shadow-border-medium transition-all duration-200 ease-out">
              <ModelSelectorHandler
                modelId={modelId}
                onModelIdChange={handleModelIdChange}
              />
              <div className="flex flex-1 items-center">
                <Input
                  name="prompt"
                  placeholder="Ask a question..."
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60 font-medium"
                  onKeyDown={(e) => {
                    if (e.metaKey && e.key === "Enter") {
                      sendMessage(
                        { text: input },
                        { body: { modelId: currentModelId } },
                      );
                      setInput("");
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-xl hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all duration-150 ease disabled:opacity-50 disabled:hover:scale-100"
                  disabled={!input.trim()}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <footer className="pb-8 text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
        <p className="text-xs md:text-sm text-muted-foreground">
          The models in the list are a small subset of those available in the
          Vercel AI Gateway.
          <br />
          See the{" "}
          <Button
            variant="link"
            asChild
            className="p-0 h-auto text-xs md:text-sm font-normal"
          >
            <a
              href="https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fmodel-list&title="
              target="_blank"
              rel="noopener noreferrer"
            >
              model library
            </a>
          </Button>{" "}
          for the full set.
        </p>
      </footer>
    </div>
  );
}
