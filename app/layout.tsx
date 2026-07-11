import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { directionFor, messagesFor } from "@/lib/i18n";
import { requestLocale } from "@/lib/i18n-request";
import { homeMetadata, SITE_ORIGIN } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const messages = messagesFor(locale);
  return {
    ...homeMetadata(locale, "/"),
    metadataBase: SITE_ORIGIN,
    applicationName: "teuteuteu.com",
    manifest: "/manifest.webmanifest",
    icons: { icon: "/icon.svg" },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
    other: { "content-language": locale, "mobile-web-app-capable": "yes", "teuteuteu-instruction": messages.instruction },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await requestLocale();
  return (
    <html dir={directionFor(locale)} lang={locale}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
