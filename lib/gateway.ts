import { createGateway } from "@ai-sdk/gateway";

export const gateway = createGateway({
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});
