"use client";

import { useAvailableModels } from "@/lib/hooks/use-available-models";
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
  onModelChange: (modelId: string) => void;
};

export const ModelSelector = memo(function ModelSelector({
  modelId = DEFAULT_MODEL,
  onModelChange,
}: ModelSelectorProps) {
  const { models, isLoading, error } = useAvailableModels();

  return (
    <Select
      value={modelId}
      onValueChange={onModelChange}
      disabled={isLoading || !!error || !models?.length}
    >
      <SelectTrigger className="w-[160px] h-9 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 rounded-xl font-medium">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-sm">Loading</span>
          </div>
        ) : error ? (
          <span className="text-red-500 text-sm">Error</span>
        ) : !models?.length ? (
          <span className="text-sm">No models</span>
        ) : (
          <SelectValue placeholder="Select model" />
        )}
      </SelectTrigger>

      <SelectContent className="rounded-2xl border-0 shadow-border-medium bg-popover/95 backdrop-blur-sm animate-scale-in" align="center" sideOffset={8}>
        <SelectGroup>
          <SelectLabel className="text-xs text-muted-foreground px-2 py-1">Models</SelectLabel>
          {models?.map((model) => (
            <SelectItem key={model.id} value={model.id} className="rounded-lg transition-colors duration-150 ease-out">
              {model.label}
            </SelectItem>
          )) || []}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});
