"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  createCoffeeMeetup,
  getCoffeeMeetup,
  updateCoffeeMeetup,
  type CreateMeetupPayload,
  type MeetupCafe,
} from "@/apis/coffee-meetups";
import { isMeetupGoogleMapsUrl, meetupDateTimeFields, meetupLocalDateTimeToIso } from "@/apis/coffee-meetups/helpers";
import { useRouter } from "@/i18n/navigation";
import { getAuthUser, saveAuthReturnUrl } from "@/lib/auth-client";
import { trackEvent } from "@/lib/analytics";
import { Coffee, MapPin } from "lucide-react";
import type { Cafe } from "@/types/cafe";
import CafePicker from "./CafePicker";
import InvitationPreview from "./InvitationPreview";
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
import InvitationDesign from "../InvitationDesign";
import { getInvitationDesign } from "@/apis/coffee-meetups/invitation";
import MeetupDatePicker from "../MeetupDatePicker";
import { meetupToday } from "../format";
import styles from "../invitation.module.css";

export default function NewMeetupForm({
  cafes,
  preselectedCafeId,
  editMeetupId,
  initialDesign,
}: {
  cafes: Cafe[];
  preselectedCafeId?: string;
  editMeetupId?: string;
  initialDesign: { template?: string; color?: string };
}) {
  const router = useRouter();
  const t = useTranslations("coffeeMeetups");
  const purposes = t.raw("purposes") as string[];
  const [design, setDesign] = useState(() => getInvitationDesign(initialDesign.template, initialDesign.color));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<
    MeetupCafe | undefined
  >(() => cafes.find((cafe) => cafe.id === preselectedCafeId));
  const [placeKind, setPlaceKind] = useState<"cafe" | "external">("cafe");
  const [form, setForm] = useState<CreateMeetupPayload>({
    place: { kind: "cafe", cafeId: preselectedCafeId || "" },
    purpose: "",
    title: "",
    date: meetupToday(),
    startsAt: "09:00",
    endsAt: "11:00",
    maxParticipants: 4,
    description: "",
    contactInfo: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
        const start = meetupDateTimeFields(meetup.startsAt);
        const end = meetupDateTimeFields(meetup.endsAt);
        setForm({
          place: meetup.place,
          purpose: meetup.purpose,
          purposeIcon: meetup.purposeIcon ?? undefined,
          purposeColor: meetup.purposeColor ?? undefined,
          title: meetup.title,
          date: start.date,
          startsAt: start.time,
          endsAt: end.time,
          maxParticipants: meetup.maxParticipants,
          description: meetup.description ?? "",
          contactInfo: meetup.contactInfo ?? "",
        });
        if (meetup.invitationTemplate && meetup.invitationColor) setDesign(getInvitationDesign(meetup.invitationTemplate, meetup.invitationColor));
        setPlaceKind(meetup.place.kind);
        setSelectedCafe(meetup.cafe ?? undefined);
      })
      .catch(() => setError(t("errors.loadEdit")));
  }, [editMeetupId, t]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (
      !form.purpose ||
      (form.place.kind === "cafe" && !form.place.cafeId) ||
      (form.place.kind === "external" &&
        (!form.place.name.trim() || !form.place.googleMapsUrl.trim()))
    ) {
      setError(t("form.selectCafe"));
      return;
    }
    if (form.place.kind === "external" && !isMeetupGoogleMapsUrl(form.place.googleMapsUrl)) return;
    const startsAt = new Date(meetupLocalDateTimeToIso(form.date, form.startsAt));
    const endsAt = new Date(meetupLocalDateTimeToIso(form.date, form.endsAt));
    if (startsAt <= new Date() || endsAt <= startsAt) {
      setError(t("form.invalidTime"));
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, invitationTemplate: design.template, invitationColor: design.color };
      const meetup = editMeetupId
        ? await updateCoffeeMeetup(editMeetupId, payload)
        : await createCoffeeMeetup(payload);
      trackEvent("coffee_meetup_create_complete", { purpose: form.purpose });
      router.push({ pathname: `/coffee-meetups/${meetup.id}`, query: design });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.create"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+5.5rem)] sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">
      <form onSubmit={submit} className={`${styles.editor} mx-auto grid max-w-6xl items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,21.25rem)]`}>
        <section className="min-w-0 rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.08em] text-[#875200] uppercase">
                {t("title")}
              </p>
              <h1 className="mt-1 text-3xl font-black text-[var(--foreground)]">
                {editMeetupId ? t("form.editTitle") : t("form.createTitle")}
              </h1>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-sm font-black">{t("fields.purpose")}</p>
              <PurposeChips
                purposes={purposes}
                form={form}
                setForm={setForm}
                onPurposeSelect={() => {
                  if (placeKind === "cafe") setPickerOpen(true);
                }}
              />
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-sm font-bold">{t("fields.placeType")}</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["cafe", "external"] as const).map((kind) => {
                  const Icon = kind === "cafe" ? Coffee : MapPin;
                  return (
                    <label key={kind} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="meetup-place-kind"
                        value={kind}
                        checked={placeKind === kind}
                        className="peer sr-only"
                        onChange={() => {
                          setPlaceKind(kind);
                          setPickerOpen(false);
                          setSelectedCafe(undefined);
                          setForm((current) => ({
                            ...current,
                            place:
                              kind === "cafe"
                                ? { kind, cafeId: "" }
                                : { kind, name: "", googleMapsUrl: "" },
                          }));
                        }}
                      />
                      <span className="flex h-full items-start gap-2.5 rounded-2xl border border-[var(--border)] p-3 transition-colors peer-checked:border-[#8f5a16] peer-checked:bg-[var(--accent-light)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8f5a16] hover:bg-[var(--accent-light)] sm:p-4">
                        <Icon
                          size={18}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-[var(--accent-hover)]"
                        />
                        <span>
                          <span className="block text-sm font-bold">
                            {t(kind === "cafe" ? "form.savedCafe" : "form.externalPlace")}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[var(--foreground-muted)]">
                            {t(kind === "cafe" ? "form.savedCafeHint" : "form.externalPlaceHint")}
                          </span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            {placeKind === "external" ? (
              <ExternalPlaceFields
                place={
                  form.place.kind === "external"
                    ? form.place
                    : { kind: "external", name: "", googleMapsUrl: "" }
                }
                onChange={(place) => setForm((current) => ({ ...current, place }))}
              />
            ) : (
              <CafePicker
                key={form.purpose}
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                purpose={form.purpose}
                selectedCafe={selectedCafe}
                selectedCafeId={form.place.kind === "cafe" ? form.place.cafeId : ""}
                onSelect={(cafe) => {
                  setSelectedCafe(cafe);
                  setForm((current) => ({ ...current, place: { kind: "cafe", cafeId: cafe.id } }));
                  setPickerOpen(false);
                }}
              />
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
            <MeetupDatePicker
              value={form.date}
              min={meetupToday()}
              onChange={(date) => setForm({ ...form, date })}
            />
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
                className="mt-1.5 min-h-28 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] p-3 text-[16px] font-semibold outline-none focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none lg:text-sm"
                maxLength={500}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
          </div>

          <div className="mt-5 space-y-2">
            <InvitationDesign {...design} onChange={setDesign} />
            <div className="pt-2 lg:hidden">
              <Preview form={form} design={design} selectedCafe={selectedCafe} />
            </div>
            <InvitationPreview form={form} cafe={selectedCafe} design={design} />
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
        <div className="sticky top-24 hidden min-w-0 lg:block">
          <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain">
            <Preview form={form} design={design} selectedCafe={selectedCafe} />
          </div>
        </div>
        <div className="fixed right-0 bottom-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px))] left-0 z-40 border-t border-[var(--border)] bg-[var(--card)] p-3 sm:hidden">
          <SubmitButton submitting={submitting} edit={Boolean(editMeetupId)} sticky />
        </div>
      </form>
    </main>
  );
}
