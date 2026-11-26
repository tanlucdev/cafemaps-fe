"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ApiError } from "@/apis/http";
import { completeMockCafeCheckout, getCafeCheckoutStatus, startCafeCheckout } from "@/apis/payments";
import { paymentStatusInterval } from "@/apis/payments/status-polling";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { saveAuthReturnUrl } from "@/lib/auth-client";

export default function CafePaymentDialog({
  requiresLogin,
  onPaid,
}: {
  requiresLogin: boolean;
  onPaid: () => void;
}) {
  const t = useTranslations("cafe");
  const [open, setOpen] = useState(true);
  const checkout = useMutation({ mutationFn: startCafeCheckout });
  const order = checkout.data?.status === "pending" ? checkout.data : null;
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
  const expired = payment.data?.status === "expired" || completeMock.data?.status === "expired";
  const showQr = order && !expired;
  const label = t(requiresLogin ? "paymentSignIn" : "paymentStart");

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger render={<Button type="button" />}>{label}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[101] max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 space-y-4 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] shadow-xl">
          <Dialog.Title className="text-xl font-black">{t("paymentTitle")}</Dialog.Title>
          <Dialog.Description className="text-sm text-[var(--foreground-muted)]">
            {t(requiresLogin ? "paymentGuest" : showQr ? order.mock ? "paymentMockNotice" : "paymentScan" : "paymentOffer")}
          </Dialog.Description>
          {showQr && (
            <Image
              src={order.qrImage}
              alt={t(order.mock ? "paymentMockQr" : "paymentQrAlt")}
              width={256}
              height={256}
              unoptimized
              className="mx-auto h-auto w-full max-w-64 rounded-lg bg-white"
            />
          )}
          <div role="status" className="text-sm text-[var(--foreground-muted)]">
            {showQr && t("paymentPending")}
            {expired && t("paymentExpired")}
            {completeMock.isError && t("paymentMockError")}
            {checkout.isError && t(unavailable ? "paymentUnavailable" : "paymentError")}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Dialog.Close render={<Button type="button" variant="outline" />}>
              {t("paymentLater")}
            </Dialog.Close>
            {requiresLogin ? (
              <Link href="/login" className={buttonVariants()} onClick={saveAuthReturnUrl}>
                {label}
              </Link>
            ) : showQr && order.mock ? (
              <Button
                type="button"
                disabled={completeMock.isPending || completeMock.data?.status === "paid"}
                onClick={() => completeMock.mutate(order.orderCode)}
              >
                {t("paymentMockComplete")}
              </Button>
            ) : showQr && order.checkoutUrl ? (
              <a href={order.checkoutUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
                {t("paymentOpenPayos")}
              </a>
            ) : (
              <Button type="button" disabled={checkout.isPending} onClick={() => { completeMock.reset(); checkout.mutate(); }}>
                {checkout.isPending ? t("paymentCreating") : label}
              </Button>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
