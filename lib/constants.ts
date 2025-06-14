export const DEFAULT_MODEL = "xai/grok-3-beta";

export const SUPPORTED_MODELS = [
  // xAI models
  "xai/grok-3-beta",

  // Bedrock Nova models (AWS's cost-effective options)
  "bedrock/amazon.nova-lite-v1:0",
  "bedrock/amazon.nova-micro-v1:0",

  // OpenAI cost-effective options
  "openai/gpt-4o-mini",
  "openai/gpt-3.5-turbo",

  // Anthropic affordable option
  "anthropic/claude-3-haiku",

  // Google cost-effective models
  "vertex/gemini-2.0-flash-001",

  // Groq (known for fast, affordable inference)
  "groq/llama-3.1-8b",
  "groq/gemma2-9b-it",

  // Mistral affordable models
  "mistral/ministral-8b-latest",
  "mistral/ministral-3b-latest",
];
