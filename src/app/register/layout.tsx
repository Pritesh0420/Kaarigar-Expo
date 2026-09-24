import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Kaarigar Expo account. Artisans can register to apply for handicraft mela stalls. Visitors can sign up to RSVP for cultural events across India.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
