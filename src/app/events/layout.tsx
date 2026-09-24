import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Melas & Craft Events",
  description:
    "Browse and RSVP for India's top handicraft melas, handloom exhibitions, terracotta fairs, and cultural bazaars. Find artisan events near you.",
  openGraph: {
    title: "Handicraft Melas & Events – Kaarigar Expo",
    description:
      "Discover upcoming artisan fairs, handloom expos, and cultural melas across India. RSVP for free and meet master craftspeople.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1616706161242-f1d591350d1c?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Indian handicraft mela with artisans",
      },
    ],
  },
  alternates: {
    canonical: "https://kaarigarexpo.in/events",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
