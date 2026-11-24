"use client";

import { useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, Check, LoaderCircle, MapPin, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getCafeDistricts } from "@/apis/cafes";
import { meetupPurposeLabel } from "@/apis/coffee-meetups/helpers";
import type { Cafe, CafeFilter } from "@/types/cafe";
import GuidedFilterBar from "@/components/cafe/GuidedFilterBar";
import { useCafeSearch } from "./hooks/useCafeSearch";
import CafeOption from "./CafeOption";
import { input } from "./FormPieces";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purpose: string;
  selectedCafe?: Pick<Cafe, "id" | "name" | "district">;
  selectedCafeId: string;
  onSelect: (cafe: Cafe) => void;
};

export default function CafePicker({
  open,
  onOpenChange,
  purpose,
  selectedCafe,
  selectedCafeId,
  onSelect,
}: Props) {
  const t = useTranslations("coffeeMeetups");
  const locale = useLocale();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [cafeQuery, setCafeQuery] = useState("");
  const [filter, setFilter] = useState<CafeFilter>({});
  const [page, setPage] = useState(1);
  const { data: districts } = useQuery({
    queryKey: ["cafe-districts", locale],
    queryFn: () => getCafeDistricts(locale),
    enabled: open,
    staleTime: 60 * 60 * 1000,
  });
  const { results, searching, hasMore, total, error, retry } = useCafeSearch({
    enabled: open,
    cafeQuery,
    locale,
    purpose,
    filter,
    page,
  });
  function changeOpen(next: boolean) {
    setPage(1);
    if (next) setCafeQuery("");
    onOpenChange(next);
  }
  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <div className="sm:col-span-2">
        <p className="mb-1.5 text-sm font-bold">{t("fields.cafe")}</p>
        <Dialog.Trigger
          ref={triggerRef}
          className="flex min-h-20 w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent-hover)]">
            {selectedCafeId ? (
              <Check size={20} aria-hidden="true" />
            ) : (
              <MapPin size={20} aria-hidden="true" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">
              {selectedCafe?.name ?? t(selectedCafeId ? "form.selectedCafe" : "form.pickCafe")}
            </span>
            <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
              {selectedCafe?.district ?? t(selectedCafeId ? "form.changeCafe" : "form.pickerHint")}
            </span>
          </span>
          <ArrowRight
            size={17}
            aria-hidden="true"
            className="shrink-0 text-[var(--foreground-muted)]"
          />
        </Dialog.Trigger>
      </div>
      <Dialog.Portal className="relative z-[85]">
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm" />
        <Dialog.Popup
          initialFocus={titleRef}
          finalFocus={triggerRef}
          className="fixed top-1/2 left-1/2 z-50 flex h-[min(88svh,860px)] w-[calc(100%-1.5rem)] max-w-5xl -translate-1/2 flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-xl outline-none data-nested-dialog-open:blur-sm"
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4 sm:px-7">
            <div>
              <Dialog.Title
                ref={titleRef}
                tabIndex={-1}
                className="font-lora text-xl outline-none sm:text-2xl"
              >
                {t("form.pickerTitle")}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                {t("form.pickerDescription")}
                {purpose && (
                  <span className="ml-1 font-semibold text-[var(--accent-hover)]">
                    · {meetupPurposeLabel(purpose, t.raw("purposes") as string[])}
                  </span>
                )}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t("form.closePicker")}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--accent-light)]"
            >
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-3 border-b border-[var(--border)] px-5 py-4 sm:px-7">
              <label className="relative block min-w-0">
                <span className="sr-only">{t("form.searchCafe")}</span>
                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3.5 left-3 text-[var(--foreground-muted)]"
                />
                <input
                  type="search"
                  value={cafeQuery}
                  onChange={(event) => {
                    setCafeQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder={t("form.searchCafe")}
                  className={`${input} pl-10`}
                />
              </label>
              <GuidedFilterBar
                inline
                filter={filter}
                districts={districts}
                onChange={(next) => {
                  setFilter(next);
                  setPage(1);
                }}
              />
            </div>
            <div className="px-5 py-5 sm:px-7" aria-busy={searching}>
              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl bg-[var(--status-closed-background)] p-4 text-sm text-[var(--status-closed-foreground)]"
                >
                  {t("errors.load")}
                  <button type="button" onClick={retry} className="ml-3 font-bold underline">
                    {t("form.retryCafes")}
                  </button>
                </div>
              )}
              <ul
                aria-label={t("form.pickerTitle")}
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {results.map((cafe) => (
                  <li key={cafe.id}>
                    <CafeOption
                      cafe={cafe}
                      selected={cafe.id === selectedCafeId}
                      nearMe={filter.nearMe}
                      onSelect={(cafe) => {
                        setPage(1);
                        onSelect(cafe);
                      }}
                    />
                  </li>
                ))}
              </ul>
              {searching && (
                <p
                  role="status"
                  className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--foreground-muted)]"
                >
                  <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
                  {t("form.searchingCafe")}
                </p>
              )}
              {!searching && !error && !results.length && (
                <div role="status" className="py-12 text-center">
                  <MapPin
                    size={30}
                    aria-hidden="true"
                    className="mx-auto mb-3 text-[var(--accent)]"
                  />
                  <p className="text-sm font-semibold">{t("form.emptyCafe")}</p>
                  <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                    {t("form.pickerEmptyHint")}
                  </p>
                </div>
              )}
              {hasMore && !error && (
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    disabled={searching}
                    onClick={() => setPage(page + 1)}
                    className="h-11 rounded-full border border-[var(--border)] px-6 text-sm font-bold hover:bg-[var(--accent-light)] disabled:opacity-50"
                  >
                    {t("form.moreCafes")}
                  </button>
                </div>
              )}
            </div>
          </div>
          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3 sm:px-7">
            <p role="status" className="text-xs text-[var(--foreground-muted)]">
              {searching
                ? t("form.searchingCafe")
                : error
                  ? t("form.pickerHint")
                  : t("form.cafeResults", { count: results.length, total })}
            </p>
            <Dialog.Close className="h-10 shrink-0 rounded-full border border-[var(--border)] px-4 text-xs font-semibold hover:bg-[var(--accent-light)]">
              {t("form.closePicker")}
            </Dialog.Close>
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
