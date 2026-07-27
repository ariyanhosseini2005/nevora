import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/vazirmatn";
import { MotionProvider } from "@/components/animations/MotionProvider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NEVORA — Premium Coffee | قهوه تخصصی نوورا",
    template: "%s | NEVORA",
  },
  description:
    "NEVORA is a bilingual premium coffee experience — سفری سینمایی و دو‌زبانه از دانه تا فنجان.",
  openGraph: {
    title: "NEVORA — Premium Coffee | قهوه تخصصی نوورا",
    description:
      "A bilingual cinematic coffee journey — سفری سینمایی و دو‌زبانه از دانه تا فنجان.",
    siteName: "NEVORA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEVORA — Premium Coffee | قهوه تخصصی نوورا",
    description:
      "A bilingual cinematic coffee journey — سفری سینمایی و دو‌زبانه از دانه تا فنجان.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full bg-cream font-body text-coffee-dark antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
