import { getTranslations } from "next-intl/server";
import { CafeHeroCinematic } from "./hero/CafeHeroCinematic";

export default async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <CafeHeroCinematic
      eyebrow={t("cinematicEyebrow")}
      headline={t("cinematicHeadline")}
      subtitle={t("cinematicSubtitle")}
      primaryCta={t("cinematicPrimaryCta")}
    />
  );
}
