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
};

export function CafeHeroCinematic({
  eyebrow,
  headline,
  subtitle,
  primaryCta,
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
      className="relative isolate h-[100svh] w-full max-w-[100vw] overflow-hidden bg-[var(--background)] p-2 pt-[calc(62px+0.5rem)] text-[#fff6e8] sm:p-3 sm:pt-[calc(62px+0.75rem)] md:p-4 md:pt-[calc(62px+1rem)]"
    >
      <div className="relative h-full min-h-0 w-full max-w-full overflow-hidden rounded-[24px] border border-[#ffe3b7]/20 bg-[#4a2a16] shadow-[0_22px_62px_rgba(18,10,5,0.24),0_12px_42px_rgba(245,166,58,0.12)] sm:rounded-[30px] md:rounded-[36px]">
        <motion.div className="absolute inset-0 z-0" style={{ y: videoY }}>
          <motion.video
            className="h-[106%] w-full object-cover brightness-[1.14] contrast-[0.96] saturate-[1.08]"
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

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(55,31,12,0.10)_0%,rgba(184,108,42,0.06)_42%,rgba(26,14,6,0.34)_100%)]" />
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(24,13,5,0.54)_0%,rgba(72,41,20,0.34)_34%,rgba(94,54,28,0.10)_62%,rgba(28,15,6,0.22)_100%)]" />
        <div className="absolute inset-0 z-[3] opacity-[0.12] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.78%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.62%22/%3E%3C/svg%3E')]" />
        <motion.div
          className="pointer-events-none absolute -top-24 right-[6%] z-[4] size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,202,121,0.29)_0%,rgba(190,112,42,0.13)_42%,transparent_70%)] blur-2xl"
          style={{ y: glowY }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-[-8rem] left-[8%] z-[4] size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,246,224,0.25)_0%,rgba(168,92,36,0.12)_44%,transparent_72%)] blur-2xl"
          style={{ y: glowY }}
        />

        <DecorativeCluster pointerX={smoothX} pointerY={smoothY} reduceMotion={Boolean(reduceMotion)} />

        <motion.div
          className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-end px-5 pt-10 pb-[calc(var(--mobile-bottom-nav-height)+0.75rem)] sm:px-8 sm:pt-12 sm:pb-6 md:px-10 md:pt-12 md:pb-6 lg:px-14 lg:pb-7"
          style={{ opacity: contentOpacity, scale: contentScale }}
        >
          <div className="w-full min-w-0 max-w-[21rem] sm:max-w-[720px]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.72, ease: MAIN_EASE }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/28 bg-[#3a2112]/34 px-3.5 py-2 text-xs font-bold text-[#ffe7bd] shadow-[0_10px_28px_rgba(0,0,0,0.12),0_8px_24px_rgba(245,166,58,0.08)] backdrop-blur-md sm:text-[13px]"
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
              className="mt-4 max-w-[36rem] text-[15px] leading-7 font-semibold text-[#fff0d4]/92 drop-shadow-[0_5px_18px_rgba(0,0,0,0.34)] sm:text-[17px] sm:leading-8"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ delay: 0.62, duration: 0.76, ease: MAIN_EASE }}
              className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/search"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#fff0d2] px-6 py-3 text-sm font-black text-[#201006] shadow-[0_18px_42px_rgba(245,190,104,0.28)] outline-none transition-all hover:-translate-y-0.5 hover:bg-[#fff7e8] focus-visible:ring-2 focus-visible:ring-[#ffe3b7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#160b05] sm:w-auto sm:text-base"
              >
                {primaryCta}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
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
      className="font-lora max-w-full text-[38px] leading-[1.02] font-bold text-[#fff7e8] drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] sm:max-w-[44rem] sm:text-[58px] md:text-[68px] lg:text-[76px] xl:text-[82px]"
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
            className="w-[270px] rounded-[26px] border border-[#ffe6bd]/26 bg-[#3a2112]/46 p-4 text-[#fff2d9] shadow-[0_20px_58px_rgba(0,0,0,0.28),0_12px_36px_rgba(245,166,58,0.1)] backdrop-blur-xl"
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
          className="rounded-full border border-[#ffe3b7]/26 bg-[#4a2a16]/42 px-4 py-2 text-sm font-black text-[#fff0d2] shadow-[0_14px_34px_rgba(0,0,0,0.2),0_8px_24px_rgba(245,166,58,0.08)] backdrop-blur-lg"
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
            <MapPin className="h-6 w-6 fill-[#ffd18c] text-[#ffd18c] drop-shadow-[0_6px_16px_rgba(0,0,0,0.28)]" />
          </foreignObject>
        </g>
      ))}
      <foreignObject x="245" y="136" width="92" height="40">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ffe3b7]/28 bg-[#3a2112]/46 px-3 py-2 text-xs font-black text-[#fff0d2] shadow-[0_8px_22px_rgba(245,166,58,0.08)] backdrop-blur-md">
          <Navigation size={13} />
          Q.1
        </div>
      </foreignObject>
    </svg>
  );
}
