import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LOCALE,
  getSiteUrl,
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_IMAGE,
  SITE_NAME,
} from "@/lib/metadata";
import GoogleAnalyticsProvider from "@/components/providers/GoogleAnalyticsProvider";
import SpeedInsightsProvider from "@/components/providers/SpeedInsightsProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["700"],
  display: "swap",
  preload: false,
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
  alternates: {
    canonical: `/${DEFAULT_LOCALE}`,
    languages: {
      "vi-VN": "/vi",
      "en-US": "/en",
      "x-default": `/${DEFAULT_LOCALE}`,
    },
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: SITE_NAME,
    url: `/${DEFAULT_LOCALE}`,
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("h-full", plusJakarta.variable, lora.variable)}
    >
      <body className="flex min-h-full flex-col antialiased" suppressHydrationWarning>
        {children}
        <GoogleAnalyticsProvider />
        <Analytics />
        <SpeedInsightsProvider />
      </body>
    </html>
  );
}
