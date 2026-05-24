import type { RefObject } from "react";
import { Loader2, Navigation, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CafeSuggestion, SmartSuggestion } from "./types";
import { HeroSuggestionsDropdown } from "./HeroSuggestionsDropdown";

type HeroSearchControlsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  focused: boolean;
  onFocusChange: (focused: boolean) => void;
  isVi: boolean;
  placeholder: string;
  showDropdown: boolean;
  nameSuggestions: CafeSuggestion[];
  smartSuggestions: SmartSuggestion[];
  inputRef: RefObject<HTMLInputElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  onSubmit: () => void;
  onNearMe: () => void;
  onCafeSelect: (slug: string) => void;
  onSmartSearch: (query: string) => void;
  nearbyLoading: boolean;
  searchCta: string;
  nearbyCta: string;
};

export function HeroSearchControls({
  search,
  onSearchChange,
  focused,
  onFocusChange,
  isVi,
  placeholder,
  showDropdown,
  nameSuggestions,
  smartSuggestions,
  inputRef,
  containerRef,
  onSubmit,
  onNearMe,
  onCafeSelect,
  onSmartSearch,
  nearbyLoading,
  searchCta,
  nearbyCta,
}: HeroSearchControlsProps) {
  return (
    <div ref={containerRef} className="relative mt-8 w-full max-w-5xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-center">
        <div className="relative w-full lg:min-w-0 lg:flex-1">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <div className="flex h-[58px] items-center gap-1.5 rounded-full border border-[#d7b982] bg-white p-1.5 pl-4 shadow-[0_18px_48px_rgba(91,56,19,0.22)] transition-colors focus-within:border-[#c8842a] sm:h-[64px] sm:gap-2 sm:pl-6 lg:pr-5">
              <Search
                size={20}
                className={cn(
                  "shrink-0 transition-colors",
                  focused ? "text-[#c8842a]" : "text-[#8c6d4f]",
                )}
              />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                onFocus={() => onFocusChange(true)}
                placeholder={!search ? placeholder : undefined}
                className="h-full min-w-0 flex-1 bg-transparent px-1 text-[13px] font-medium text-[#261407] placeholder:text-[#765538] sm:text-base"
              />
              <button
                type="submit"
                className="inline-flex h-full min-w-[94px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#c8842a] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(200,132,42,0.24)] transition-all hover:bg-[#a86d1e] sm:min-w-[126px] lg:hidden"
              >
                <Search size={16} />
                <span className="sm:hidden">{isVi ? "Tìm" : "Go"}</span>
                <span className="hidden sm:inline">{searchCta}</span>
              </button>
            </div>
          </form>

          {showDropdown && (
            <HeroSuggestionsDropdown
              nameSuggestions={nameSuggestions}
              smartSuggestions={smartSuggestions}
              isVi={isVi}
              onCafeSelect={onCafeSelect}
              onSmartSearch={onSmartSearch}
            />
          )}
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:w-auto lg:shrink-0">
          <button
            type="button"
            onClick={onNearMe}
            disabled={nearbyLoading}
            className="order-2 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#c8842a] px-8 text-base font-semibold text-white shadow-[0_18px_42px_rgba(200,132,42,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#a86d1e] disabled:cursor-not-allowed disabled:opacity-60 sm:order-1 sm:h-16 sm:px-10 sm:text-lg lg:h-[64px] lg:px-8 lg:text-base xl:px-10"
          >
            {nearbyLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Navigation size={21} />
            )}
            {nearbyCta}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="order-1 hidden h-12 items-center justify-center gap-2 rounded-full border border-[#e0caa9] bg-white px-6 text-sm font-semibold text-[#5f442c] shadow-[0_8px_22px_rgba(44,26,14,0.1)] transition-all hover:-translate-y-0.5 hover:border-[#c8842a] hover:text-[#c8842a] sm:order-2 sm:h-16 sm:px-8 sm:text-base lg:inline-flex lg:h-[64px] lg:px-8"
          >
            <Search size={17} />
            {searchCta}
          </button>
        </div>
      </div>
    </div>
  );
}
