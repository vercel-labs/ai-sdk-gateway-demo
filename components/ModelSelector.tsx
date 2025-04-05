"use client";

import { useAvailableModels } from "@/lib/hooks/use-available-models";
import { useRouter } from "next/navigation";

const Select = ({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
  >
    {children}
  </select>
);

const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => <option value={value}>{children}</option>;

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
    return <div>Loading models...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  if (!models?.length) {
    return <div>No models available</div>;
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
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Model</label>
      <Select value={modelId} onChange={handleModelChange}>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
