import type { Metadata } from "next";
import { getCafes } from "@/apis/cafes";
import NewMeetupClient from "@/components/coffee-meetups/NewMeetupClient";
import { featureFlags } from "@/lib/feature-flags";
import { createLocalizedMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const pick = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata({
    locale,
    pathname: "/coffee-meetups/new",
    title: "Tạo kèo cà phê",
    description: "Tạo một buổi học, làm việc hoặc trò chuyện tại quán cà phê trên Cafe Maps.",
  });
}

export default async function NewMeetupPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  if (!featureFlags.coffeeMeetupsEnabled) return null;
  const cafes = await getCafes({ limit: 200 }, locale);
  return (
    <NewMeetupClient
      cafes={cafes}
      preselectedCafeId={pick(query.cafeId)}
      editMeetupId={pick(query.meetup)}
    />
  );
}
