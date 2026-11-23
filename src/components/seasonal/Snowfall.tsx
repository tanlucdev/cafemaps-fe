"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { CircleDot, Snowflake } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STORAGE_KEY = "cafemaps:christmas:snow";

export default function Snowfall() {
  const descriptionId = useId();
  const [mode, setMode] = useState<"off" | "snowflakes" | "snow">("off");
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved === "off" || saved === "snowflakes" || saved === "snow") setMode(saved);
    } catch {
      // Storage can be blocked; the snow control still works in memory.
    }
  }, []);
  const reducedMotion = usePrefersReducedMotion();
  const english = useLocale() === "en";
  const active = mode !== "off" && !reducedMotion;
  const description = english
    ? { off: "Off. Click for snowflakes", snowflakes: "Snowflakes. Click for snow grains", snow: "Snow grains. Click to turn off" }[mode]
    : { off: "Đang tắt. Bấm để bật bông tuyết", snowflakes: "Bông tuyết. Bấm để chuyển sang hạt tuyết", snow: "Hạt tuyết. Bấm để tắt" }[mode];
  const label = reducedMotion
    ? english ? "Snow disabled: reduced motion" : "Tuyết tắt theo cài đặt giảm chuyển động"
    : english ? "Falling snow" : "Tuyết rơi";

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        aria-describedby={descriptionId}
        title={reducedMotion ? label : description}
        disabled={reducedMotion}
        onClick={() => {
          const next = mode === "off" ? "snowflakes" : mode === "snowflakes" ? "snow" : "off";
          setMode(next);
          try { sessionStorage.setItem(STORAGE_KEY, next); } catch { /* Keep the control usable without storage. */ }
        }}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--foreground-muted)] transition-colors hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:cursor-default disabled:opacity-50 min-[390px]:size-9 aria-pressed:bg-[var(--accent-light)] aria-pressed:text-[var(--accent)]"
      >
        {mode === "snow" ? <CircleDot size={17} aria-hidden="true" /> : <Snowflake size={17} aria-hidden="true" />}
      </button>
      <span id={descriptionId} className="sr-only">{reducedMotion ? label : description}</span>
      {active && createPortal(<SnowCanvas snowflakes={mode === "snowflakes"} />, document.body)}
    </>
  );
}

function SnowCanvas({ snowflakes }: { snowflakes: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    // Cache the six-armed shape once; no per-frame SVG, shadows, or DOM particles.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 40;
    const ink = sprite.getContext("2d");
    if (!ink) return;
    ink.translate(20, 20);
    ink.lineCap = "round";
    ink.beginPath();
    for (let arm = 0; arm < 6; arm++) {
      ink.moveTo(0, 0);
      ink.lineTo(0, -16);
      ink.moveTo(-5, -7);
      ink.lineTo(0, -12);
      ink.lineTo(5, -7);
      ink.rotate(Math.PI / 3);
    }
    ink.strokeStyle = "rgba(74, 111, 133, .8)";
    ink.lineWidth = 4;
    ink.stroke();
    ink.strokeStyle = "#fffaf1";
    ink.lineWidth = 1.8;
    ink.stroke();
    let frame = 0;
    let lastTime = 0;
    let width = 0;
    let height = 0;
    // ponytail: 24/56 flakes at 30fps; use a worker only if profiling warrants it.
    let flakes: { x: number; y: number; radius: number; speed: number; phase: number }[] = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      flakes = Array.from({ length: width < 768 ? 24 : 56 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: snowflakes ? 6 + Math.random() * 3 : 2.2 + Math.random() * 1.6,
        speed: 14 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(time: number) {
      frame = requestAnimationFrame(draw);
      if (time - lastTime < 1000 / 30) return;
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      context!.clearRect(0, 0, width, height);
      context!.fillStyle = "rgba(255, 252, 244, .95)";
      context!.strokeStyle = "rgba(74, 111, 133, .7)";
      context!.lineWidth = 1;
      context!.beginPath();
      for (const flake of flakes) {
        flake.y += flake.speed * delta;
        flake.x = (flake.x + Math.sin(time / 2400 + flake.phase) * 8 * delta + width) % width;
        if (flake.y > height + flake.radius) flake.y = -flake.radius;
        if (snowflakes) {
          context!.drawImage(sprite, flake.x - flake.radius, flake.y - flake.radius, flake.radius * 2, flake.radius * 2);
        } else {
          context!.moveTo(flake.x + flake.radius, flake.y);
          context!.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        }
      }
      context!.fill();
      context!.stroke();
    }

    function visibility() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      if (!document.hidden) frame = requestAnimationFrame(draw);
    }

    resize();
    visibility();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [snowflakes]);

  return <canvas ref={ref} data-christmas-snow data-snow-style={snowflakes ? "snowflakes" : "snow"} aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-40 h-full w-full motion-reduce:hidden" />;
}
