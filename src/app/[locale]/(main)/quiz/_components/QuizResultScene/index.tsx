"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CircleOff, Coffee, Download, Heart, RotateCcw, Share2, Shuffle, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { downloadQuizResultImage } from "@/apis/quiz";
import { Link } from "@/i18n/navigation";
import ShareLinkModal from "@/components/share/ShareLinkModal";
import { formatCafeArea } from "@/lib/cafe-labels";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { cn, formatPrice } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import type { LocalizedQuizProfile, QuizResult, QuizResultVariant } from "@/types/quiz";
import MobileQuizResultBoardPreview from "../MobileQuizResultBoardPreview";
import type { BoardLabels } from "../MobileQuizResultExportCard";

export type ResultLabels = BoardLabels & {
  recommendedCafes: string;
  viewCafe: string;
  retake: string;
  downloadImage: string;
  shareResult: string;
  copyLink: string;
  copied: string;
  savedImage: string;
  sharing: string;
  shareFailed: string;
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
  const exportCacheRef = useRef<{ key: string; file: Promise<File> } | null>(null);
  const [status, setStatus] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const exportKey = `${variant}:${result.profile.id}:${result.dna}`;
  const previewUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/${locale}/quiz?type=${result.profile.id}&dna=${result.dna}&variant=${variant}`;

  const getExportFormat = useCallback(
    () => (window.matchMedia("(min-width: 1024px)").matches ? "desktop" : "mobile"),
    [],
  );

  const renderShareFile = useCallback(
    async (format: "desktop" | "mobile") => {
      const blob = await downloadQuizResultImage(locale, {
        format,
        variant,
        result: {
          profile: result.profile,
          score: result.score,
          dna: result.dna,
          chips: result.chips,
        },
        profiles,
        labels,
      });
      return new File(
        [blob],
        `cafe-persona-board-${format}-${result.profile.id}-${result.dna}.png`,
        {
          type: "image/png",
        },
      );
    },
    [labels, locale, profiles, result.chips, result.dna, result.profile, result.score, variant],
  );

  const getShareFile = useCallback(() => {
    const format = getExportFormat();
    const key = `${exportKey}:${format}`;
    if (exportCacheRef.current?.key !== key) {
      exportCacheRef.current = { key, file: renderShareFile(format) };
    }
    return exportCacheRef.current.file;
  }, [exportKey, getExportFormat, renderShareFile]);

  function saveFile(file: File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadImage(nextStatus = labels.savedImage) {
    if (shareBusy) return;
    setShareBusy(true);
    setStatus(labels.sharing);
    try {
      saveFile(await getShareFile());
      setStatus(nextStatus);
    } catch {
      setStatus(labels.shareFailed);
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <section className="relative min-h-[100svh] bg-[#fbf4e8] px-3 pt-[calc(env(safe-area-inset-top,0px)+5.75rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+1.25rem)] min-[390px]:px-4 sm:px-6 lg:px-10 lg:pt-24 dark:bg-[#1e1c1a]">
      <div className="relative mx-auto w-full max-w-[82rem]">
        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto grid w-full max-w-[48rem] gap-3 lg:hidden">
            <MobileQuizResultBoardPreview
              result={result}
              profiles={profiles}
              variant={variant}
              labels={labels}
            />
            <div className="grid grid-cols-3 gap-2">
              <ActionButton
                icon={Download}
                label={labels.downloadImage}
                onClick={() => void downloadImage()}
                disabled={shareBusy}
              />
              <ActionButton
                icon={Share2}
                label={labels.shareResult}
                onClick={() => setShareOpen(true)}
              />
              <ActionButton icon={RotateCcw} label={labels.retake} onClick={onRestart} />
            </div>
            <p
              className="min-h-5 text-center text-xs font-semibold text-[#8b6437]"
              aria-live="polite"
            >
              {status}
            </p>
          </div>
          <div className="hidden items-start gap-4 lg:grid lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[0.68fr_1.32fr] lg:items-stretch">
            <div className="relative mx-auto flex min-w-0 flex-col lg:sticky lg:top-24 lg:grid lg:h-full lg:grid-rows-[minmax(0,1fr)_auto]">
              <div className="mx-auto w-[min(100%,19rem)] min-w-0 sm:w-full sm:max-w-[360px] xl:max-w-[390px]">
                <QuizPosterCard
                  result={result}
                  className="aspect-[4/5] max-h-[min(48svh,360px)] w-full sm:aspect-[9/16] sm:max-h-none lg:aspect-auto lg:h-full"
                />
              </div>
              <div className="mx-auto mt-3 grid w-[min(100%,19rem)] grid-cols-3 gap-2 sm:w-full sm:max-w-[360px] xl:max-w-[390px]">
                <ActionButton
                  icon={Download}
                  label={labels.downloadImage}
                  onClick={() => void downloadImage()}
                  disabled={shareBusy}
                />
                <ActionButton
                  icon={Share2}
                  label={labels.shareResult}
                  onClick={() => setShareOpen(true)}
                />
                <ActionButton icon={RotateCcw} label={labels.retake} onClick={onRestart} />
              </div>
              <p
                className="mt-2 min-h-5 text-center text-xs font-semibold text-[#8b6437] lg:absolute lg:top-full lg:right-0 lg:left-0"
                aria-live="polite"
              >
                {status}
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4">
              <ResultSummary
                result={result}
                labels={labels}
                isPreview={isPreview}
                reduceMotion={reduceMotion}
              />
              <PersonaAnalysis result={result} labels={labels} />
              <PersonaRelations result={result} profiles={profiles} labels={labels} />
            </div>
          </div>
          <RecommendedCafes
            result={result}
            labels={labels}
            locale={locale}
            reduceMotion={reduceMotion}
          />
        </motion.div>
        <ShareLinkModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={labels.shareResult}
          links={[
            { key: "quiz", label: labels.copyLink, url: previewUrl, icon: <Share2 size={16} /> },
          ]}
          copyLabel={labels.copyLink}
          copiedLabel={labels.copied}
        />
      </div>
    </section>
  );
}

function ResultSummary({ result, labels, isPreview, reduceMotion }: { result: QuizResult; labels: ResultLabels; isPreview: boolean; reduceMotion: boolean }) {
  return <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-4 shadow-[0_18px_46px_rgba(88,55,24,0.1)] sm:p-5 dark:bg-[var(--card)]"><div className="flex flex-wrap items-center gap-2"><span className="rounded-[6px] border border-[#ead5b7] bg-white/70 px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#9a672f] uppercase">{labels.result}</span><span className="rounded-full bg-[#2c1a0e] px-3 py-1 text-xs font-black text-[#fff7ea]">{result.dna}</span></div>{isPreview ? <p className="mt-3 rounded-[8px] border border-[#e6cda2] bg-[#fff7e8] p-3 text-sm leading-6 font-semibold text-[#7a5528]">{labels.previewNote}</p> : null}<h1 className="font-lora mt-4 text-2xl leading-tight font-extrabold text-[var(--foreground)] sm:text-5xl">{result.profile.title}</h1><p className="mt-2 text-sm font-bold text-[#9a672f] sm:text-base">{result.profile.subtitle}</p><p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)] sm:text-base sm:leading-7">{result.profile.description}</p><div className="mt-4"><div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--foreground)]"><span className="inline-flex items-center gap-2"><Coffee className="size-4 text-[#c8842a]" />{labels.match}</span><span>{result.score}%</span></div><div className="h-4 overflow-hidden rounded-full border border-[var(--border)] bg-white/50 p-1 dark:bg-white/5"><motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#7a9e7e,#c8842a,#efc06c)] shadow-[inset_0_-2px_0_rgba(80,42,12,0.14)]" initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }} /></div><div className="mt-3 flex flex-wrap gap-2">{result.chips.map((chip) => <span key={chip} className="rounded-full border border-[#dfbf8f] bg-white/70 px-3 py-1 text-xs font-bold text-[var(--foreground)] dark:bg-white/5">{chip}</span>)}</div></div></div>;
}
function QuizPosterCard({ result, className }: { result: QuizResult; className?: string }) {
  return <div className={cn("relative isolate overflow-hidden rounded-[8px] bg-[#f7ead7] shadow-[0_24px_60px_rgba(88,55,24,0.18)]", className)}><Image src={result.profile.posterImage} alt={result.profile.title} fill sizes="(min-width: 1280px) 390px, (min-width: 640px) 360px, 76vw" priority quality={90} className="object-cover" /></div>;
}

function PersonaAnalysis({ result, labels }: { result: QuizResult; labels: ResultLabels }) {
  return <div className="grid gap-3 sm:grid-cols-3"><AnalysisColumn title={labels.traits} items={result.profile.personalityTraits} icon={Sparkles} /><AnalysisColumn title={labels.bestFor} items={result.profile.bestFor} icon={Coffee} /><AnalysisColumn title={labels.avoidWhen} items={result.profile.avoidWhen} icon={CircleOff} /></div>;
}

function PersonaRelations({ result, profiles, labels }: { result: QuizResult; profiles: LocalizedQuizProfile[]; labels: ResultLabels }) {
  const relations = getPersonaRelations(result.profile, profiles);
  return <div className="grid gap-3 sm:grid-cols-3"><RelationColumn title={labels.compatiblePersonas} items={relations.compatible} icon={Heart} /><RelationColumn title={labels.incompatiblePersonas} items={relations.incompatible} icon={Shuffle} /><RelationColumn title={labels.pairPersonas} items={relations.pair} icon={Users} /></div>;
}

function RelationColumn({ title, items, icon: Icon }: { title: string; items: LocalizedQuizProfile[]; icon: LucideIcon }) {
  return <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-3 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-[var(--card)]"><div className="mb-2 flex items-center gap-2 text-sm font-black text-[#9a672f]"><Icon className="size-4 text-[#c8842a]" />{title}</div><div className="grid gap-1.5">{items.map((profile) => <div key={profile.id} className="flex min-h-10 items-center gap-2 rounded-[8px] border border-[#ead5b7] bg-[#fff8ee] p-1.5 text-[var(--foreground)] dark:bg-white/5"><div className="size-8 shrink-0 rounded-[6px] border border-white bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${profile.posterImage})` }} /><span className="min-w-0 text-[11px] leading-tight font-bold xl:text-xs">{profile.title}</span></div>)}</div></div>;
}

