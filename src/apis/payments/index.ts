import { apiFetch } from "@/apis/http";

type PendingCheckout = {
  status: "pending";
  orderCode: number;
  amount: number;
  expiresAt: string;
  checkoutUrl: string | null;
  mock: boolean;
  qrImage: string;
};

export const cafePassPricingQueryKey = ["cafe-pass-pricing"] as const;

export function getCafePassPricing(signal?: AbortSignal) {
  return apiFetch<{
    launchPrice: number;
    standardPrice: number;
    launchLimit: number;
    launchRemaining: number;
  }>("/payments/cafe-detail/pricing", { cache: "no-store", signal });
}

export function startCafeCheckout() {
  return apiFetch<PendingCheckout | { status: "paid" }>("/payments/cafe-detail", {
    method: "POST",
    cache: "no-store",
  });
}

export function getCafeCheckoutStatus(orderCode: number, signal: AbortSignal) {
  return apiFetch<{ status: "pending" | "paid" | "expired" }>(
    `/payments/cafe-detail/${orderCode}`,
    { cache: "no-store", signal },
  );
}

export function completeMockCafeCheckout(orderCode: number) {
  return apiFetch<{ status: "paid" | "expired" }>(
    `/payments/cafe-detail/${orderCode}/mock-complete`,
    { method: "POST", cache: "no-store" },
  );
}
