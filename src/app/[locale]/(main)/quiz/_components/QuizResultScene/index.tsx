"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CircleOff, Coffee, Download, Heart, Moon, RotateCcw, Share2, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { formatCafeArea } from "@/lib/cafe-labels";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { cn, formatPrice } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import type { LocalizedQuizProfile, QuizResult, QuizResultVariant } from "@/types/quiz";
import QuizResultBoardCard from "../QuizResultBoardCard";
import type { BoardLabels } from "../QuizResultBoardCard";

export type ResultLabels = BoardLabels & {
  recommendedCafes: string;
  viewCafe: string;
  retake: string;
  downloadImage: string;
  shareResult: string;
  copied: string;
  savedImage: string;
  shareFallback: string;
  sharing: string;
  shareCancelled: string;
  shareFailed: string;
  copyFailed: string;
  previewNote: string;
};

export default function QuizResultScene({
  result,
  profiles,
  variant,
  locale,
  onRestart,
  reduceMotion,
  labels,
  isPreview,
}: {
  result: QuizResult;
  profiles: LocalizedQuizProfile[];
  variant: QuizResultVariant;
  locale: string;
  onRestart: () => void;
  reduceMotion: boolean;
  labels: ResultLabels;
  isPreview: boolean;
}) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const previewUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/${locale}/quiz?type=${result.profile.id}&dna=${result.dna}&variant=${variant}`;

  async function waitForShareAssets() {
    await document.fonts?.ready;
    await new Promise<void>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Poster image failed to load"));
      image.src = result.profile.posterImage;
    });
  }

  async function renderShareFile() {
    const node = exportRef.current;
    if (!node) throw new Error("Missing result board");
    await waitForShareAssets();
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      width: 1600,
      height: 1000,
      canvasWidth: 3200,
      canvasHeight: 2000,
      backgroundColor: "#fbf4e8",
    });
    const blob = await (await fetch(dataUrl)).blob();
    return new File([blob], `cafe-persona-board-${result.profile.id}-${result.dna}.png`, {
      type: "image/png",
    });
  }

  function saveFile(file: File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function downloadImage(nextStatus = labels.savedImage) {
    if (shareBusy) return;
    setShareBusy(true);
    setStatus(labels.sharing);
    try {
      saveFile(await renderShareFile());
      setStatus(nextStatus);
    } catch {
      setStatus(labels.shareFailed);
    } finally {
      setShareBusy(false);
    }
  }

  async function copyPreviewLink(nextStatus = labels.copied) {
    try {
      await navigator.clipboard.writeText(previewUrl);
      setStatus(nextStatus);
      return true;
    } catch {
      setStatus(labels.copyFailed);
      return false;
    }
  }

  async function shareResult() {
    if (shareBusy) return;
    setShareBusy(true);
    setStatus(labels.sharing);
    try {
      const file = await renderShareFile();
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: result.profile.shareTitle,
            text: result.profile.shareDescription,
            url: previewUrl,
            files: [file],
          });
          setStatus("");
          return;
        } catch (error) {
          if (isShareCancel(error)) {
            setStatus(labels.shareCancelled);
            return;
          }
        }
      }
      saveFile(file);
      const copied = await copyPreviewLink(labels.shareFallback);
      if (!copied) setStatus(labels.copyFailed);
    } catch {
      setStatus(labels.shareFailed);
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <section className="relative min-h-[100svh] bg-[#fbf4e8] px-4 pt-[calc(env(safe-area-inset-top,0px)+5.25rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+2rem)] sm:px-6 lg:px-10 lg:pt-24 dark:bg-[#1e1c1a]">
      <div className="relative mx-auto w-full max-w-[82rem]">
        <motion.div className="relative" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid items-start gap-5 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[0.68fr_1.32fr] lg:items-stretch">
            <div className="relative mx-auto flex min-w-0 flex-col lg:sticky lg:top-24 lg:grid lg:h-full lg:grid-rows-[minmax(0,1fr)_auto]">
              <div className="mx-auto w-[min(100%,19rem)] min-w-0 sm:w-full sm:max-w-[360px] xl:max-w-[390px]">
                <QuizPosterCard result={result} className="aspect-[9/16] w-full lg:h-full lg:aspect-auto" />
              </div>
              <div className="mx-auto mt-3 grid w-[min(100%,19rem)] grid-cols-3 gap-2 sm:w-full sm:max-w-[360px] xl:max-w-[390px]">
                <ActionButton icon={Download} label={labels.downloadImage} onClick={() => void downloadImage()} disabled={shareBusy} />
                <ActionButton icon={Share2} label={labels.shareResult} onClick={() => void shareResult()} disabled={shareBusy} />
                <ActionButton icon={RotateCcw} label={labels.retake} onClick={onRestart} />
              </div>
              <p className="mt-3 min-h-5 text-center text-xs font-semibold text-[#8b6437] lg:absolute lg:top-full lg:right-0 lg:left-0" aria-live="polite">
                {status}
              </p>
            </div>
            <div className="grid gap-4">
              <ResultSummary result={result} labels={labels} isPreview={isPreview} reduceMotion={reduceMotion} />
              <PersonaAnalysis result={result} labels={labels} />
              <PersonaRelations result={result} profiles={profiles} labels={labels} />
            </div>
          </div>
          <RecommendedCafes result={result} labels={labels} locale={locale} reduceMotion={reduceMotion} />
        </motion.div>
        <div className="pointer-events-none fixed top-0 left-[-12000px]">
          <QuizResultBoardCard cardRef={exportRef} result={result} profiles={profiles} labels={labels} className="h-[1000px] w-[1600px]" />
        </div>
      </div>
    </section>
  );
}

function ResultSummary({ result, labels, isPreview, reduceMotion }: { result: QuizResult; labels: ResultLabels; isPreview: boolean; reduceMotion: boolean }) {
  return (
    <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-4 shadow-[0_18px_46px_rgba(88,55,24,0.1)] sm:p-5 dark:bg-[var(--card)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-[6px] border border-[#ead5b7] bg-white/70 px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#9a672f] uppercase">{labels.result}</span>
        <span className="rounded-full bg-[#2c1a0e] px-3 py-1 text-xs font-black text-[#fff7ea]">{result.dna}</span>
      </div>
      {isPreview ? <p className="mt-3 rounded-[8px] border border-[#e6cda2] bg-[#fff7e8] p-3 text-sm leading-6 font-semibold text-[#7a5528]">{labels.previewNote}</p> : null}
      <h1 className="font-lora mt-4 text-3xl leading-tight font-extrabold text-[var(--foreground)] sm:text-5xl">{result.profile.title}</h1>
      <p className="mt-2 text-base font-bold text-[#9a672f]">{result.profile.subtitle}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">{result.profile.description}</p>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--foreground)]">
          <span className="inline-flex items-center gap-2"><Coffee className="size-4 text-[#c8842a]" />{labels.match}</span>
          <span>{result.score}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full border border-[var(--border)] bg-white/50 p-1 dark:bg-white/5">
          <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#7a9e7e,#c8842a,#efc06c)] shadow-[inset_0_-2px_0_rgba(80,42,12,0.14)]" initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {result.chips.map((chip) => <span key={chip} className="rounded-full border border-[#dfbf8f] bg-white/70 px-3 py-1 text-xs font-bold text-[var(--foreground)] dark:bg-white/5">{chip}</span>)}
        </div>
      </div>
    </div>
  );
}

function QuizPosterCard({ result, className }: { result: QuizResult; className?: string }) {
  return <div className={cn("relative isolate overflow-hidden rounded-[8px] bg-[#f7ead7] shadow-[0_24px_60px_rgba(88,55,24,0.18)]", className)}><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${result.profile.posterImage})` }} /></div>;
}

