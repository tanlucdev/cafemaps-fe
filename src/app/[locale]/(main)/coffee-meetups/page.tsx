import type { Metadata } from "next";
import { createLocalizedMetadata } from "@/lib/metadata";
import { featureFlags } from "@/lib/feature-flags";
import CoffeeMeetupsClient from "@/components/coffee-meetups/CoffeeMeetupsClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const pick = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata({
    locale,
    pathname: "/coffee-meetups",
    title: "Kèo cà phê",
    description: "Tạo hoặc tham gia một buổi cà phê tại các quán có sẵn trên Cafe Maps.",
  });
}

export default async function CoffeeMeetupsPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!featureFlags.coffeeMeetupsEnabled) return <Disabled />;
  return (
    <CoffeeMeetupsClient
      initialFilters={{
        purpose: pick(params.purpose),
        date: pick(params.date),
        area: pick(params.area),
        available: pick(params.available) === "1",
      }}
    />
  );
}

function Disabled() {
  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-4 pt-28">
      <div className="mx-auto max-w-xl rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <h1 className="text-2xl font-black">Kèo cà phê đang tắt</h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Bật feature flag để thử nghiệm MVP.
        </p>
      </div>
    </main>
  );
}
