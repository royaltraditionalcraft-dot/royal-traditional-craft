import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "Royaltraditionalcraft — Minimalist Furniture",
    template: "%s | Royaltraditionalcraft",
  },
  description:
    "Experience the intersection of modern intelligence and timeless craftsmanship. Premium minimalist essentials for your home.",
  keywords: [
    "Royaltraditionalcraft",
    "minimalist furniture",
    "digital living",
    "premium home solutions",
    "modern lifestyle"
  ],
  openGraph: {
    type: "website",
    siteName: "Royaltraditionalcraft",
    title: "Royaltraditionalcraft — Minimalist Furniture",
    description:
      "Modern minimalist furniture and timeless craftsmanship.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        <WhatsAppButton />
      </body>
    </html>
  );
}
