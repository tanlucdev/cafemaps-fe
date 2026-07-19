import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys";
import { getVisitedCafeEntries } from "@/apis/visited";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import MapPageClient from "./MapPageClient";

interface MapPageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  return createLocalizedMetadata({
    locale,
    pathname: "/map",
    title: normalizedLocale === "vi" ? "Bản đồ đã đi" : "Visited map",
    description:
      normalizedLocale === "vi"
        ? "Xem các quán cà phê đã đi và đánh dấu hành trình cà phê của bạn tại TP.HCM."
        : "View visited cafés and track your coffee map in Ho Chi Minh City.",
  });
}

export default async function MapPage({ params }: MapPageProps) {
  const { locale } = await params;
  const token = (await cookies()).get(AUTH_COOKIE_KEYS.accessToken)?.value ?? null;
  const visitedEntries = token ? await getVisitedCafeEntries(token, locale) : [];

  return (
    <MapPageClient
      locale={locale}
      cafes={visitedEntries.map((entry) => entry.cafe)}
      initialVisitedIds={visitedEntries.map((entry) => entry.cafe.id)}
    />
  );
}
