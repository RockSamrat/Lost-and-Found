import type { Metadata } from "next";
import { getItems } from "@/app/actions/items";
import FeedClient from "@/components/FeedClient";

export const metadata: Metadata = {
  title: "Feed — Lost & Found",
  description: "Browse all lost and found items reported by the community.",
};

export default async function FeedPage() {
  const items = await getItems();

  return <FeedClient items={items} />;
}
