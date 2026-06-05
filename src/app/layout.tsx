import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LOCALE,
  getSiteUrl,
  HOME_DESCRIPTION,
  HOME_TITLE,
  normalizeLocale,
  OG_IMAGE,
  SITE_NAME,
} from "@/lib/metadata";
import GoogleAnalyticsProvider from "@/components/providers/GoogleAnalyticsProvider";
import SpeedInsightsProvider from "@/components/providers/SpeedInsightsProvider";

const NEXT_INTL_LOCALE_HEADER = "X-NEXT-INTL-LOCALE";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fdf6ec",
};

export const metadata: Metadata = {
  title: {
    default: HOME_TITLE,
    template: "%s | Cafe Maps",
  },
  description: HOME_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/image/logo.png", type: "image/png", sizes: "1024x1024" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/image/logo.png", type: "image/png", sizes: "1024x1024" }],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": 160,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": 160,
      "max-video-preview": -1,
    },
  },
  metadataBase: getSiteUrl(),
  openGraph: {
    siteName: SITE_NAME,
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const locale = normalizeLocale(requestHeaders.get(NEXT_INTL_LOCALE_HEADER) ?? DEFAULT_LOCALE);

  return (
    <html lang={locale} suppressHydrationWarning className={cn("h-full", plusJakarta.variable, lora.variable)}>
      <body className="flex min-h-full flex-col antialiased">
        {children}
        <GoogleAnalyticsProvider />
        <Analytics />
        <SpeedInsightsProvider />
      </body>
    </html>
  );
}
