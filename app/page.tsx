import { Chat } from "@/components/chat";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ modelId: string }>;
}) {
  const { modelId } = await searchParams;
  return <Chat modelId={modelId} />;
}
