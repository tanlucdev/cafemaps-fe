import Image from "next/image";
import Link from "next/link";
import { Coffee, Home } from "lucide-react";

interface NotFoundExperienceProps {
  title: string;
  description: string;
  homeHref: string;
  homeLabel: string;
}

export default function NotFoundExperience({
  title,
  description,
  homeHref,
  homeLabel,
}: NotFoundExperienceProps) {
  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#1f1209] px-4 py-10 text-center text-[#fff7e8]">
      <Image
        src="/image/home-hero-video-frame-20260703.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-55 saturate-[0.9] sepia-[0.16]"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_26%_20%,rgba(255,216,145,0.32),transparent_26%),linear-gradient(115deg,rgba(31,18,9,0.96)_0%,rgba(31,18,9,0.78)_48%,rgba(31,18,9,0.38)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(31,18,9,0.1),rgba(31,18,9,0.76))]" />

      <section className="mx-auto flex w-full max-w-xl flex-col items-center">
        <Link
          href={homeHref}
          className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[#ffe3b7]/22 bg-[#fff1d6]/12 px-3.5 py-2 text-sm font-bold text-[#fff0d4] shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:bg-[#fff1d6]/18 focus-visible:ring-3 focus-visible:ring-[#ffe3b7]/60 focus-visible:outline-none"
        >
          <Image
            src="/image/logo-icon-transparent.png"
            alt=""
            width={28}
            height={28}
            className="rounded-full bg-[#fff7e8]"
          />
          Cafe Maps
        </Link>

        <p className="mt-4 text-sm font-black tracking-[0.18em] text-[#ffd891] uppercase">404</p>

        <div className="mt-8 flex size-20 items-center justify-center rounded-full border border-[#ffe3b7]/24 bg-[#fff1d6]/12 shadow-[0_18px_44px_rgba(0,0,0,0.22)] backdrop-blur-md">
          <Coffee size={38} aria-hidden="true" />
        </div>

        <h1 className="font-lora mt-6 text-3xl leading-tight font-bold text-balance text-[#fff7e8] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-[#fff0d4]/78">{description}</p>

        <Link
          href={homeHref}
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ffe3b7]/28 bg-[#f4b35d] px-5 text-sm font-black text-[#2c1a0e] shadow-[0_14px_34px_rgba(244,179,93,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ffd891] focus-visible:ring-3 focus-visible:ring-[#ffe3b7]/70 focus-visible:outline-none"
        >
          <Home size={16} />
          {homeLabel}
        </Link>
      </section>
    </main>
  );
}