function PersonaAnalysis({ result, labels }: { result: QuizResult; labels: ResultLabels }) {
  return <div className="grid gap-3 sm:grid-cols-3"><AnalysisColumn title={labels.traits} items={result.profile.personalityTraits} icon={Sparkles} /><AnalysisColumn title={labels.bestFor} items={result.profile.bestFor} icon={Coffee} /><AnalysisColumn title={labels.avoidWhen} items={result.profile.avoidWhen} icon={Moon} /></div>;
}

function PersonaRelations({ result, profiles, labels }: { result: QuizResult; profiles: LocalizedQuizProfile[]; labels: ResultLabels }) {
  const relations = getPersonaRelations(result.profile, profiles);
  return <div className="grid gap-3 sm:grid-cols-3"><RelationColumn title={labels.compatiblePersonas} items={relations.compatible} icon={Heart} /><RelationColumn title={labels.incompatiblePersonas} items={relations.incompatible} icon={CircleOff} /><RelationColumn title={labels.pairPersonas} items={relations.pair} icon={Users} /></div>;
}

function RelationColumn({ title, items, icon: Icon }: { title: string; items: LocalizedQuizProfile[]; icon: LucideIcon }) {
  return <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-3 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-[var(--card)]"><div className="mb-2 flex items-center gap-2 text-sm font-black text-[#9a672f]"><Icon className="size-4 text-[#c8842a]" />{title}</div><div className="grid gap-1.5">{items.map((profile) => <div key={profile.id} className="flex min-h-10 items-center gap-2 rounded-[8px] border border-[#ead5b7] bg-[#fff8ee] p-1.5 text-[var(--foreground)] dark:bg-white/5"><div className="size-8 shrink-0 rounded-[6px] border border-white bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${profile.posterImage})` }} /><span className="min-w-0 text-[11px] leading-tight font-bold xl:text-xs">{profile.title}</span></div>)}</div></div>;
}

function AnalysisColumn({ title, items, icon: Icon }: { title: string; items: string[]; icon: LucideIcon }) {
  return <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-3 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-[var(--card)]"><div className="mb-2 flex items-center gap-2 text-sm font-black text-[var(--foreground)]"><Icon className="size-4 text-[#c8842a]" />{title}</div><ul className="space-y-1.5">{items.map((item) => <li key={item} className="text-sm leading-6 text-[var(--foreground-muted)]">{item}</li>)}</ul></div>;
}

function RecommendedCafes({ result, labels, locale, reduceMotion }: { result: QuizResult; labels: ResultLabels; locale: string; reduceMotion: boolean }) {
  return <section className="mt-8"><div className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--foreground)]"><Coffee className="size-4 text-[var(--accent)]" />{labels.recommendedCafes}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.cafes.map((cafe, index) => <CafeRecommendationCard key={cafe.id} cafe={cafe} index={index} locale={locale} labels={labels} reduceMotion={reduceMotion} />)}</div></section>;
}

