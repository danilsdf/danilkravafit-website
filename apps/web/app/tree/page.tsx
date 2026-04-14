
import TreePageBody from "@/components/pages/TreePageBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tree | Hybrid Athlete Hub",
  description: "Explore the tree view of Danil Kravchenko's hybrid athlete and coding journey.",
  openGraph: {
    title: "Tree | Hybrid Athlete Hub",
    description: "Explore the tree view of Danil Kravchenko's hybrid athlete and coding journey.",
    url: "https://danilkrava.fit/tree",
    siteName: "Danil Kravchenko",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tree | Hybrid Athlete Hub",
    description: "Explore the tree view of Danil Kravchenko's hybrid athlete and coding journey.",
  },
};

export default function Page() {
  return (
    <TreePageBody />
  );
}

