"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Loader2, Volume2 } from "lucide-react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";

const TRACK = "/audio/all-i-want-for-christmas-is-you.mp3";

export default function ChristmasMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const english = useLocale() === "en";
  const pathname = usePathname();
  const label = english
    ? playing ? "Pause Christmas music" : "Play Christmas music"
    : playing ? "Tắt nhạc Giáng sinh" : "Bật nhạc Giáng sinh";

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      audio?.removeAttribute("src");
      audio?.load();
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    setError(false);
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setPending(true);
    try {
      if (!audio.getAttribute("src")) {
        audio.src = TRACK;
        audio.volume = 0.35;
      }
      if (audio.error) audio.load();
      await audio.play();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div data-christmas-music className={`fixed z-40 md:top-auto md:right-[92px] md:bottom-6 md:left-auto ${pathname === "/map" ? "top-20 left-4" : "right-4 bottom-[calc(var(--ios-bottom-guard-height,96px)+16px)]"}`}>
      <audio ref={audioRef} preload="none" loop aria-hidden="true"
        onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => { setError(true); setPlaying(false); setPending(false); }} />
      {error && <p role="alert" className={`absolute bottom-16 w-60 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)] shadow-lg ${pathname === "/map" ? "left-0 md:right-0 md:left-auto" : "right-0"}`}>
        {english ? "Music couldn't play. Tap to retry." : "Chưa phát được nhạc. Bấm để thử lại."}
      </p>}
      <button type="button" onClick={toggle} disabled={pending} aria-label={label} aria-pressed={playing} aria-busy={pending}
        title={`${label} · All I Want for Christmas Is You`}
        className="relative grid size-14 cursor-pointer place-items-center rounded-full border border-[var(--accent)] bg-[var(--card)] text-[var(--accent)] shadow-lg transition-colors hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:cursor-wait aria-pressed:bg-[var(--accent)] aria-pressed:text-[var(--accent-foreground)]">
        <Image src="/icons/christmas/music-play.svg" alt="" width={56} height={56} className="pointer-events-none size-14 max-w-none" />
        {(pending || playing) && <span className="pointer-events-none absolute right-0 bottom-0 grid size-5 place-items-center rounded-full bg-[var(--card)] text-[var(--accent)] shadow-sm" aria-hidden="true">
          {pending ? <Loader2 size={12} className="animate-spin motion-reduce:animate-none" /> : <Volume2 size={12} />}
        </span>}
      </button>
    </div>
  );
}
