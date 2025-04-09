import { createGatewayProvider } from "@vercel/ai-sdk-gateway";

export const gateway = createGatewayProvider({
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});
