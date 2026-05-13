import type { Metadata } from "next";
import { getItems } from "@/app/actions/items";
import MapClient from "@/components/map/MapClient";

export const metadata: Metadata = {
  title: "Map — Lost & Found",
  description: "Browse lost and found items on an interactive map.",
};

export default async function MapPage() {
  const items = await getItems();

  return <MapClient initialItems={items} />;
}
