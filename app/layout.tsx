import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://teuteuteu.com"),
  title: "teuteuteu.com",
  description: "Appuie sur le bouton.",
  applicationName: "teuteuteu.com",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "teuteuteu.com",
    description: "Appuie sur le bouton.",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: "teuteuteu.com", description: "Appuie sur le bouton." },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
