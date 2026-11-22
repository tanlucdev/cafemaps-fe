"use client";
import { useEffect, useMemo, useState } from "react";
import { Flag, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  getCoffeeMeetup,
  reportCoffeeMeetup,
  requestToJoinMeetup,
  withdrawMeetupRequest,
  type CoffeeMeetup,
  type MeetupReportReason,
} from "@/apis/coffee-meetups";
import { getAuthUser, saveAuthReturnUrl } from "@/lib/auth-client";
import { trackEvent } from "@/lib/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isEnded, remainingSeats } from "./format";
import { getInvitationDesign } from "@/apis/coffee-meetups/invitation";
import MeetupDetailCard from "./MeetupDetailCard";
import OwnerTools from "./OwnerTools";
import InvitationShare from "./InvitationShare";
export default function MeetupDetailClient({ id }: { id: string }) {
  const sample = id.startsWith("mock-meetup-");
  const router = useRouter();
  const search = useSearchParams();
  const t = useTranslations("coffeeMeetups");
  const reportReasons = t.raw("reportReasons") as string[];
  const [meetup, setMeetup] = useState<CoffeeMeetup | null>(null);
  const design = getInvitationDesign(
    meetup?.invitationTemplate ?? search.get("template"),
    meetup?.invitationColor ?? search.get("color"),
  );
  const [message, setMessage] = useState("");
  const [reportReason, setReportReason] = useState<MeetupReportReason>(reportReasons[0] ?? "Spam");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const user = typeof window === "undefined" ? null : getAuthUser();
  const myActiveRequest = meetup?.requests.find(
    (r) => r.requesterId === user?.id && (r.status === "pending" || r.status === "accepted"),
  );
  const ended = meetup
    ? isEnded(meetup) || ["completed", "cancelled"].includes(meetup.status)
    : false;
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

  async function perform(action: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await action();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.request"));
    } finally {
      setBusy(false);
    }
  }

  async function join() {
    if (!user) {
      saveAuthReturnUrl();
      router.push("/login");
      return;
    }
    setBusy(true);
    setError("");
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

  if (error && !meetup)
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

  return (
    <MeetupDetailCard
      key={id}
      meetup={meetup}
      sample={sample}
      design={design}
      shareAction={<InvitationShare meetup={meetup} design={design} />}
      actions={
        !sample && (
          <div className="contents">
            {!isOwner && (
              <button
                disabled={
                  busy ||
                  meetup.status === "full" ||
                  ended ||
                  ["pending", "accepted"].includes(meetup.myRequestStatus ?? "") ||
                  seats <= 0
                }
                onClick={join}
                className="h-11 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white disabled:opacity-55"
              >
                {busy ? t("sending") : cta}
              </button>
            )}
            {myActiveRequest && (
              <button
                disabled={busy}
                onClick={() =>
                  perform(async () => {
                    await withdrawMeetupRequest(myActiveRequest.id);
                    trackEvent("coffee_meetup_request_withdraw");
                  })
                }
                className="h-11 rounded-full border border-[var(--border)] px-5 text-sm font-black"
              >
                {t("actions.withdraw")}
              </button>
            )}
            {!isOwner &&
              user &&
              !["pending", "accepted"].includes(meetup.myRequestStatus ?? "") &&
              !ended &&
              meetup.status !== "full" &&
              seats > 0 && (
                <textarea
                  aria-label={t("fields.message")}
                  maxLength={200}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-16 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] p-3 text-[16px] font-semibold outline-none focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none lg:text-sm"
                  placeholder={t("placeholders.message")}
                />
              )}
          </div>
        )
      }
      reportAction={
        !sample && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Select
              value={reportReason}
              onValueChange={(value) => value && setReportReason(value as MeetupReportReason)}
            >
              <SelectTrigger
                aria-label={t("fields.reportReason")}
                className="rounded-full border border-[var(--border)] bg-[#fffaf2] px-4 text-[16px] font-black focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none data-[size=default]:h-11 lg:text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                align="start"
                sideOffset={8}
                alignItemWithTrigger={false}
                className="max-h-[min(16rem,var(--available-height))] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg [scrollbar-width:thin]"
              >
                {reportReasons.map((reason) => (
                  <SelectItem
                    className="min-h-11 cursor-pointer rounded-xl focus:bg-[var(--accent-light)] focus:text-[#875200] focus:**:!text-[#875200] data-highlighted:bg-[var(--accent-light)] data-highlighted:text-[#875200] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[#875200]"
                    key={reason}
                    value={reason}
                  >
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              disabled={busy}
              onClick={async () => {
                if (!user) {
                  saveAuthReturnUrl();
                  router.push("/login");
                  return;
                }
                await perform(async () => {
                  await reportCoffeeMeetup(id, reportReason);
                  trackEvent("coffee_meetup_report", { reason: reportReason });
                });
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-black"
            >
              <Flag size={16} /> {t("actions.report")}
            </button>
          </div>
        )
      }
    >
      {(error || (isOwner && !sample)) && (
        <>
          {error && (
            <p role="alert" className="text-sm text-[#C0392B]">
              {error}
            </p>
          )}
          {isOwner && !sample && (
            <OwnerTools meetup={meetup} design={design} busy={busy} perform={perform} />
          )}
        </>
      )}
    </MeetupDetailCard>
  );
}
