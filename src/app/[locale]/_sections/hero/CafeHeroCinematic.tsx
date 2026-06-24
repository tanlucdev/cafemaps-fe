"use client";

import type { MotionValue } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Coffee, MapPin, Navigation, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { HeroSearchIsland } from "./HeroSearchIsland";

const MAIN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SECONDARY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIDEO_URL = "/background.mp4";

type CafeHeroCinematicProps = {
  eyebrow: string;
  headline: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
};

export function CafeHeroCinematic({
  eyebrow,
  headline,
  subtitle,
  primaryCta,
  secondaryCta,
}: CafeHeroCinematicProps) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 24, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 24, mass: 0.4 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 46]);
  const glowY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -28]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.76, 1], [1, 1, 0.82]);
  const contentScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 0.985]);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative isolate min-h-[100svh] w-full max-w-[100vw] overflow-hidden bg-[#120a05] p-3 pt-[calc(62px+0.75rem)] text-[#fff6e8] sm:p-4 sm:pt-[calc(62px+1rem)] md:p-6 md:pt-[calc(62px+1.5rem)]"
    >
      <div className="relative min-h-[calc(100svh-62px-1.5rem)] w-full max-w-full overflow-hidden rounded-[28px] border border-[#f4d9ad]/14 bg-[#120a05] shadow-[0_30px_90px_rgba(18,10,5,0.45)] sm:min-h-[calc(100svh-62px-2rem)] sm:rounded-[36px] md:min-h-[calc(100svh-62px-3rem)] md:rounded-[44px]">
        <motion.div className="absolute inset-0 z-0" style={{ y: videoY }}>
          <motion.video
            className="h-[108%] w-full object-cover"
            src={VIDEO_URL}
            poster="/image/home-polaroid-1.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            initial={false}
            animate={reduceMotion ? { scale: 1.03 } : { scale: [1.03, 1.08, 1.03], x: [0, -10, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(12,7,4,0.34)_0%,rgba(72,42,19,0.1)_42%,rgba(10,6,3,0.78)_100%)]" />
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(10,6,3,0.86)_0%,rgba(20,10,4,0.68)_34%,rgba(22,12,6,0.24)_62%,rgba(8,5,3,0.54)_100%)]" />
        <div className="absolute inset-0 z-[3] opacity-[0.12] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.78%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.62%22/%3E%3C/svg%3E')]" />
        <motion.div
          className="pointer-events-none absolute -top-24 right-[6%] z-[4] size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(245,187,96,0.22)_0%,rgba(165,91,34,0.08)_42%,transparent_70%)] blur-2xl"
          style={{ y: glowY }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-[-8rem] left-[8%] z-[4] size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,242,213,0.18)_0%,rgba(132,74,31,0.08)_44%,transparent_72%)] blur-2xl"
          style={{ y: glowY }}
        />

        <DecorativeCluster pointerX={smoothX} pointerY={smoothY} reduceMotion={Boolean(reduceMotion)} />

        <motion.div
          className="relative z-10 flex min-h-[calc(100svh-62px-1.5rem)] w-full min-w-0 items-end px-5 pt-14 pb-9 sm:min-h-[calc(100svh-62px-2rem)] sm:px-8 sm:pt-16 sm:pb-12 md:min-h-[calc(100svh-62px-3rem)] md:px-12 lg:px-16 lg:pb-14"
          style={{ opacity: contentOpacity, scale: contentScale }}
        >
          <div className="w-full min-w-0 max-w-[21rem] sm:max-w-[720px]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.72, ease: MAIN_EASE }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/20 bg-[#1f1209]/46 px-3.5 py-2 text-xs font-bold text-[#ffe7bd] shadow-[0_12px_34px_rgba(0,0,0,0.2)] backdrop-blur-md sm:text-[13px]"
            >
              <Sparkles size={14} aria-hidden />
              {eyebrow}
            </motion.div>

            <WordsPullUp text={headline} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ delay: 0.42, duration: 0.78, ease: MAIN_EASE }}
              className="mt-5 max-w-[36rem] text-[15px] leading-7 font-semibold text-[#fff0d4]/88 drop-shadow-[0_6px_22px_rgba(0,0,0,0.48)] sm:text-lg sm:leading-8"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ delay: 0.62, duration: 0.76, ease: MAIN_EASE }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/search"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#fff0d2] px-6 py-3 text-sm font-black text-[#201006] shadow-[0_18px_42px_rgba(245,190,104,0.28)] outline-none transition-all hover:-translate-y-0.5 hover:bg-[#fff7e8] focus-visible:ring-2 focus-visible:ring-[#ffe3b7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#160b05] sm:w-auto sm:text-base"
              >
                {primaryCta}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/quiz"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#ffe3b7]/22 bg-[#211208]/42 px-6 py-3 text-sm font-bold text-[#fff3de] shadow-[0_14px_34px_rgba(0,0,0,0.2)] outline-none backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#ffe3b7]/42 hover:bg-[#392113]/58 focus-visible:ring-2 focus-visible:ring-[#ffe3b7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#160b05] sm:w-auto sm:text-base"
              >
                {secondaryCta}
              </Link>
            </motion.div>

            <HeroSearchIsland />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WordsPullUp({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <motion.h1
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12%" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.075 } },
      }}
      className="font-lora max-w-full text-[38px] leading-[1.02] font-bold text-[#fff7e8] drop-shadow-[0_10px_34px_rgba(0,0,0,0.66)] sm:max-w-[44rem] sm:text-[64px] md:text-[78px] lg:text-[88px]"
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.78, ease: MAIN_EASE }}
          className="mr-[0.18em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function DecorativeCluster({
  pointerX,
  pointerY,
  reduceMotion,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduceMotion: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] hidden lg:block">
      <HeroMotionLayer pointerX={pointerX} pointerY={pointerY} strength={26} className="right-[8%] bottom-[12%]">
        <motion.div
          initial={{ opacity: 0, y: 18, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 0.7, duration: 0.8, ease: MAIN_EASE }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [-8, 8, -8], rotate: [-1.2, 1.2, -1.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[270px] rounded-[26px] border border-[#ffe6bd]/18 bg-[#1d1008]/58 p-4 text-[#fff2d9] shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[#fff0d2] text-[#301706]">
                <Coffee size={21} />
              </span>
              <div>
                <p className="text-sm font-black">Quiet corner found</p>
                <p className="text-xs font-semibold text-[#ffe7bd]/70">3 phút từ vị trí của bạn</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['Yên tĩnh', 'Ổ cắm', 'Ấm'].map((label) => (
                <span key={label} className="rounded-full border border-[#ffe3b7]/16 bg-white/8 px-2.5 py-1 text-center text-[11px] font-bold text-[#fff2d9]/82">
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </HeroMotionLayer>

      <HeroMotionLayer pointerX={pointerX} pointerY={pointerY} strength={-18} className="right-[24%] top-[18%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.72, ease: MAIN_EASE }}
          className="rounded-full border border-[#ffe3b7]/18 bg-[#201006]/48 px-4 py-2 text-sm font-black text-[#fff0d2] shadow-[0_18px_44px_rgba(0,0,0,0.3)] backdrop-blur-lg"
        >
          Vintage mood
        </motion.div>
      </HeroMotionLayer>

      <HeroMotionLayer pointerX={pointerX} pointerY={pointerY} strength={14} className="right-[13%] top-[30%]">
        <AnimatedRoute reduceMotion={reduceMotion} />
      </HeroMotionLayer>
    </div>
  );
}

function HeroMotionLayer({
  pointerX,
  pointerY,
  strength,
  className,
  children,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  strength: number;
  className: string;
  children: ReactNode;
}) {
  const x = useTransform(pointerX, (value) => value * strength);
  const y = useTransform(pointerY, (value) => value * strength * 0.7);

  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

function AnimatedRoute({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg width="360" height="220" viewBox="0 0 360 220" fill="none" aria-hidden>
      <motion.path
        d="M46 164 C92 84 146 192 190 112 C226 46 278 64 316 34"
        stroke="rgba(255,229,188,0.62)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 12"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 1.5, delay: 0.82, ease: SECONDARY_EASE }}
      />
      {[
        [46, 164],
        [190, 112],
        [316, 34],
      ].map(([cx, cy], index) => (
        <g key={`${cx}-${cy}`}>
          <motion.circle
            cx={cx}
            cy={cy}
            r="18"
            fill="rgba(255,202,121,0.16)"
            animate={reduceMotion ? undefined : { scale: [0.84, 1.2, 0.84], opacity: [0.22, 0.48, 0.22] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.42, ease: "easeInOut" }}
          />
          <foreignObject x={cx - 12} y={cy - 27} width="24" height="30">
            <MapPin className="h-6 w-6 fill-[#ffd18c] text-[#ffd18c] drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]" />
          </foreignObject>
        </g>
      ))}
      <foreignObject x="245" y="136" width="92" height="40">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ffe3b7]/20 bg-[#1b0e07]/58 px-3 py-2 text-xs font-black text-[#fff0d2] backdrop-blur-md">
          <Navigation size={13} />
          Q.1
        </div>
      </foreignObject>
    </svg>
  );
}
