import { useState, useEffect, useCallback } from "react";
import type { DisplayModel } from "@/lib/display-model";
import type { GatewayLanguageModelEntry } from "@vercel/ai-sdk-gateway";

const DEFAULT_MODELS: DisplayModel[] = [
  { id: "xai/grok-2-1212", label: "Grok 2" },
  { id: "anthropic/claude-3-7-sonnet", label: "Claude 3.7 Sonnet" },
  { id: "groq/llama-3.1-70b-versatile", label: "Llama 3.1 70B" },
  { id: "google/gemini-2.0-flash-002", label: "Gemini 2.0 Flash" },
];

type Model = {
  id: string;
  label: string;
};

function buildModelList(models: GatewayLanguageModelEntry[]): DisplayModel[] {
  return models.map((model) => ({
    id: model.id,
    label: model.name,
  }));
}

export function useAvailableModels() {
  const [models, setModels] = useState<Model[]>(DEFAULT_MODELS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch("/api/models");
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      const newModels = buildModelList(data.models);
      setModels(newModels);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch models")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { models, isLoading, error };
}
