import { useState, useEffect, useCallback } from "react";
import type { DisplayModel } from "@/lib/display-model";
import type { GatewayLanguageModelEntry } from "@vercel/ai-sdk-gateway";

const DEFAULT_MODELS: DisplayModel[] = [
  { id: "xai/grok-3-beta", label: "Grok 3 Beta" },
  { id: "anthropic/claude-3-7-sonnet", label: "Claude 3.7 Sonnet" },
  { id: "groq/llama-3.1-70b-versatile", label: "Llama 3.1 70B" },
  { id: "google/gemini-2.0-flash-002", label: "Gemini 2.0 Flash" },
];

const MAX_RETRIES = 3;
const RETRY_DELAY_MILLIS = 5000;

function buildModelList(models: GatewayLanguageModelEntry[]): DisplayModel[] {
  return models.map((model) => ({
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
