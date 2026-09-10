import type { Metadata } from "next";
import MeetupDetailClient from "@/components/coffee-meetups/MeetupDetailClient";
import { featureFlags } from "@/lib/feature-flags";
import { createLocalizedMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata({
    locale,
    pathname: "/coffee-meetups",
    title: "Chi tiết kèo cà phê",
    description: "Thông tin một kèo cà phê trên Cafe Maps.",
  });
}

export default async function MeetupDetailPage({ params }: Props) {
  const { id } = await params;
  if (!featureFlags.coffeeMeetupsEnabled) return null;
  return <MeetupDetailClient id={id} />;
}
