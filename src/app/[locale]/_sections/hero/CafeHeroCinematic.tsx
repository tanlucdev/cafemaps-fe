import { Sparkles } from "lucide-react";
import { HeroVideoBackdrop } from "./HeroVideoBackdrop";
import { HeroSearchIsland } from "./HeroSearchIsland";

const HERO_POSTER = "/image/home-hero-video-frame-20260703.webp";

type CafeHeroCinematicProps = {
  eyebrow: string;
  headline: string;
  subtitle: string;
};

export function CafeHeroCinematic({
  eyebrow,
  headline,
  subtitle,
}: CafeHeroCinematicProps) {
  return (
    <section className="relative isolate h-[100svh] w-full max-w-[100vw] overflow-hidden bg-[var(--background)] p-2 pt-[calc(62px+0.5rem)] text-[#fff6e8] sm:p-3 sm:pt-[calc(62px+0.75rem)] md:p-4 md:pt-[calc(62px+1rem)]">
      <div className="relative h-full min-h-0 w-full max-w-full overflow-hidden rounded-[24px] border border-[#ffe3b7]/20 bg-[#4a2a16] shadow-[0_22px_62px_rgba(18,10,5,0.24),0_12px_42px_rgba(245,166,58,0.12)] sm:rounded-[30px] md:rounded-[36px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[url('/image/home-hero-video-frame-mobile-20260703.webp')] bg-cover bg-center brightness-[1.08] contrast-[0.98] saturate-[1.06] md:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 hidden bg-[url('/image/home-hero-video-frame-20260703.webp')] bg-cover bg-center brightness-[1.08] contrast-[0.98] saturate-[1.06] md:block"
        />

        <HeroVideoBackdrop poster={HERO_POSTER} />

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(55,31,12,0.08)_0%,rgba(184,108,42,0.06)_42%,rgba(26,14,6,0.38)_100%)]" />
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(20,11,5,0.68)_0%,rgba(60,34,18,0.44)_40%,rgba(94,54,28,0.14)_66%,rgba(28,15,6,0.24)_100%)]" />
        <div className="absolute inset-0 z-[3] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.78%22_numOctaves=%222%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.48%22/%3E%3C/svg%3E')] opacity-[0.08] mix-blend-overlay" />
        <div className="pointer-events-none absolute -top-24 right-[6%] z-[4] size-[22rem] rounded-full bg-[radial-gradient(circle,rgba(255,202,121,0.22)_0%,rgba(190,112,42,0.1)_42%,transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-[8%] z-[4] size-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,246,224,0.22)_0%,rgba(168,92,36,0.1)_44%,transparent_72%)] blur-2xl" />

        <div className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-center px-5 pt-10 pb-[calc(var(--mobile-bottom-nav-height)+0.75rem)] sm:px-8 sm:pt-12 sm:pb-6 md:px-10 md:pt-12 md:pb-6 lg:px-14 lg:pb-7">
          <div className="w-full max-w-[21rem] min-w-0 sm:max-w-[720px] md:max-w-5xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/28 bg-[#3a2112]/34 px-3.5 py-2 text-xs font-bold text-[#ffe7bd] shadow-[0_10px_28px_rgba(0,0,0,0.12),0_8px_24px_rgba(245,166,58,0.08)] backdrop-blur-md sm:text-[13px]">
              <Sparkles size={14} aria-hidden />
              {eyebrow}
            </div>

            <h1 className="font-system sm:font-lora max-w-full text-[38px] leading-[1.02] font-bold text-[#fff7e8] drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] sm:max-w-[44rem] sm:text-[58px] md:text-[68px] lg:text-[76px] xl:text-[82px]">
              {headline}
            </h1>

            <p className="mt-4 max-w-[36rem] text-[15px] leading-7 font-semibold text-[#fff0d4]/92 drop-shadow-[0_5px_18px_rgba(0,0,0,0.34)] sm:text-[17px] sm:leading-8">
              {subtitle}
            </p>

            <HeroSearchIsland />
          </div>
        </div>
      </div>
    </section>
  );
}
