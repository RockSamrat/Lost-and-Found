import type { Metadata } from "next";
import { getUserItems } from "@/app/actions/items";
import MyPostsClient from "@/components/MyPostsClient";

export const metadata: Metadata = {
  title: "My Posts — Lost & Found",
  description: "View and manage your lost and found item reports.",
};

export default async function MyPostsPage() {
  const items = await getUserItems();

  return <MyPostsClient items={items} />;
}
