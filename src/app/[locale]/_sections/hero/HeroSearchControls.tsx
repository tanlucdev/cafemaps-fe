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
  mobileSearchCta: string;
  nearbyCta: string;
};

export function HeroSearchControls({
  search,
  onSearchChange,
  focused,
  onFocusChange,
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
  mobileSearchCta,
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
                className="h-full min-w-0 flex-1 bg-transparent px-1 text-base font-medium text-[#261407] placeholder:text-[#765538]"
              />
              <button
                type="submit"
                className="inline-flex h-full min-w-[94px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#c8842a] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(200,132,42,0.24)] transition-all hover:bg-[#a86d1e] sm:min-w-[126px] lg:hidden"
              >
                <Search size={16} />
                <span className="sm:hidden">{mobileSearchCta}</span>
                <span className="hidden sm:inline">{searchCta}</span>
              </button>
            </div>
          </form>

          {showDropdown && (
            <HeroSuggestionsDropdown
              nameSuggestions={nameSuggestions}
              smartSuggestions={smartSuggestions}
              onCafeSelect={onCafeSelect}
              onSmartSearch={onSmartSearch}
            />
          )}
        </div>

        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:w-auto lg:shrink-0">
          <button
            type="button"
            onClick={onNearMe}
            disabled={nearbyLoading}
            className="order-2 inline-flex h-12 min-w-[148px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#d9b878] bg-[#fffaf2]/96 px-5 text-sm font-bold text-[#7a4a17] shadow-[0_10px_28px_rgba(91,56,19,0.13)] ring-1 ring-[#f4dec0] transition-all hover:-translate-y-0.5 hover:border-[#c8842a] hover:bg-white hover:text-[#5f320d] disabled:cursor-not-allowed disabled:opacity-60 sm:order-1 sm:h-14 sm:min-w-0 sm:px-5 sm:text-base lg:h-[64px] lg:px-6"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#f6dfb8] text-[#9a5f18]">
              {nearbyLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Navigation size={17} />
              )}
            </span>
            <span>{nearbyCta}</span>
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="order-1 hidden h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#e0caa9] bg-white px-6 text-sm font-semibold text-[#5f442c] shadow-[0_8px_22px_rgba(44,26,14,0.1)] transition-all hover:-translate-y-0.5 hover:border-[#c8842a] hover:text-[#c8842a] sm:order-2 sm:h-16 sm:px-8 sm:text-base lg:inline-flex lg:h-[64px] lg:px-8"
          >
            <Search size={17} />
            {searchCta}
          </button>
        </div>
      </div>
    </div>
  );
}
