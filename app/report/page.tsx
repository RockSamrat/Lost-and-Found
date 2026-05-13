import type { Metadata } from "next";
import ReportPageClient from "@/components/ReportPageClient";

export const metadata: Metadata = {
  title: "Report an Item — Lost & Found",
  description: "Report a lost or found item on the map. Help your community reconnect with their belongings.",
};

export default function ReportPage() {
  return <ReportPageClient />;
}
