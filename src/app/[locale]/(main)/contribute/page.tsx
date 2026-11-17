import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Store, UsersRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createLocalizedMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  return createLocalizedMetadata({
    locale,
    pathname: "/contribute",
    title: t("hub.title"),
    description: t("hub.subtitle"),
  });
}

export default async function ContributePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  const flows = [
    {
      href: "/contribute/suggest",
      icon: UsersRound,
      title: t("hub.suggest.title"),
      body: t("hub.suggest.body"),
      cta: t("hub.suggest.cta"),
    },
    {
      href: "/contribute/owner",
      icon: Store,
      title: t("hub.owner.title"),
      body: t("hub.owner.body"),
      cta: t("hub.owner.cta"),
    },
  ];

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[var(--background)] px-4 pt-[74px] pb-[calc(var(--mobile-bottom-nav-height)+24px)] text-[var(--foreground)] sm:px-6 sm:pt-[112px] lg:pt-28 lg:pb-12">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#fff0d2]/50 to-transparent dark:from-white/5" />

      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-7">
        <section className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/60 bg-[#fffaf2]/70 px-3 py-1.5 text-[11.5px] font-bold text-[var(--accent)] shadow-[0_10px_28px_rgba(44,26,14,0.07)] backdrop-blur dark:border-[#ffe3b7]/12 dark:bg-white/6 sm:text-[12px]">
            <UsersRound className="size-3.5" aria-hidden="true" />
            {t("hub.eyebrow")}
          </div>
          <h1 className="font-lora text-[2rem] leading-tight font-bold text-balance text-[var(--foreground)] sm:text-[clamp(2.8rem,6vw,4.25rem)]">
            {t("hub.heroTitle")}
          </h1>
          <p className="max-w-2xl text-[14.5px] leading-6 text-[var(--foreground-muted)] sm:text-[17px] sm:leading-8">
            {t("hub.subtitle")}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2" aria-label={t("hub.flowAria")}>
          {flows.map((flow) => {
            const Icon = flow.icon;
            return (
              <Link
                key={flow.href}
                href={flow.href}
                className="group flex min-h-[220px] flex-col justify-between rounded-[24px] border border-[var(--border)] bg-[var(--contribute-surface)] p-5 shadow-[var(--contribute-panel-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:shadow-[0_22px_70px_rgba(44,26,14,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 sm:p-6"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="space-y-3">
                  <span className="block text-xl font-black text-[var(--foreground)]">
                    {flow.title}
                  </span>
                  <span className="block text-sm leading-6 text-[var(--foreground-muted)]">
                    {flow.body}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-black text-[var(--accent)]">
                  {flow.cta}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
