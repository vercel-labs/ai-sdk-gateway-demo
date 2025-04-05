"use client";

import { useAvailableModels } from "@/lib/hooks/use-available-models";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

type ModelSelectorProps = {
  modelId: string;
  onModelChange?: (modelId: string) => void;
};

export function ModelSelector({
  modelId = "xai/grok-2-1212",
  onModelChange,
}: ModelSelectorProps) {
  const { models, isLoading, error } = useAvailableModels();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex justify-center">Loading models...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (!models?.length) {
    return <div className="flex justify-center">No models available</div>;
  }

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
    <Select defaultValue={modelId} onValueChange={handleModelChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Models</SelectLabel>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
