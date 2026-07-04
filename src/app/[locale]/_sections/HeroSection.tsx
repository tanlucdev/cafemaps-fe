import { getTranslations } from "next-intl/server";
import { CafeHeroCinematic } from "./hero/CafeHeroCinematic";

type HeroSectionProps = {
  locale: string;
};

export default async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations("hero");

  return (
    <CafeHeroCinematic
      locale={locale}
      eyebrow={t("cinematicEyebrow")}
      headline={t("cinematicHeadline")}
      subtitle={t("cinematicSubtitle")}
      searchPlaceholder={t("placeholderWork")}
      searchCta={t("cta")}
      mobileSearchCta={t("mobileSearchCta")}
      nearbyCta={t("nearMeCta")}
      quickFilters={[
        {
          emoji: "📍",
          label: t("quickFilters.nearMe"),
          href: "?nearMe=true&sort=popular",
          featured: true,
        },
        {
          emoji: "☁️",
          label: t("quickFilters.quiet"),
          href: "?vibes=y%C3%AAn%20t%C4%A9nh&sort=popular",
        },
        {
          emoji: "✨",
          label: t("quickFilters.vintage"),
          href: "?vibes=vintage&sort=popular",
        },
        {
          emoji: "💻",
          label: t("quickFilters.workFriendly"),
          href: "?purposes=l%C3%A0m%20vi%E1%BB%87c&sort=popular",
        },
        {
          emoji: "🌿",
          label: t("quickFilters.outdoor"),
          href: "?vibes=thi%C3%AAn%20nhi%C3%AAn&sort=popular",
        },
        {
          emoji: "🕒",
          label: t("quickFilters.openNow"),
          href: "?open=true&sort=popular",
        },
      ]}
    />
  );
}
