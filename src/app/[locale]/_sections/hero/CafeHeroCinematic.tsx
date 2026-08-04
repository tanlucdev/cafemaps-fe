import Image from "next/image";
import { Sparkles } from "lucide-react";
import { HeroVideoBackdrop } from "./HeroVideoBackdrop";
import { HeroSearchIsland } from "./HeroSearchIsland";

const HERO_POSTER = "/image/home-hero-video-frame-20260703.webp";
const HERO_POSTER_MOBILE = "/image/home-hero-video-frame-mobile-20260703.webp";

type CafeHeroCinematicProps = {
  eyebrow: string;
  headline: string;
  subtitle: string;
};

export function CafeHeroCinematic({ eyebrow, headline, subtitle }: CafeHeroCinematicProps) {
  return (
    <section className="relative isolate h-[100svh] w-full max-w-[100vw] overflow-hidden bg-[var(--background)] p-2 pt-[calc(62px+0.5rem)] text-[var(--header-shell-cinematic-text)] sm:p-3 sm:pt-[calc(62px+0.75rem)] md:p-4 md:pt-[calc(62px+1rem)]">
      <div className="relative h-full min-h-0 w-full max-w-full overflow-hidden rounded-[24px] border border-[color:var(--header-shell-cinematic-border)] bg-[var(--foreground)] shadow-[var(--shadow-warm-hover)] sm:rounded-[30px] md:rounded-[36px]">
        <Image
          src={HERO_POSTER_MOBILE}
          alt=""
          fill
          sizes="100vw"
          fetchPriority="high"
          className="absolute inset-0 z-0 object-cover md:hidden"
        />
        <Image
          src={HERO_POSTER}
          alt=""
          fill
          sizes="100vw"
          fetchPriority="high"
          className="absolute inset-0 z-0 hidden object-cover md:block"
        />

        <HeroVideoBackdrop poster={HERO_POSTER} />

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--foreground)_8%,transparent)_0%,color-mix(in_srgb,var(--accent)_6%,transparent)_42%,color-mix(in_srgb,var(--foreground)_38%,transparent)_100%)]" />
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--foreground)_68%,transparent)_0%,color-mix(in_srgb,var(--foreground)_44%,transparent)_40%,color-mix(in_srgb,var(--accent)_14%,transparent)_66%,color-mix(in_srgb,var(--foreground)_24%,transparent)_100%)]" />
        <div className="absolute inset-0 z-[3] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.78%22_numOctaves=%222%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.48%22/%3E%3C/svg%3E')] opacity-[0.08] mix-blend-overlay" />
        <div className="pointer-events-none absolute -top-24 right-[6%] z-[4] size-[22rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-light)_22%,transparent)_0%,color-mix(in_srgb,var(--accent)_10%,transparent)_42%,transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-[8%] z-[4] size-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-light)_22%,transparent)_0%,color-mix(in_srgb,var(--accent-hover)_10%,transparent)_44%,transparent_72%)] blur-2xl" />

        <div className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-center px-5 pt-10 pb-[calc(var(--mobile-bottom-nav-height)+0.75rem)] sm:px-8 sm:pt-12 sm:pb-6 md:px-10 md:pt-12 md:pb-6 lg:px-14 lg:pb-7">
          <div className="w-full max-w-[21rem] min-w-0 sm:max-w-[720px] md:max-w-5xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--header-shell-cinematic-border)] bg-[var(--header-shell-cinematic-bg)] px-3.5 py-2 text-xs font-bold text-[var(--header-nav-cinematic-text)] shadow-[var(--header-shell-cinematic-shadow)] backdrop-blur-md sm:text-[13px]">
              <Sparkles size={14} aria-hidden />
              {eyebrow}
            </div>

            <h1 className="font-system sm:font-lora max-w-full text-[38px] leading-[1.02] font-bold text-[var(--header-nav-cinematic-hover-bg)] drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] sm:max-w-[44rem] sm:text-[58px] md:text-[68px] lg:text-[76px] xl:text-[82px]">
              {headline}
            </h1>

            <p className="mt-4 max-w-[36rem] text-[15px] leading-7 font-semibold text-[color-mix(in_srgb,var(--header-shell-cinematic-text)_92%,transparent)] drop-shadow-[0_5px_18px_rgba(0,0,0,0.34)] sm:text-[17px] sm:leading-8">
              {subtitle}
            </p>

            <HeroSearchIsland />
          </div>
        </div>
      </div>
    </section>
  );
}
