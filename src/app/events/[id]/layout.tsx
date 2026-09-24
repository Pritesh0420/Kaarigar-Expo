import type { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";

// Note: generateMetadata runs server-side only; it reads from Firestore Admin or REST API
// Since this project uses client-side Firebase, we use static fallback per event ID
const eventMeta: Record<string, { title: string; description: string; image: string }> = {
  "event-1": {
    title: "Delhi Diwali Mela 2026",
    description:
      "A grand exhibition of festive crafts, clay diyas, and traditional handlooms at Dilli Haat, INA, New Delhi. RSVP now for India's most celebrated seasonal crafts fair.",
    image: "https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1200&auto=format&fit=crop",
  },
  "event-2": {
    title: "Jaipur Artisan Fair 2026",
    description:
      "Explore Rajasthan's finest terracotta, blue pottery, bandhani textiles, and mirror-work leathercraft at Jawahar Kala Kendra, Jaipur.",
    image: "https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=1200&auto=format&fit=crop",
  },
  "event-3": {
    title: "Surajkund International Crafts Fair",
    description:
      "Asia's largest handicrafts fair celebrating artisans from 30+ states at Surajkund Mela Grounds, Faridabad. Apply for a booth or RSVP as a visitor.",
    image: "https://images.unsplash.com/photo-1616706161242-f1d591350d1c?w=1200&auto=format&fit=crop",
  },
  "event-4": {
    title: "Bengal Handloom & Terracotta Grand Expo",
    description:
      "Discover Biswa Bangla's handloom sarees, Bankura horses, Madhubani paintings, and Dokra metal craft at Biswa Bangla Mela Prangan, Kolkata.",
    image: "https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=1200&auto=format&fit=crop",
  },
  "event-5": {
    title: "Shilpgram Folk Arts Carnival",
    description:
      "Udaipur's premier folk arts festival with master craftspeople from Rajasthan, Gujarat, and Madhya Pradesh at Shilpgram Rural Arts Complex.",
    image: "https://images.unsplash.com/photo-1603030002297-85e206a2285a?w=1200&auto=format&fit=crop",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const meta = eventMeta[params.id];
  if (!meta) {
    return {
      title: "Event Details",
      description: "View details and RSVP for this artisan mela event on Kaarigar Expo.",
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} – Kaarigar Expo`,
      description: meta.description,
      images: [{ url: meta.image, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
    alternates: {
      canonical: `https://kaarigarexpo.in/events/${params.id}`,
    },
  };
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
