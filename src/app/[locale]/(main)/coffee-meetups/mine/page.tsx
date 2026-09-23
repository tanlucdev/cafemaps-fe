import type { Metadata } from "next";
import { createLocalizedMetadata } from "@/lib/metadata";
import { featureFlags } from "@/lib/feature-flags";
import MyMeetupsClient from "@/components/coffee-meetups/MyMeetupsClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata({
    locale,
    pathname: "/coffee-meetups/mine",
    title: "Kèo của tôi",
    description: "Quản lý kèo cà phê bạn tổ chức hoặc tham gia.",
  });
}

export default function MyMeetupsPage() {
  if (!featureFlags.coffeeMeetupsEnabled) return null;
  return <MyMeetupsClient />;
}
