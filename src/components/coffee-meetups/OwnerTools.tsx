"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  acceptMeetupRequest,
  rejectMeetupRequest,
  cancelCoffeeMeetup,
  completeCoffeeMeetup,
  type CoffeeMeetup,
} from "@/apis/coffee-meetups";
import { trackEvent } from "@/lib/analytics";
import type { InvitationStyle } from "@/apis/coffee-meetups/invitation";

export default function OwnerTools({
  meetup,
  design,
  busy,
  perform,
}: {
  meetup: CoffeeMeetup;
  design: InvitationStyle;
  busy: boolean;
  perform: (action: () => Promise<unknown>) => Promise<void>;
}) {
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
                  disabled={busy}
                  onClick={() =>
                    perform(async () => {
                      await acceptMeetupRequest(request.id);
                      trackEvent("coffee_meetup_request_accept");
                    })
                  }
                  className="h-10 rounded-full bg-[var(--accent)] px-4 text-sm font-black text-white"
                >
                  {t("actions.accept")}
                </button>
                <button
                  disabled={busy}
                  onClick={() =>
                    perform(async () => {
                      await rejectMeetupRequest(request.id);
                      trackEvent("coffee_meetup_request_reject");
                    })
                  }
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
          disabled={busy}
          onClick={() =>
            perform(async () => {
              await cancelCoffeeMeetup(meetup.id);
            })
          }
          className="h-10 rounded-full border border-[#e9a7a0] px-4 text-sm font-black text-[#C0392B]"
        >
          {t("actions.cancel")}
        </button>
        <button
          disabled={busy}
          onClick={() =>
            perform(async () => {
              await completeCoffeeMeetup(meetup.id);
            })
          }
          className="h-10 rounded-full border border-[var(--border)] px-4 text-sm font-black"
        >
          {t("actions.complete")}
        </button>
        <Link
          href={{ pathname: "/coffee-meetups/new", query: { meetup: meetup.id, ...design } }}
          className="h-10 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-black"
        >
          {t("actions.edit")}
        </Link>
      </div>
    </section>
  );
}
