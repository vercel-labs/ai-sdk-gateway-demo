import { createGatewayProvider } from "@vercel/ai-sdk-gateway";

export const gateway = createGatewayProvider({
  baseURL: "http://localhost:3210/v1/ai",
});
