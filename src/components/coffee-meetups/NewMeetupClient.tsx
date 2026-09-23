"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, LoaderCircle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  createCoffeeMeetup,
  getCoffeeMeetup,
  MEETUP_PURPOSES,
  updateCoffeeMeetup,
  type CreateMeetupPayload,
} from "@/apis/coffee-meetups";
import { getAuthUser, saveAuthReturnUrl } from "@/lib/auth-client";
import { trackEvent } from "@/lib/analytics";
import type { Cafe } from "@/types/cafe";

const today = () => new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function NewMeetupClient({
  cafes,
  preselectedCafeId,
  editMeetupId,
}: {
  cafes: Cafe[];
  preselectedCafeId?: string;
  editMeetupId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<CreateMeetupPayload>({
    cafeId: preselectedCafeId || cafes[0]?.id || "",
    purpose: "Làm việc",
    title: "",
    date: today(),
    startsAt: "09:00",
    endsAt: "11:00",
    maxParticipants: 4,
    description: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const selectedCafe = useMemo(
    () => cafes.find((cafe) => cafe.id === form.cafeId),
    [cafes, form.cafeId],
  );

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
          title: meetup.title,
          date: start.toISOString().slice(0, 10),
          startsAt: start.toTimeString().slice(0, 5),
          endsAt: end.toTimeString().slice(0, 5),
          maxParticipants: meetup.maxParticipants,
          description: meetup.description ?? "",
        });
      })
      .catch(() => setError("Không tải được kèo để chỉnh sửa."));
  }, [editMeetupId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const meetup = editMeetupId
        ? await updateCoffeeMeetup(editMeetupId, form)
        : await createCoffeeMeetup(form);
      trackEvent("coffee_meetup_create_complete", { purpose: form.purpose });
      router.push(`/coffee-meetups/${meetup.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chưa tạo được kèo.");
    } finally {
      setSubmitting(false);
    }
  }

  const input =
    "h-11 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-sm font-bold text-[var(--foreground)]";

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <form
        onSubmit={submit}
        className="mx-auto max-w-3xl rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] sm:p-6"
      >
        <div className="mb-5">
          <p className="text-xs font-black tracking-[0.08em] text-[#875200] uppercase">
            Kèo cà phê
          </p>
          <h1 className="mt-1 text-3xl font-black text-[var(--foreground)]">
            {editMeetupId ? "Chỉnh sửa kèo" : "Tạo kèo tại quán"}
          </h1>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Chỉ gặp tại địa điểm công cộng và không chia sẻ thông tin cá nhân khi chưa cảm thấy an
            toàn.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-black sm:col-span-2">
            Quán cà phê
            <select
              className={`${input} mt-1.5`}
              value={form.cafeId}
              onChange={(e) => setForm({ ...form, cafeId: e.target.value })}
              required
            >
              {cafes.map((cafe) => (
                <option key={cafe.id} value={cafe.id}>
                  {cafe.name} · {cafe.district}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-black">
            Mục đích
            <select
              className={`${input} mt-1.5`}
              value={form.purpose}
              onChange={(e) =>
                setForm({ ...form, purpose: e.target.value as CreateMeetupPayload["purpose"] })
              }
            >
              {MEETUP_PURPOSES.map((purpose) => (
                <option key={purpose}>{purpose}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-black">
            Số người tối đa
            <input
              className={`${input} mt-1.5`}
              type="number"
              min={2}
              max={10}
              value={form.maxParticipants}
              onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
            />
          </label>
          <label className="text-sm font-black sm:col-span-2">
            Tiêu đề
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
            Ngày
            <input
              className={`${input} mt-1.5`}
              type="date"
              min={today()}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </label>
          <label className="text-sm font-black">
            Giờ bắt đầu
            <input
              className={`${input} mt-1.5`}
              type="time"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              required
            />
          </label>
          <label className="text-sm font-black">
            Giờ kết thúc
            <input
              className={`${input} mt-1.5`}
              type="time"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              required
            />
          </label>
          <div className="text-sm font-black">
            Khu vực
            <p className={`${input} mt-1.5 flex items-center`}>
              {selectedCafe?.district || "TP.HCM"}
            </p>
          </div>
          <label className="text-sm font-black sm:col-span-2">
            Mô tả
            <textarea
              className="mt-1.5 min-h-28 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] p-3 text-sm font-semibold"
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
        <button
          disabled={submitting}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white hover:bg-[var(--accent-hover)] disabled:opacity-60 sm:w-auto"
        >
          {submitting ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <CalendarPlus size={16} />
          )}
          {editMeetupId ? "Lưu kèo" : "Tạo kèo"}
        </button>
      </form>
    </main>
  );
}
