import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { directionFor, messagesFor } from "@/lib/i18n";
import { requestLocale } from "@/lib/i18n-request";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const messages = messagesFor(locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://teuteuteu.com"),
    title: "teuteuteu.com",
    description: messages.instruction,
    applicationName: "teuteuteu.com",
    manifest: "/manifest.webmanifest",
    icons: { icon: "/icon.svg" },
    openGraph: {
      title: "teuteuteu.com",
      description: messages.instruction,
      images: [`/api/og?lang=${encodeURIComponent(locale)}`],
    },
    twitter: { card: "summary_large_image", title: "teuteuteu.com", description: messages.instruction },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await requestLocale();
  return (
    <html dir={directionFor(locale)} lang={locale}>
      <body>{children}</body>
    </html>
  );
}
