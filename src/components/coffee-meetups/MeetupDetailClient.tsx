"use client";

import { useEffect, useMemo, useState } from "react";
import { Flag, LoaderCircle, Share2, ShieldCheck } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  acceptMeetupRequest,
  cancelCoffeeMeetup,
  completeCoffeeMeetup,
  getCoffeeMeetup,
  rejectMeetupRequest,
  reportCoffeeMeetup,
  REPORT_REASONS,
  requestToJoinMeetup,
  withdrawMeetupRequest,
  type CoffeeMeetup,
  type MeetupReportReason,
} from "@/apis/coffee-meetups";
import { getAuthUser, saveAuthReturnUrl } from "@/lib/auth-client";
import { trackEvent } from "@/lib/analytics";
import { formatMeetupTime, isEnded, remainingSeats } from "./format";

export default function MeetupDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [meetup, setMeetup] = useState<CoffeeMeetup | null>(null);
  const [message, setMessage] = useState("");
  const [reportReason, setReportReason] = useState<MeetupReportReason>("Spam");
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
    if (!user) return "Đăng nhập để xin tham gia";
    if (ended) return "Kèo đã kết thúc";
    if (meetup?.myRequestStatus === "accepted") return "Bạn đã tham gia";
    if (meetup?.myRequestStatus === "pending") return "Đang chờ xác nhận";
    if (seats <= 0 || meetup?.status === "full") return "Kèo đã đủ người";
    return "Xin tham gia";
  }, [ended, meetup, seats, user]);

  useEffect(() => {
    trackEvent("coffee_meetup_detail_view");
    getCoffeeMeetup(id)
      .then(setMeetup)
      .catch((err) => setError(err instanceof Error ? err.message : "Không tải được kèo."));
  }, [id]);

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
      setError(err instanceof Error ? err.message : "Chưa gửi được yêu cầu.");
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
          <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-black text-[#875200]">
            {meetup.purpose}
          </span>
          <span className="rounded-full bg-[#e6f5ee] px-3 py-1 text-xs font-black text-[#166638]">
            Còn {seats} chỗ
          </span>
        </div>
        <h1 className="mt-3 text-3xl leading-tight font-black text-[var(--foreground)]">
          {meetup.title}
        </h1>
        <p className="mt-3 text-sm font-semibold text-[var(--foreground-muted)]">
          {meetup.description || "Chủ kèo chưa thêm mô tả."}
        </p>
        <div className="mt-5 grid gap-3 rounded-[22px] border border-[var(--border)] bg-[#fffaf2] p-4 text-sm font-bold">
          <p>
            Quán:{" "}
            <Link className="text-[var(--accent-hover)]" href={`/cafe/${meetup.cafe?.slug}`}>
              {meetup.cafe?.name}
            </Link>
          </p>
          <p>Khu vực: {meetup.cafe?.district || "TP.HCM"}</p>
          <p>Thời gian: {formatMeetupTime(meetup)}</p>
          <p>Người tổ chức: {meetup.organizerName}</p>
          <p>
            Số chỗ: {meetup.acceptedCount}/{meetup.maxParticipants}
          </p>
        </div>
        <section className="mt-5">
          <h2 className="font-black">Người đã được chấp nhận</h2>
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
          <ShieldCheck size={18} /> Chỉ gặp tại địa điểm công cộng và không chia sẻ thông tin cá
          nhân khi chưa cảm thấy an toàn.
        </div>
        {!isOwner && user && !meetup.myRequestStatus && !ended && seats > 0 && (
          <textarea
            aria-label="Lời nhắn"
            maxLength={200}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-4 min-h-24 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] p-3 text-sm font-semibold"
            placeholder="Lời nhắn cho chủ kèo..."
          />
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {!isOwner && (
            <button
              disabled={busy || ended || Boolean(meetup.myRequestStatus) || seats <= 0}
              onClick={join}
              className="h-11 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white disabled:opacity-55"
            >
              {busy ? "Đang gửi..." : cta}
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
              Rút yêu cầu
            </button>
          )}
          <button
            onClick={share}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-black"
          >
            <Share2 size={16} /> Chia sẻ kèo
          </button>
          <select
            aria-label="Lý do báo cáo"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value as MeetupReportReason)}
            className="h-11 rounded-full border border-[var(--border)] bg-[#fffaf2] px-4 text-sm font-black"
          >
            {REPORT_REASONS.map((reason) => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
          <button
            onClick={async () => {
              await reportCoffeeMeetup(id, reportReason);
              trackEvent("coffee_meetup_report", { reason: reportReason });
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-black"
          >
            <Flag size={16} /> Báo cáo kèo
          </button>
        </div>
        {isOwner && <OwnerTools meetup={meetup} onReload={reload} />}
      </article>
    </main>
  );
}

function OwnerTools({ meetup, onReload }: { meetup: CoffeeMeetup; onReload: () => Promise<void> }) {
  return (
    <section className="mt-6 border-t border-[var(--border)] pt-5">
      <h2 className="font-black">Quản lý yêu cầu</h2>
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
                  className="h-10 rounded-full bg-[var(--accent)] px-4 text-sm font-black text-white"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={async () => {
                    await rejectMeetupRequest(request.id);
                    trackEvent("coffee_meetup_request_reject");
                    await onReload();
                  }}
                  className="h-10 rounded-full border border-[var(--border)] px-4 text-sm font-black"
                >
                  Từ chối
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
          Huỷ kèo
        </button>
        <button
          onClick={async () => {
            await completeCoffeeMeetup(meetup.id);
            await onReload();
          }}
          className="h-10 rounded-full border border-[var(--border)] px-4 text-sm font-black"
        >
          Kết thúc
        </button>
        <Link
          href={`/coffee-meetups/new?meetup=${meetup.id}`}
          className="h-10 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-black"
        >
          Chỉnh sửa
        </Link>
      </div>
    </section>
  );
}
