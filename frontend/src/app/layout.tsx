import type { Metadata } from "next";
import { Inter, Playfair_Display, Vazirmatn } from "next/font/google";
import { MotionProvider } from "@/components/animations/MotionProvider";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NEVORA — Premium Coffee",
    template: "%s | NEVORA",
  },
  description:
    "NEVORA is a premium coffee brand crafting a luxury, emotional coffee experience — from bean to cup.",
  openGraph: {
    title: "NEVORA — Premium Coffee",
    description:
      "NEVORA is a premium coffee brand crafting a luxury, emotional coffee experience — from bean to cup.",
    siteName: "NEVORA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEVORA — Premium Coffee",
    description:
      "NEVORA is a premium coffee brand crafting a luxury, emotional coffee experience — from bean to cup.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${vazirmatn.variable}`}
    >
      <body className="min-h-full bg-cream font-body text-coffee-dark antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
