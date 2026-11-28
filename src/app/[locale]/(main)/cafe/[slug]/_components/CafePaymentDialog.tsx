"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowUpRight, Coffee, Heart, ScanLine } from "lucide-react";
import { ApiError } from "@/apis/http";
import { cafePassPricingQueryKey, completeMockCafeCheckout, getCafeCheckoutStatus, getCafePassPricing, startCafeCheckout } from "@/apis/payments";
import { paymentStatusInterval } from "@/apis/payments/status-polling";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { saveAuthReturnUrl } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const primaryAction = "min-h-11 rounded-full bg-[var(--accent)] px-4 font-bold text-[var(--card-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_86%,white)] [a]:hover:bg-[color-mix(in_srgb,var(--accent)_86%,white)] focus-visible:ring-[var(--accent)] dark:text-[var(--accent-foreground)]";

export default function CafePaymentDialog({
  cafeSlug,
  cafeName,
  coverImage,
  requiresLogin,
  onPaid,
}: {
  cafeSlug: string;
  cafeName: string;
  coverImage?: string | null;
  requiresLogin: boolean;
  onPaid: () => void;
}) {
  const t = useTranslations("cafe");
  const format = useFormatter();
  const [open, setOpen] = useState(true);
  const checkout = useMutation({ mutationFn: startCafeCheckout });
  const order = checkout.data?.status === "pending" ? checkout.data : null;
  const { data: pricing } = useQuery({
    queryKey: cafePassPricingQueryKey,
    queryFn: ({ signal }) => getCafePassPricing(signal),
    enabled: open && !order,
    staleTime: 0,
    retry: false,
  });
  const payment = useQuery({
    queryKey: ["cafe-payment", order?.orderCode],
    queryFn: ({ signal }) => getCafeCheckoutStatus(order!.orderCode, signal),
    enabled: Boolean(order),
    retry: false,
    refetchOnWindowFocus: ({ state }) => state.data?.status === "paid" ? false : "always",
    refetchInterval: ({ state }) => {
      if (!open || !order || state.data?.status === "paid") return false;
      return paymentStatusInterval(
        order.orderCode,
        checkout.submittedAt,
        Date.parse(order.expiresAt),
        Date.now(),
      );
    },
  });

  const completeMock = useMutation({
    mutationFn: completeMockCafeCheckout,
    onSuccess: () => { void payment.refetch(); },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen && order && payment.data?.status !== "paid") void payment.refetch();
  }

  useEffect(() => {
    if (payment.data?.status === "paid" || checkout.data?.status === "paid") onPaid();
  }, [checkout.data?.status, onPaid, payment.data?.status]);

  const unavailable = checkout.error instanceof ApiError && checkout.error.status === 503;
  const offerReserved = checkout.error instanceof ApiError && checkout.error.code === "CAFE_LAUNCH_OFFER_RESERVED";
  const expired = payment.data?.status === "expired" || completeMock.data?.status === "expired";
  const showQr = order && !expired;
  const price = order?.amount ??
    (pricing && (pricing.launchRemaining > 0 ? pricing.launchPrice : pricing.standardPrice));
  const amount = price === undefined ? "" : format.number(price, {
    style: "currency",
    currency: "VND",
    currencyDisplay: "narrowSymbol",
  });
  const label = requiresLogin ? t("paymentSignIn") :
    amount ? t("paymentPayAmount", { amount }) : t("paymentStart");
  const pricingHref = {
    pathname: "/pricing",
    query: { cafe: cafeSlug },
    hash: "pass-plan",
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger render={<Button type="button" />}>{label}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[5px]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[101] max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[25rem] -translate-x-1/2 -translate-y-1/2 space-y-4 overflow-y-auto rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-raised)] p-5 text-[var(--foreground)] shadow-2xl sm:p-6">
          <header>
            <Dialog.Title className="text-2xl leading-tight font-black tracking-[-0.035em]">
              {t(showQr ? "paymentScanTitle" : "paymentTitle")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
              {t(showQr ? order.mock ? "paymentMockNotice" : "paymentScan" : "paymentOffer")}
            </Dialog.Description>
          </header>

          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
            <div className="relative grid size-13 shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--accent-light)] text-[var(--foreground)]">
              {coverImage ? (
                <Image src={coverImage} alt="" fill sizes="52px" unoptimized className="object-cover" />
              ) : (
                <Coffee size={20} aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-[var(--foreground-muted)]" title={cafeName}>{cafeName}</p>
              <p className="mt-0.5 text-sm font-extrabold">Cafe Maps Pass</p>
              {amount && <p className="mt-0.5 text-sm font-semibold tabular-nums">{t("paymentPricePeriod", { amount })}</p>}
              {!showQr && <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">{t("paymentBenefit")}</p>}
            </div>
          </div>

          {!showQr && (
            <p className="flex items-start gap-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
              <Heart size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden />
              {t("paymentSupport")}
            </p>
          )}

          {showQr && (
            <div className="rounded-2xl bg-[var(--accent-light)] px-3 py-3 text-center">
              <div className="mx-auto w-full max-w-56 rounded-xl bg-white p-1 ring-1 ring-[var(--border)]">
                <Image
                  src={order.qrImage}
                  alt={t(order.mock ? "paymentMockQr" : "paymentQrAlt", { amount })}
                  width={256}
                  height={256}
                  unoptimized
                  className="aspect-square h-auto w-full"
                />
              </div>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold tabular-nums text-[var(--foreground)]">
                <ScanLine size={14} aria-hidden />
                {t("paymentExpiresTime", { time: format.dateTime(new Date(order.expiresAt), {
                  hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh",
                }) })}
              </p>
            </div>
          )}
          <div role="status" className={showQr ? "flex items-center justify-center gap-2 text-center text-xs font-semibold text-[var(--foreground-muted)]" : "text-sm text-[var(--foreground-muted)] empty:hidden"}>
            {showQr && <><span className="size-1.5 shrink-0 rounded-full bg-[var(--sage)]" aria-hidden />{t("paymentPending")}</>}
            {expired && t("paymentExpired")}
            {completeMock.isError && t("paymentMockError")}
            {checkout.isError && t(offerReserved ? "paymentOfferReserved" : unavailable ? "paymentUnavailable" : "paymentError")}
          </div>
          <div className={`gap-2 ${showQr ? "grid grid-cols-[1fr_1.35fr]" : "flex flex-wrap justify-end"}`}>
            <Dialog.Close render={<Button type="button" variant="outline" className="min-h-11 rounded-full border-[var(--border)] bg-transparent text-[var(--foreground)] transition-colors hover:bg-[var(--accent-light)]" />}>
              {t("paymentLater")}
            </Dialog.Close>
            {requiresLogin ? (
              <Link href="/login" className={cn(buttonVariants(), primaryAction)} onClick={saveAuthReturnUrl}>
                {label}
              </Link>
            ) : showQr && order.mock ? (
              <Button
                type="button"
                className={primaryAction}
                disabled={completeMock.isPending || completeMock.data?.status === "paid"}
                onClick={() => completeMock.mutate(order.orderCode)}
              >
                {t("paymentMockComplete")}
              </Button>
            ) : showQr && order.checkoutUrl ? (
              <a href={order.checkoutUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), primaryAction)}>
                {t("paymentOpenPayos")} <ArrowUpRight size={15} aria-hidden />
              </a>
            ) : (
              <Button type="button" className={primaryAction} disabled={checkout.isPending} onClick={() => { completeMock.reset(); checkout.mutate(); }}>
                {checkout.isPending ? t("paymentCreating") : label}
              </Button>
            )}
          </div>
          {!showQr && (
            <Link href={pricingHref} prefetch={false} className="block w-fit rounded-sm text-sm font-semibold text-[var(--foreground)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
              {t("paymentComparePlans")}
            </Link>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
