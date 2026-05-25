import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSiteUrl, OG_IMAGE, SITE_NAME } from "@/lib/metadata";

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
    default: "Cafe Maps — Khám phá quán cà phê TP.HCM",
    template: "%s | Cafe Maps",
  },
  description:
    "Tìm kiếm và khám phá những quán cà phê đẹp nhất tại TP.HCM theo phong cách, mục đích và địa điểm.",
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
        alt: "Cafe Maps — Khám phá quán cà phê TP.HCM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={cn("h-full", plusJakarta.variable, lora.variable)}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
