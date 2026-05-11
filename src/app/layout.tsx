import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Lora } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: {
    default: "Cafe Maps — Khám phá quán cà phê TP.HCM",
    template: "%s | Cafe Maps",
  },
  description:
    "Tìm kiếm và khám phá những quán cà phê đẹp nhất tại TP.HCM theo phong cách, mục đích và địa điểm.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://cafefinder.vn"
  ),
  openGraph: {
    siteName: "Cafe Maps",
    locale: "vi_VN",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      suppressHydrationWarning
      className={cn("h-full", plusJakarta.variable, lora.variable)}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
