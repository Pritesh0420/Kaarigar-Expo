import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet India's Kaarigars",
  description:
    "Discover India's master artisans – weavers, potters, wood carvers, brass inlay artists, and more. Browse Kaarigar profiles and their traditional craft specializations.",
  openGraph: {
    title: "India's Master Kaarigars & Artisans – Kaarigar Expo",
    description:
      "Explore profiles of India's finest craftspeople. From Varanasi handloom weavers to Goa terracotta sculptors, meet the heritage masters behind India's living art.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Indian artisan crafting handloom textile",
      },
    ],
  },
  alternates: {
    canonical: "https://kaarigarexpo.in/kaarigars",
  },
};

export default function KaarigarsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
