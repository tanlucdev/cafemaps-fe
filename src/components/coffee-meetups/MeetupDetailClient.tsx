"use client";

import { useEffect, useMemo, useState } from "react";
import { Flag, LoaderCircle, Share2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  acceptMeetupRequest,
  cancelCoffeeMeetup,
  completeCoffeeMeetup,
  getCoffeeMeetup,
  rejectMeetupRequest,
  reportCoffeeMeetup,
  requestToJoinMeetup,
  withdrawMeetupRequest,
  type CoffeeMeetup,
  type MeetupReportReason,
} from "@/apis/coffee-meetups";
import { getAuthUser, saveAuthReturnUrl } from "@/lib/auth-client";
import { trackEvent } from "@/lib/analytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMeetupTime, isEnded, remainingSeats } from "./format";
import PurposeIcon from "./PurposeIcon";

export default function MeetupDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const t = useTranslations("coffeeMeetups");
  const reportReasons = t.raw("reportReasons") as string[];
  const [meetup, setMeetup] = useState<CoffeeMeetup | null>(null);
  const [message, setMessage] = useState("");
  const [reportReason, setReportReason] = useState<MeetupReportReason>(reportReasons[0] ?? "Spam");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const user = typeof window === "undefined" ? null : getAuthUser();

  const myPending = meetup?.requests.find(
    (r) => r.requesterId === user?.id && r.status === "pending",
  );
  const ended = meetup ? isEnded(meetup) || meetup.status === "completed" : false;
  const seats = meetup ? remainingSeats(meetup) : 0;
  const isOwner = Boolean(user && meetup?.organizerId === user.id);
  const cta = useMemo(() => {
    if (!user) return t("cta.login");
    if (ended) return t("cta.ended");
    if (meetup?.myRequestStatus === "accepted") return t("cta.joined");
    if (meetup?.myRequestStatus === "pending") return t("cta.pending");
    if (seats <= 0 || meetup?.status === "full") return t("cta.full");
    return t("cta.join");
  }, [ended, meetup, seats, t, user]);

  useEffect(() => {
    trackEvent("coffee_meetup_detail_view");
    getCoffeeMeetup(id)
      .then(setMeetup)
      .catch((err) => setError(err instanceof Error ? err.message : t("errors.load")));
  }, [id, t]);

  async function reload() {
    setMeetup(await getCoffeeMeetup(id));
  }

  async function join() {
    if (!user) {
      saveAuthReturnUrl();
      router.push("/login");
      return;
    }
    setBusy(true);
    try {
      setMeetup(await requestToJoinMeetup(id, message));
      trackEvent("coffee_meetup_request_send");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.request"));
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share)
      await navigator.share({ title: meetup?.title, text: meetup?.cafe?.name, url });
    else await navigator.clipboard.writeText(url);
    trackEvent("coffee_meetup_share");
  }

  if (error)
    return (
      <main className="px-4 pt-28">
        <p role="alert">{error}</p>
      </main>
    );
  if (!meetup)
    return (
      <main className="px-4 pt-28">
        <LoaderCircle className="animate-spin" />
      </main>
    );

  const accepted = [
    meetup.organizerName,
    ...meetup.requests.filter((r) => r.status === "accepted").map((r) => r.requesterName),
  ];

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-black text-[var(--accent)]">
            <PurposeIcon name={meetup.purposeIcon} color={meetup.purposeColor} className="mr-1.5 inline" />{meetup.purpose}
          </span>
          <span className="rounded-full bg-[#e6f5ee] px-3 py-1 text-xs font-black text-[#166638]">
            {t("seatsLeft", { count: seats })}
          </span>
        </div>
        <h1 className="mt-3 text-3xl leading-tight font-black text-[var(--foreground)]">
          {meetup.title}
        </h1>
        <p className="mt-3 text-sm font-semibold text-[var(--foreground-muted)]">
          {meetup.description || t("fallback.description")}
        </p>
        <div className="mt-5 grid gap-3 rounded-[22px] border border-[var(--border)] bg-[#fffaf2] p-4 text-sm font-bold">
          <p>
            {t("fields.cafe")}:{" "}
            <Link className="text-[var(--accent-hover)]" href={`/cafe/${meetup.cafe?.slug}`}>
              {meetup.cafe?.name}
            </Link>
          </p>
          <p>{t("fields.area")}: {meetup.cafe?.district || "TP.HCM"}</p>
          <p>{t("fields.time")}: {formatMeetupTime(meetup)}</p>
          <p>{t("fields.organizer")}: {meetup.organizerName}</p>
          {meetup.contactInfo && (
            <p className="whitespace-pre-wrap break-words">
              {t("fields.contactInfo")}: {meetup.contactInfo}
            </p>
          )}
          <p>
            {t("fields.seats")}: {meetup.acceptedCount}/{meetup.maxParticipants}
          </p>
        </div>
        <section className="mt-5">
          <h2 className="font-black">{t("acceptedTitle")}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {accepted.map((name) => (
              <span
                key={name}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-bold"
              >
                {name}
              </span>
            ))}
          </div>
        </section>
        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[#e6f5ee] p-3 text-sm font-bold text-[#166638]">
          <ShieldCheck size={18} /> {t("safety")}
        </div>
        {!isOwner && user && !meetup.myRequestStatus && !ended && seats > 0 && (
          <textarea
            aria-label={t("fields.message")}
            maxLength={200}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-4 min-h-24 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] p-3 text-[16px] lg:text-[16px] lg:text-sm font-semibold focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none"
            placeholder={t("placeholders.message")}
          />
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {!isOwner && (
            <button
              disabled={busy || ended || Boolean(meetup.myRequestStatus) || seats <= 0}
              onClick={join}
              className="h-11 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-[var(--accent-foreground)] disabled:opacity-55"
            >
              {busy ? t("sending") : cta}
            </button>
          )}
          {myPending && (
            <button
              onClick={async () => {
                await withdrawMeetupRequest(myPending.id);
                trackEvent("coffee_meetup_request_withdraw");
                await reload();
              }}
              className="h-11 rounded-full border border-[var(--border)] px-5 text-sm font-black"
            >
              {t("actions.withdraw")}
            </button>
          )}
          <button
            onClick={share}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-black"
          >
            <Share2 size={16} /> {t("actions.share")}
          </button>
          <Select value={reportReason} onValueChange={(value) => value && setReportReason(value as MeetupReportReason)}>
            <SelectTrigger aria-label={t("fields.reportReason")}
              className="rounded-full border border-[var(--border)] bg-[#fffaf2] px-4 text-[16px] font-black focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none data-[size=default]:h-11 lg:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="bottom" align="start" sideOffset={8} alignItemWithTrigger={false}
              className="max-h-[min(16rem,var(--available-height))] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg [scrollbar-width:thin]">
              {reportReasons.map((reason) => <SelectItem className="min-h-11 cursor-pointer rounded-xl data-highlighted:bg-[var(--accent-light)] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[var(--accent)]" key={reason} value={reason}>{reason}</SelectItem>)}
            </SelectContent>
          </Select>
          <button
            onClick={async () => {
              if (!user) {
                saveAuthReturnUrl();
                router.push("/login");
                return;
              }
              await reportCoffeeMeetup(id, reportReason);
              trackEvent("coffee_meetup_report", { reason: reportReason });
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-black"
          >
            <Flag size={16} /> {t("actions.report")}
          </button>
        </div>
        {isOwner && <OwnerTools meetup={meetup} onReload={reload} />}
      </article>
    </main>
  );
}

function OwnerTools({ meetup, onReload }: { meetup: CoffeeMeetup; onReload: () => Promise<void> }) {
  const t = useTranslations("coffeeMeetups");
  return (
    <section className="mt-6 border-t border-[var(--border)] pt-5">
      <h2 className="font-black">{t("ownerTools.title")}</h2>
      <div className="mt-3 grid gap-2">
        {meetup.requests
          .filter((r) => r.status === "pending")
          .map((request) => (
            <div key={request.id} className="rounded-2xl border border-[var(--border)] p-3">
              <p className="font-bold">{request.requesterName}</p>
              {request.message && (
                <p className="text-sm text-[var(--foreground-muted)]">{request.message}</p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={async () => {
                    await acceptMeetupRequest(request.id);
                    trackEvent("coffee_meetup_request_accept");
                    await onReload();
                  }}
                  className="h-10 rounded-full bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-foreground)]"
                >
                  {t("actions.accept")}
                </button>
                <button
                  onClick={async () => {
                    await rejectMeetupRequest(request.id);
                    trackEvent("coffee_meetup_request_reject");
                    await onReload();
                  }}
                  className="h-10 rounded-full border border-[var(--border)] px-4 text-sm font-black"
                >
                  {t("actions.reject")}
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={async () => {
            await cancelCoffeeMeetup(meetup.id);
            await onReload();
          }}
          className="h-10 rounded-full border border-[#e9a7a0] px-4 text-sm font-black text-[#C0392B]"
        >
          {t("actions.cancel")}
        </button>
        <button
          onClick={async () => {
            await completeCoffeeMeetup(meetup.id);
            await onReload();
          }}
          className="h-10 rounded-full border border-[var(--border)] px-4 text-sm font-black"
        >
          {t("actions.complete")}
        </button>
        <Link
          href={`/coffee-meetups/new?meetup=${meetup.id}`}
          className="h-10 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-black"
        >
          {t("actions.edit")}
        </Link>
      </div>
    </section>
  );
}
