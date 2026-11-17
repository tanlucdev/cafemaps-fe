"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  buildSearchParams,
  parseDistrictSearch,
  setLastSearchState,
} from "@/lib/search-state";
import { HeroSearchControls } from "./HeroSearchControls";
import { QuickFilterChips } from "./QuickFilterChips";
import { KEYWORD_TO_FILTER, PLACEHOLDER_KEYS, QUICK_FILTERS } from "./data";
import { getSmartSuggestions } from "./search-utils";
import type { CafeSuggestion, QuickFilter } from "./types";

const NAME_SUGGESTIONS: CafeSuggestion[] = [];

export function HeroSearchIsland() {
  const locale = useLocale() === "en" ? "en" : "vi";
  const t = useTranslations("hero");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const smartSuggestions = useMemo(
    () =>
      getSmartSuggestions(search, {
        vibeInDistrict: (vibe, district) =>
          t("smartSuggestions.vibeInDistrict", { vibe, district }),
      }, locale),
    [locale, search, t],
  );
  const showDropdown =
    focused && search.length >= 2 && smartSuggestions.length > 0;
  const searchPlaceholder = t(PLACEHOLDER_KEYS[placeholderIdx]);

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
    const districtSearch = parseDistrictSearch(search, locale);
    const filter = {
      search: undefined as string | undefined,
      vibes: [] as string[],
      purposes: [] as string[],
      districts: districtSearch.matched ? [districtSearch.district!] : undefined,
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
    if (!matched && districtSearch.search) filter.search = districtSearch.search.toLowerCase();

    setFocused(false);
    const query = buildSearchParams(
      {
        search: filter.search,
        vibes: filter.vibes.length ? filter.vibes : undefined,
        purposes: filter.purposes.length ? filter.purposes : undefined,
        districts: filter.districts,
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
          districts: filter.districts,
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

  function handleQuickFilter({ vibe, purpose, nearMe, openNow }: QuickFilter) {
    if (nearMe) {
      handleNearMe();
      return;
    }

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
    const districtSearch = parseDistrictSearch(searchQuery, locale);
    const filter = {
      vibes: [] as string[],
      purposes: [] as string[],
      districts: districtSearch.matched ? [districtSearch.district!] : undefined,
    };

    for (const mapping of KEYWORD_TO_FILTER) {
      if (mapping.keywords.some((k) => lower.includes(k))) {
        if (mapping.vibe) filter.vibes.push(mapping.vibe);
        if (mapping.purpose) filter.purposes.push(mapping.purpose);
      }
    }

    const query = buildSearchParams(
      {
        vibes: filter.vibes.length ? filter.vibes : undefined,
        purposes: filter.purposes.length ? filter.purposes : undefined,
        districts: filter.districts,
      },
      "popular",
    ).toString();

    if (query) {
      setLastSearchState({
        query: searchQuery,
        filter: {
          vibes: filter.vibes.length ? filter.vibes : undefined,
          purposes: filter.purposes.length ? filter.purposes : undefined,
          districts: filter.districts,
        },
        sort: "popular",
        params: query,
      });
    }

    router.push(`/search${query ? `?${query}` : ""}`);
  }

  return (
    <>
      <HeroSearchControls
        search={search}
        onSearchChange={setSearch}
        focused={focused}
        onFocusChange={setFocused}
        placeholder={searchPlaceholder}
        showDropdown={showDropdown}
        nameSuggestions={NAME_SUGGESTIONS}
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
        mobileSearchCta={t("mobileSearchCta")}
        nearbyCta={t("nearMeCta")}
      />

      <QuickFilterChips
        filters={QUICK_FILTERS}
        getLabel={(key) => t(`quickFilters.${key}`)}
        onFilter={handleQuickFilter}
      />
    </>
  );
}