function CafeRecommendationCard({ cafe, index, locale, labels, reduceMotion }: { cafe: Cafe & { matchReason: string }; index: number; locale: string; labels: ResultLabels; reduceMotion: boolean }) {
  return <motion.article className="relative overflow-hidden rounded-[8px] border border-[#e3ca9f] bg-white/75 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-white/5" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.08 }}><div className="relative aspect-[4/3] bg-[var(--background-secondary)]">{cafe.coverImage || cafe.images[0] ? <Image src={cafe.coverImage ?? cafe.images[0]} alt={cafe.name} fill sizes="(min-width: 1024px) 360px, 50vw" className="object-cover" /> : null}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="line-clamp-1 text-base font-extrabold text-[var(--foreground)]">{cafe.name}</h2><p className="mt-1 text-xs text-[var(--foreground-muted)]">{[formatCafeArea(cafe.district, locale), formatPrice(cafe.priceMin, cafe.priceMax, locale)].filter(Boolean).join(" • ")}</p></div><Sparkles className="mt-1 size-4 shrink-0 text-[#c8842a]" /></div><p className="mt-3 min-h-10 text-sm leading-5 text-[var(--foreground-muted)]">{cafe.matchReason}</p><Link href={`/cafe/${cafe.slug}`} className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-[#2c1a0e] px-4 text-xs font-bold text-[#fff7ea]">{labels.viewCafe}<ArrowRight className="size-3.5" /></Link></div></motion.article>;
}

function ActionButton({ icon: Icon, label, onClick, disabled = false }: { icon: LucideIcon; label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#dfbf8f] bg-white/80 px-3 text-xs font-black text-[var(--foreground)] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:cursor-not-allowed disabled:opacity-55 dark:bg-white/5"><Icon className="size-4" /><span className="truncate">{label}</span></button>;
}

function isShareCancel(error: unknown) {
  return error instanceof DOMException && (error.name === "AbortError" || /cancel/i.test(error.message));
}
