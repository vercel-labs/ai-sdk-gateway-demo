import { useState, useEffect } from "react";

type Model = {
  id: string;
  label: string;
};

export function useAvailableModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        // This would be replaced with an actual API call
        // For now using sample data
        const sampleModels = [
          { id: "openai/gpt-4o", label: "GPT-4o" },
          { id: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
          { id: "anthropic/claude-3-opus", label: "Claude 3 Opus" },
        ];

        setModels(sampleModels);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load models")
        );
        setIsLoading(false);
      }
    }

    fetchModels();
  }, []);

  return { models, isLoading, error };
}
