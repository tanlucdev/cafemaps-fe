"use client";

type AnalyticsGtag = (
  type: "event",
  name: string,
  params?: Record<string, string | number | boolean>,
) => void;

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  (window as Window & { gtag?: AnalyticsGtag }).gtag?.("event", name, params);
}
