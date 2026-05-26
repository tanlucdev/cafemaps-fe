"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { MOCK_CAFES } from "@/lib/mock-data";
import {
  buildSearchParams,
  clearLastSearchState,
  getLastSearchState,
  setLastSearchState,
  type LastSearchState,
} from "@/lib/search-state";
import { HeroSearchControls } from "./HeroSearchControls";
import { HeroSearchMemory } from "./HeroSearchMemory";
import { QuickFilterChips } from "./QuickFilterChips";
import { KEYWORD_TO_FILTER, PLACEHOLDER_KEYS, QUICK_FILTERS } from "./data";
import { getNameSuggestions, getSmartSuggestions } from "./search-utils";
import type { QuickFilter } from "./types";

interface HeroSearchIslandProps {
  locale: string;
}

export function HeroSearchIsland({ locale }: HeroSearchIslandProps) {
  const t = useTranslations("hero");
  const tNearby = useTranslations("nearby");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isCompactSearch, setIsCompactSearch] = useState(false);
  const [focused, setFocused] = useState(false);
  const [lastSearch, setLastSearch] = useState<LastSearchState | null>(null);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVi = locale === "vi";
  const nameSuggestions = useMemo(() => getNameSuggestions(search, MOCK_CAFES), [search]);
  const smartSuggestions = useMemo(() => getSmartSuggestions(search, locale), [search, locale]);
  const showDropdown =
    focused && search.length >= 2 && (nameSuggestions.length > 0 || smartSuggestions.length > 0);
  const searchPlaceholder = isVi
    ? isCompactSearch
      ? "Tên quán, khu vực, phong cách"
      : "Nhập tên quán, khu vực hoặc phong cách..."
    : isCompactSearch
      ? "Name, area, vibe..."
      : t(PLACEHOLDER_KEYS[placeholderIdx]);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_KEYS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      inputRef.current?.focus();
    }
    setIsCompactSearch(window.innerWidth < 640);
    setLastSearch(getLastSearchState());
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const updateCompactSearch = () => setIsCompactSearch(media.matches);

    updateCompactSearch();
    media.addEventListener("change", updateCompactSearch);
    return () => media.removeEventListener("change", updateCompactSearch);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setFocused(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  function handleSearch() {
    const q = search.trim().toLowerCase();
    const filter = {
      search: undefined as string | undefined,
      vibes: [] as string[],
      purposes: [] as string[],
      nearMe: undefined as boolean | undefined,
    };

    let matched = false;
    for (const mapping of KEYWORD_TO_FILTER) {
      if (mapping.keywords.some((k) => q.includes(k))) {
        if (mapping.vibe) filter.vibes.push(mapping.vibe);
        if (mapping.purpose) filter.purposes.push(mapping.purpose);
        matched = true;
      }
    }

    if (q.includes("gần")) filter.nearMe = true;
    if (!matched && q) filter.search = q;

    setFocused(false);
    const query = buildSearchParams(
      {
        search: filter.search,
        vibes: filter.vibes.length ? filter.vibes : undefined,
        purposes: filter.purposes.length ? filter.purposes : undefined,
        nearMe: filter.nearMe,
      },
      "popular",
    ).toString();

    if (query) {
      setLastSearchState({
        query: q,
        filter: {
          search: filter.search,
          vibes: filter.vibes.length ? filter.vibes : undefined,
          purposes: filter.purposes.length ? filter.purposes : undefined,
          nearMe: filter.nearMe,
        },
        sort: "popular",
        params: query,
      });
    }

    router.push(`/search${query ? `?${query}` : ""}`);
  }

  function handleNearMe() {
    if (!navigator.geolocation) {
      router.push("/search");
      return;
    }
    setNearbyLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const filter = {
          nearMe: true,
          lat: coords.latitude,
          lng: coords.longitude,
          radiusKm: 2,
        };
        const query = buildSearchParams(filter, "popular").toString();
        setLastSearchState({ filter, sort: "popular", params: query });
        setNearbyLoading(false);
        router.push(`/search?${query}`);
      },
      () => {
        setNearbyLoading(false);
        router.push("/search");
      },
    );
  }

  function handleQuickFilter({ vibe, purpose, openNow }: QuickFilter) {
    const filter = {
      vibes: vibe ? [vibe] : undefined,
      purposes: purpose ? [purpose] : undefined,
      openNow: openNow || undefined,
    };
    const query = buildSearchParams(filter, "popular").toString();
    setLastSearchState({
      filter,
      sort: "popular",
      params: query,
    });
    router.push(`/search?${query}`);
  }

  function handleSmartSearch(searchQuery: string) {
    setFocused(false);
    setSearch(searchQuery);
    const lower = searchQuery.toLowerCase();
    const filter = {
      vibes: [] as string[],
      purposes: [] as string[],
      district: undefined as string | undefined,
    };

    for (const mapping of KEYWORD_TO_FILTER) {
      if (mapping.keywords.some((k) => lower.includes(k))) {
        if (mapping.vibe) filter.vibes.push(mapping.vibe);
        if (mapping.purpose) filter.purposes.push(mapping.purpose);
      }
    }

    const districtMatch = lower.match(/qu[aậ]n\s*(\d+|[a-zÀ-ɏ\s]+)/i);
    if (districtMatch) {
      filter.district = districtMatch[0].replace(/qu[aậ]n/i, "Quận").trim();
    }

    const query = buildSearchParams(
      {
        vibes: filter.vibes.length ? filter.vibes : undefined,
        purposes: filter.purposes.length ? filter.purposes : undefined,
        district: filter.district,
      },
      "popular",
    ).toString();

    if (query) {
      setLastSearchState({
        query: searchQuery,
        filter: {
          vibes: filter.vibes.length ? filter.vibes : undefined,
          purposes: filter.purposes.length ? filter.purposes : undefined,
          district: filter.district,
        },
        sort: "popular",
        params: query,
      });
    }

    router.push(`/search${query ? `?${query}` : ""}`);
  }

  return (
    <>
      <HeroSearchMemory
        lastSearch={lastSearch}
        locale={locale}
        isVi={isVi}
        onResume={() => {
          if (lastSearch) router.push(`/search?${lastSearch.params}`);
        }}
        onClear={() => {
          clearLastSearchState();
          setLastSearch(null);
        }}
      />

      <HeroSearchControls
        search={search}
        onSearchChange={setSearch}
        focused={focused}
        onFocusChange={setFocused}
        isVi={isVi}
        placeholder={searchPlaceholder}
        showDropdown={showDropdown}
        nameSuggestions={nameSuggestions}
        smartSuggestions={smartSuggestions}
        inputRef={inputRef}
        containerRef={containerRef}
        onSubmit={handleSearch}
        onNearMe={handleNearMe}
        onCafeSelect={(slug) => {
          setFocused(false);
          router.push(`/cafe/${slug}`);
        }}
        onSmartSearch={handleSmartSearch}
        nearbyLoading={nearbyLoading}
        searchCta={t("cta")}
        nearbyCta={isVi ? "Quán gần tôi" : tNearby("buttonLong")}
      />

      <QuickFilterChips filters={QUICK_FILTERS} isVi={isVi} onFilter={handleQuickFilter} />

      <Link
        href="/search"
        className="group mt-5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#8f5419] underline decoration-[#d7a64e]/60 decoration-2 underline-offset-4 transition-colors hover:text-[#5f320d] hover:decoration-[#b96a16] sm:text-base"
      >
        <span>{isVi ? "Xem tất cả quán cafe" : "View all cafes"}</span>
        <ArrowRight
          size={17}
          className="transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </>
  );
}
