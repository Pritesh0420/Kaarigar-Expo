import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const siteUrl = "https://kaarigarexpo.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kaarigar Expo – India's Premier Artisan & Handicraft Mela Platform",
    template: "%s | Kaarigar Expo",
  },
  description:
    "Kaarigar Expo connects India's master artisans with visitors at handicraft melas, exhibitions, and cultural fairs. Register as a Kaarigar or RSVP for events across India.",
  keywords: [
    "kaarigar expo",
    "Indian artisans",
    "handicraft mela",
    "handloom exhibition",
    "terracotta pottery India",
    "artisan registration",
    "Indian crafts fair",
    "cultural mela India",
    "mela registration platform",
    "dilli haat artisans",
    "Surajkund crafts fair",
  ],
  authors: [{ name: "Kaarigar Expo", url: siteUrl }],
  creator: "Kaarigar Expo",
  publisher: "Kaarigar Expo",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Kaarigar Expo",
    title: "Kaarigar Expo – India's Premier Artisan & Handicraft Mela Platform",
    description:
      "Discover authentic handloom, pottery, tribal art, and more at India's biggest handicraft melas. Register as a Kaarigar or explore upcoming events.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Indian artisans showcasing handicrafts at Kaarigar Expo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaarigar Expo – Celebrating India's Artisans",
    description:
      "Connect with master craftspeople and experience vibrant handicraft melas across India.",
    images: ["https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1200&auto=format&fit=crop"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-[#F5EFE6] text-[#3D2B1F]">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
