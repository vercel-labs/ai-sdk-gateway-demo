"use client";

import { useAvailableModels } from "@/lib/hooks/use-available-models";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DEFAULT_MODEL } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { memo } from "react";

type ModelSelectorProps = {
  modelId: string;
  onModelChange?: (modelId: string) => void;
};

export const ModelSelector = memo(function ModelSelector({
  modelId = DEFAULT_MODEL,
  onModelChange,
}: ModelSelectorProps) {
  const { models, isLoading, error } = useAvailableModels();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentModelId = searchParams.get("modelId") || modelId;

  const handleModelChange = (value: string) => {
    if (onModelChange) {
      onModelChange(value);
    } else {
      const params = new URLSearchParams();
      params.set("modelId", value);
      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <Select
      value={currentModelId}
      onValueChange={handleModelChange}
      disabled={isLoading || !!error || !models?.length}
    >
      <SelectTrigger className="w-[180px]">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading</span>
          </div>
        ) : error ? (
          <span className="text-red-500">Error</span>
        ) : !models?.length ? (
          <span>No models</span>
        ) : (
          <SelectValue placeholder="Select a model" />
        )}
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Models</SelectLabel>
          {models?.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.label}
            </SelectItem>
          )) || []}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});