function AnalysisColumn({ title, items, icon: Icon }: { title: string; items: string[]; icon: LucideIcon }) {
  return <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-3 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-[var(--card)]"><div className="mb-2 flex items-center gap-2 text-sm font-black text-[var(--foreground)]"><Icon className="size-4 text-[#c8842a]" />{title}</div><ul className="space-y-1.5">{items.map((item) => <li key={item} className="text-sm leading-6 text-[var(--foreground-muted)]">{item}</li>)}</ul></div>;
}

function RecommendedCafes({ result, labels, locale, reduceMotion }: { result: QuizResult; labels: ResultLabels; locale: string; reduceMotion: boolean }) {
  return <section className="mt-6 sm:mt-8"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--foreground)] sm:mb-4"><Coffee className="size-4 text-[var(--accent)]" />{labels.recommendedCafes}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.cafes.map((cafe, index) => <CafeRecommendationCard key={cafe.id} cafe={cafe} index={index} locale={locale} labels={labels} reduceMotion={reduceMotion} />)}</div></section>;
}

function CafeRecommendationCard({ cafe, index, locale, labels, reduceMotion }: { cafe: Cafe & { matchReason: string }; index: number; locale: string; labels: ResultLabels; reduceMotion: boolean }) {
  return <motion.article className="relative overflow-hidden rounded-[8px] border border-[#e3ca9f] bg-white/75 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-white/5" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.08 }}><div className="relative aspect-[4/3] bg-[var(--background-secondary)]">{cafe.coverImage || cafe.images[0] ? <Image src={cafe.coverImage ?? cafe.images[0]} alt={cafe.name} fill sizes="(min-width: 1024px) 360px, 50vw" className="object-cover" /> : null}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="line-clamp-1 text-base font-extrabold text-[var(--foreground)]">{cafe.name}</h2><p className="mt-1 text-xs text-[var(--foreground-muted)]">{[formatCafeArea(cafe.district, locale), formatPrice(cafe.priceMin, cafe.priceMax, locale)].filter(Boolean).join(" • ")}</p></div><Sparkles className="mt-1 size-4 shrink-0 text-[#c8842a]" /></div><p className="mt-3 min-h-10 text-sm leading-5 text-[var(--foreground-muted)]">{cafe.matchReason}</p><Link href={`/cafe/${cafe.slug}`} className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-[#2c1a0e] px-4 text-xs font-bold text-[#fff7ea]">{labels.viewCafe}<ArrowRight className="size-3.5" /></Link></div></motion.article>;
}

function ActionButton({ icon: Icon, label, onClick, disabled = false }: { icon: LucideIcon; label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-full border border-[#dfbf8f] bg-white/80 px-2 text-xs font-black text-[var(--foreground)] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:cursor-not-allowed disabled:opacity-55 sm:h-11 sm:px-3 dark:bg-white/5"><Icon className="size-4 shrink-0" /><span className="min-w-0 truncate">{label}</span></button>;
}
