import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kaarigar Expo for stall booking inquiries, artisan registration help, event partnerships, or visitor passes. We respond within 24 hours.",
  openGraph: {
    title: "Contact Kaarigar Expo – Helpdesk & Inquiries",
    description:
      "Reach our team for stall applications, mela partnerships, artisan support, or general inquiries. We're here to help every step of the way.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Artisan at work",
      },
    ],
  },
  alternates: {
    canonical: "https://kaarigarexpo.in/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
