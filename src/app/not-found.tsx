import NotFoundExperience from "@/components/layout/NotFoundExperience";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const [locale, t, tc] = await Promise.all([
    getLocale(),
    getTranslations("notFound"),
    getTranslations("common"),
  ]);

  return (
    <NotFoundExperience
      title={t("title")}
      description={t("description")}
      homeHref={`/${locale}`}
      homeLabel={tc("goHome")}
    />
  );
}
