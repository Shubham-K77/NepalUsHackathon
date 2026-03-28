import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "मनको कुरा | Manko Kura",
    template: "%s | मनको कुरा",
  },
  description:
    "मानसिक स्वास्थ्यको ख्याल राख्नुहोस् — A mental health screening app for Nepali communities aged 55 and above.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "मनको कुरा",
  },
  formatDetection: { telephone: true },
  keywords: ["mental health", "Nepal", "मानसिक स्वास्थ्य", "GDS-15", "depression screening"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8B1A1A" },
    { media: "(prefers-color-scheme: dark)", color: "#8B1A1A" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-cream-100 font-devanagari">{children}</body>
    </html>
  );
}
