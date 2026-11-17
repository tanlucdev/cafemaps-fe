"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  createCoffeeMeetup,
  getCoffeeMeetup,
  updateCoffeeMeetup,
  type CreateMeetupPayload,
  type MeetupPlaceDraft,
} from "@/apis/coffee-meetups";
import { buildGoogleMapsSearchUrl, isValidExternalCafeUrl } from "@/apis/coffee-meetups/helpers";
import { useRouter } from "@/i18n/navigation";
import { getAuthUser, saveAuthReturnUrl } from "@/lib/auth-client";
import { featureFlags } from "@/lib/feature-flags";
import { trackEvent } from "@/lib/analytics";
import { useCafeSearch } from "./hooks/useCafeSearch";
import type { Cafe, CafeFilter } from "@/types/cafe";
import CafePicker from "./CafePicker";
import {
  ContactField,
  ExternalPlaceFields,
  ParticipantStepper,
  Preview,
  SubmitButton,
  TimeFields,
  input,
} from "./FormPieces";
import PurposeChips from "./PurposeChips";

const today = () => new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function NewMeetupForm({
  cafes,
  preselectedCafeId,
  editMeetupId,
}: {
  cafes: Cafe[];
  preselectedCafeId?: string;
  editMeetupId?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("coffeeMeetups");
  const purposes = t.raw("purposes") as string[];
  const [cafeQuery, setCafeQuery] = useState(
    () => cafes.find((cafe) => cafe.id === preselectedCafeId)?.name ?? "",
  );
  const [vibe, setVibe] = useState("");
  const [nearby, setNearby] = useState<CafeFilter>({});
  const [placeMode, setPlaceMode] = useState<"cafe" | "external">("cafe");
  const [external, setExternal] = useState({ name: "", url: "", district: "" });
  const [form, setForm] = useState<CreateMeetupPayload>({
    cafeId: preselectedCafeId || "",
    purpose: "",
    title: "",
    date: today(),
    startsAt: "09:00",
    endsAt: "11:00",
    maxParticipants: 4,
    description: "",
    contactInfo: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const purposeIndex = purposes.indexOf(form.purpose);
  const hasPurpose = Boolean(form.purpose.trim());
  const { results, searching } = useCafeSearch({ cafes, cafeQuery, locale, hasPurpose, purposeIndex, vibe, nearby, setError, loadError: t("errors.load") });
  const selectedCafe = useMemo(
    () => [...cafes, ...results].find((cafe) => cafe.id === form.cafeId),
    [cafes, results, form.cafeId],
  );
  const placeDraft: MeetupPlaceDraft =
    placeMode === "cafe"
      ? { kind: "cafe", cafeId: form.cafeId }
      : {
          kind: "external",
          name: external.name,
          url: external.url || undefined,
          district: external.district || undefined,
          googleMapsUrl: external.name
            ? buildGoogleMapsSearchUrl(external.name, external.district)
            : undefined,
        };

  useEffect(() => {
    trackEvent("coffee_meetup_create_start");
    if (!getAuthUser()) {
      saveAuthReturnUrl();
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    if (!editMeetupId) return;
    getCoffeeMeetup(editMeetupId)
      .then((meetup) => {
        const start = new Date(meetup.startsAt);
        const end = new Date(meetup.endsAt);
        setForm({
          cafeId: meetup.cafeId,
          purpose: meetup.purpose,
          purposeIcon: meetup.purposeIcon ?? undefined,
          purposeColor: meetup.purposeColor ?? undefined,
          title: meetup.title,
          date: start.toISOString().slice(0, 10),
          startsAt: start.toTimeString().slice(0, 5),
          endsAt: end.toTimeString().slice(0, 5),
          maxParticipants: meetup.maxParticipants,
          description: meetup.description ?? "",
          contactInfo: meetup.contactInfo ?? "",
        });
        setCafeQuery(meetup.cafe?.name ?? "");
      })
      .catch(() => setError(t("errors.loadEdit")));
  }, [editMeetupId, t]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!form.cafeId || !form.purpose) {
      setError(t("form.selectCafe"));
      return;
    }
    if (placeDraft.kind === "external" && !featureFlags.coffeeMeetupsExternalCafeEnabled) {
      setError(t("form.externalGate"));
      return;
    }
    if (placeDraft.kind === "external" && !isValidExternalCafeUrl(external.url)) {
      setError("URL không hợp lệ.");
      return;
    }
    if (placeDraft.kind === "external") {
      setError(t("form.externalUnsupported"));
      return;
    }
    setSubmitting(true);
    try {
      const meetup = editMeetupId
        ? await updateCoffeeMeetup(editMeetupId, form)
        : await createCoffeeMeetup(form);
      trackEvent("coffee_meetup_create_complete", { purpose: form.purpose });
      router.push(`/coffee-meetups/${meetup.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.create"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-32 sm:px-6 sm:pt-24 lg:px-8">
      <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_340px]">
        <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.08em] text-[var(--accent)] uppercase">
                {t("title")}
              </p>
              <h1 className="mt-1 text-3xl font-black text-[var(--foreground)]">
                {editMeetupId ? t("form.editTitle") : t("form.createTitle")}
              </h1>
            </div>
            <div className="grid grid-cols-2 rounded-full border border-[var(--border)] bg-[#fffaf2] p-1 text-sm font-black">
              {(["cafe", "external"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPlaceMode(mode)}
                  className={`rounded-full px-4 py-2 ${placeMode === mode ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--accent)]"}`}
                >
                  {mode === "cafe" ? t("form.cafeMaps") : t("form.externalCafe")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-sm font-black">{t("fields.purpose")}</p>
              <PurposeChips purposes={purposes} form={form} setForm={setForm} />
            </div>
            {placeMode === "cafe" ? (
              <CafePicker
                cafes={results}
                value={form.cafeId}
                query={cafeQuery}
                loading={searching}
                ready={hasPurpose || Boolean(vibe) || Boolean(nearby.nearMe)}
                nearby={nearby}
                onNearby={(filter) => {
                  setNearby(filter);
                  setCafeQuery("");
                  setForm((current) => ({ ...current, cafeId: "" }));
                }}
                vibe={vibe}
                onVibe={(value) => {
                  setVibe(value);
                  setForm((current) => ({ ...current, cafeId: "" }));
                }}
                onQuery={(query) => {
                  setCafeQuery(query);
                  setForm((current) => ({ ...current, cafeId: "" }));
                }}
                onSelect={(cafe) => {
                  setCafeQuery(cafe.name);
                  setForm((current) => ({ ...current, cafeId: cafe.id }));
                }}
                labels={{
                  cafe: t("fields.cafe"),
                  search: t("form.searchCafe"),
                  empty: t("form.emptyCafe"),
                  loading: t("form.searchingCafe"),
                  open: t("form.open"),
                  closed: t("form.closed"),
                }}
              />
            ) : (
              <ExternalPlaceFields external={external} setExternal={setExternal} />
            )}

            <label className="text-sm font-black sm:col-span-2">
              {t("fields.title")}
              <input
                className={`${input} mt-1.5`}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                minLength={4}
                maxLength={100}
                required
              />
            </label>
            <label className="text-sm font-black">
              {t("fields.date")}
              <input
                className={`${input} mt-1.5`}
                type="date"
                min={today()}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>
            <TimeFields form={form} setForm={setForm} />
            <ContactField form={form} setForm={setForm} />
            <div className="text-sm font-black">
              {t("fields.maxParticipants")}
              <ParticipantStepper
                value={form.maxParticipants}
                onChange={(maxParticipants) => setForm({ ...form, maxParticipants })}
              />
            </div>
            <label className="text-sm font-black sm:col-span-2">
              {t("fields.description")}
              <textarea
                className="mt-1.5 min-h-28 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] p-3 text-[16px] lg:text-sm font-semibold focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none"
                maxLength={500}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-[#FCEDEA] p-3 text-sm font-bold text-[#C0392B]"
            >
              {error}
            </p>
          )}
          <SubmitButton submitting={submitting} edit={Boolean(editMeetupId)} />
        </section>
        <Preview
          form={form}
          selectedCafe={selectedCafe}
          external={external}
          placeMode={placeMode}
        />
        <div className="fixed right-0 bottom-0 left-0 border-t border-[var(--border)] bg-[var(--card)] p-3 sm:hidden">
          <SubmitButton submitting={submitting} edit={Boolean(editMeetupId)} sticky />
        </div>
      </form>
    </main>
  );
}
