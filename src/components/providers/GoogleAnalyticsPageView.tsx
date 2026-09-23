"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?];
type Gtag = (...args: GtagArgs) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

interface GoogleAnalyticsPageViewProps {
  measurementId: string;
}

export default function GoogleAnalyticsPageView({ measurementId }: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if (!measurementId || !pathname) {
      return;
    }

    const pagePath = search ? `${pathname}?${search}` : pathname;

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag(...args: GtagArgs) {
        window.dataLayer?.push(args);
      };

      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });
    }

    window.gtag("config", measurementId, {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    });
  }, [measurementId, pathname, search]);

  return null;
}
