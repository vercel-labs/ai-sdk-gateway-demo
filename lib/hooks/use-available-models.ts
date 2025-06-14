import { useState, useEffect, useCallback } from "react";
import type { DisplayModel } from "@/lib/display-model";
import type { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { SUPPORTED_MODELS } from "@/lib/constants";

const DEFAULT_MODELS: DisplayModel[] = [
  { id: "xai/grok-3-beta", label: "Grok 3 Beta" },
  { id: "bedrock/amazon.nova-lite-v1:0", label: "Nova Lite" },
  { id: "bedrock/amazon.nova-micro-v1:0", label: "Nova Micro" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
  { id: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { id: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" },
  { id: "vertex/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
  { id: "groq/llama-3.1-8b", label: "Llama 3.1 8B" },
  { id: "groq/gemma2-9b-it", label: "Gemma 2 9B IT" },
  { id: "mistral/ministral-8b-latest", label: "Ministral 8B" },
  { id: "mistral/ministral-3b-latest", label: "Ministral 3B" },
];

const MAX_RETRIES = 3;
const RETRY_DELAY_MILLIS = 5000;

function buildModelList(models: GatewayLanguageModelEntry[]): DisplayModel[] {
  return models
    .filter((model) => SUPPORTED_MODELS.includes(model.id))
    .map((model) => ({
      id: model.id,
      label: model.name,
    }));
}

export function useAvailableModels() {
  const [models, setModels] = useState<DisplayModel[]>(DEFAULT_MODELS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchModels = useCallback(
    async (isRetry: boolean = false) => {
      if (!isRetry) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await fetch("/api/models");
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();
        const newModels = buildModelList(data.models);
        setModels(newModels);
        setError(null);
        setRetryCount(0);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch models")
        );
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [retryCount]
  );

  useEffect(() => {
    if (retryCount === 0) {
      fetchModels(false);
    } else if (retryCount > 0 && retryCount <= MAX_RETRIES) {
      const timerId = setTimeout(() => {
        fetchModels(true);
      }, RETRY_DELAY_MILLIS);
      return () => clearTimeout(timerId);
    }
  }, [retryCount, fetchModels]);

  return { models, isLoading, error };
}
