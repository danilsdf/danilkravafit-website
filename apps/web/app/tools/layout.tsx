import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | Hybrid Athlete Hub",
  description: "Explore fitness, nutrition, and training tools for hybrid athletes and busy professionals at Hybrid Athlete Hub.",
  openGraph: {
    title: "Tools | Hybrid Athlete Hub",
    description: "Explore fitness, nutrition, and training tools for hybrid athletes and busy professionals at Hybrid Athlete Hub.",
    url: "https://danilkrava.fit/tools",
    siteName: "Hybrid Athlete Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tools | Hybrid Athlete Hub",
    description: "Explore fitness, nutrition, and training tools for hybrid athletes and busy professionals at Hybrid Athlete Hub.",
  },
};
import MainHeader from "@/components/headers/MainHeader";
import MainFooter from "@/components/footer/MainFooter";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      {children}
      <MainFooter />
    </>
  );
}
