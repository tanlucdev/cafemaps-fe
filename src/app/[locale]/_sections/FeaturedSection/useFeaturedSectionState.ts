import { useCallback, useEffect, useRef, useState } from "react";
import type { CafeFilter as Filter } from "@/types/cafe";
import {
  buildSearchParams,
  filterFromSearchParams,
  hasActiveSearchFilters,
  parseDistrictSearch,
  setLastSearchState,
  sortFromSearchParams,
  type SearchSort,
} from "@/lib/search-state";
import { MOBILE_PAGE_SIZE, PAGE_SIZE, type ViewMode } from "../featured-section-helpers";

export function useFeaturedSectionState(locale: string, reduceMotion: boolean | null) {
  const [urlSearchParams, setUrlSearchParams] = useState(() => new URLSearchParams());
  const [canAnimate, setCanAnimate] = useState(false);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filter, setFilter] = useState<Filter>(() => filterFromSearchParams(urlSearchParams));
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SearchSort>(() => sortFromSearchParams(urlSearchParams));
  const [animationType, setAnimationType] = useState<"slide" | "fade">("fade");
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const page = Number(urlSearchParams.get("page") ?? "1");

  const updateUrl = useCallback((newFilter: Filter, newSort: SearchSort, newPage: number) => {
    const params = buildSearchParams(newFilter, newSort, newPage);
    const query = params.toString();
    window.history.pushState(
      null,
      "",
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
    if (query && hasActiveSearchFilters(newFilter)) {
      setLastSearchState({
        query: newFilter.search,
        filter: newFilter,
        sort: newSort,
        params: query,
      });
    }
    setUrlSearchParams(new URLSearchParams(params));
  }, []);

  useEffect(() => {
    setCanAnimate(true);
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncPageSize = () => setPageSize(mediaQuery.matches ? MOBILE_PAGE_SIZE : PAGE_SIZE);
    const syncSearchParams = () => {
      const nextParams = new URLSearchParams(window.location.search);
      if (nextParams.get("hours") === "from_7") {
        nextParams.set("hours", "open_at_7");
        const query = nextParams.toString();
        window.history.replaceState(
          null,
          "",
          query ? `${window.location.pathname}?${query}` : window.location.pathname,
        );
      }
      const nextFilter = filterFromSearchParams(nextParams);
      setUrlSearchParams(nextParams);
      setFilter(nextFilter);
      setSortMode(sortFromSearchParams(nextParams));
      setSearchInput(nextFilter.search ?? "");
    };

    syncPageSize();
    syncSearchParams();
    window.addEventListener("popstate", syncSearchParams);
    mediaQuery.addEventListener("change", syncPageSize);
    return () => {
      window.removeEventListener("popstate", syncSearchParams);
      mediaQuery.removeEventListener("change", syncPageSize);
    };
  }, []);

  function handleFilterChange(newFilter: Filter) {
    setFilter(newFilter);
    setAnimationType("slide");
    updateUrl(newFilter, sortMode, 1);
    resultsRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function clampPage(lastPage: number) {
    const params = buildSearchParams(filter, sortMode, lastPage);
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
    setUrlSearchParams(new URLSearchParams(params));
  }

  function handleSearchSubmit() {
    const parsed = parseDistrictSearch(searchInput, locale === "en" ? "en" : "vi");
    handleFilterChange({
      ...filter,
      search: parsed.matched ? parsed.search : searchInput.trim() || undefined,
      districts: parsed.matched ? [parsed.district!] : filter.districts,
    });
  }

  return {
    animationType,
    canAnimate,
    clampPage,
    filter,
    handleFilterChange,
    handlePageChange: (nextPage: number) => {
      setAnimationType("fade");
      updateUrl(filter, sortMode, nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    handleSearchSubmit,
    handleSortChange: (nextSort: SearchSort) => {
      setSortMode(nextSort);
      updateUrl(filter, nextSort, 1);
      resultsRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    handleViewModeChange: (nextMode: ViewMode) => {
      if (nextMode === viewMode) return;
      setAnimationType("slide");
      setViewMode(nextMode);
    },
    page,
    pageSize,
    resultsRef,
    searchInput,
    searchInputRef,
    setSearchInput,
    sortMode,
    viewMode,
  };
}
