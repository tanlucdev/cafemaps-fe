import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Eye, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { meetupLocalDateTimeToIso } from "@/apis/coffee-meetups/helpers";
import type { CoffeeMeetup, CreateMeetupPayload, MeetupCafe } from "@/apis/coffee-meetups";
import { getAuthUser } from "@/lib/auth-client";
import type { InvitationStyle } from "@/apis/coffee-meetups/invitation";
import MeetupDetailCard from "../MeetupDetailCard";

export default function InvitationPreview({
  form,
  cafe,
  design,
}: {
  form: CreateMeetupPayload;
  cafe?: MeetupCafe;
  design: InvitationStyle;
}) {
  const t = useTranslations("coffeeMeetups");
  const [open, setOpen] = useState(false);
  const user = open ? getAuthUser() : null;
  const draft: CoffeeMeetup = {
    id: "",
    cafeId: form.place.kind === "cafe" ? form.place.cafeId : null,
    cafe: form.place.kind === "cafe" ? (cafe ?? null) : null,
    place: form.place,
    organizerId: user?.id ?? "",
    organizerName: user?.displayName?.trim() || t("fields.organizer"),
    purpose: form.purpose,
    purposeIcon: form.purposeIcon,
    purposeColor: form.purposeColor,
    title: form.title.trim() || t("form.untitled"),
    description: form.description?.trim(),
    startsAt: meetupLocalDateTimeToIso(form.date, form.startsAt),
    endsAt: meetupLocalDateTimeToIso(form.date, form.endsAt),
    maxParticipants: form.maxParticipants,
    status: "open",
    createdAt: "",
    acceptedCount: 1,
    pendingCount: 0,
    requests: [],
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        type="button"
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--accent-light)] px-4 text-sm font-bold text-[#684117] hover:border-[#8f5a16] focus-visible:outline-2 focus-visible:outline-[#8f5a16]"
      >
        <Eye size={17} aria-hidden="true" /> {t("invitation.preview")}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[91] flex max-h-[92svh] w-[calc(100%-1.25rem)] max-w-[52rem] -translate-1/2 flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-2xl outline-none">
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <Dialog.Title className="font-lora text-lg font-bold">
                {t("invitation.preview")}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-[var(--foreground-muted)]">
                {t("invitation.draftHint")}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t("form.closePicker")}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--border)] hover:bg-[var(--accent-light)]"
            >
              <X size={17} aria-hidden="true" />
            </Dialog.Close>
          </header>
          <div className="min-h-0 overflow-y-auto overscroll-contain">
            <MeetupDetailCard meetup={draft} design={design} draft />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
