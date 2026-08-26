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
    <div ref={containerRef} className="relative mt-5 w-full min-w-0 max-w-full lg:mt-6 lg:max-w-5xl">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-center">
        <div className="relative w-full min-w-0 lg:flex-1">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            className="w-full min-w-0"
          >
            <div className="flex h-[54px] w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-full border border-[#ffe3b7]/32 bg-[#3a2112]/48 p-1.5 pl-4 pr-4 shadow-[0_16px_40px_rgba(0,0,0,0.18),0_10px_30px_rgba(245,166,58,0.08)] backdrop-blur-xl transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#ffe3b7]/46 hover:shadow-[0_20px_46px_rgba(0,0,0,0.2),0_12px_32px_rgba(245,166,58,0.1)] focus-within:-translate-y-0.5 focus-within:border-[#ffe3b7]/58 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 sm:h-[58px] sm:gap-2 sm:pl-6 lg:pr-5">
              <Search
                size={20}
                className={cn(
                  "shrink-0 transition-colors",
                  focused ? "text-[#ffd18c]" : "text-[#fff0d4]/68",
                )}
              />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                onFocus={() => onFocusChange(true)}
                placeholder={!search ? placeholder : undefined}
                className="h-full min-w-0 flex-1 bg-transparent px-1 text-base font-semibold text-[#fff7e8] placeholder:text-[#fff0d4]/58"
              />
              <button
                type="submit"
                className="hidden h-full min-w-[72px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#fff0d2] px-4 text-sm font-black text-[#201006] shadow-[0_8px_18px_rgba(245,190,104,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#fff7e8] sm:inline-flex sm:min-w-[126px] sm:px-5 lg:hidden"
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

        <div className="grid w-full min-w-0 grid-cols-2 items-center gap-3 sm:flex sm:justify-center lg:w-auto lg:shrink-0">
          <button
            type="button"
            onClick={onNearMe}
            disabled={nearbyLoading}
            className="order-1 inline-flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ffe3b7]/30 bg-[#4a2a16]/42 px-4 text-sm font-bold text-[#fff0d4] shadow-[0_10px_24px_rgba(0,0,0,0.13),0_8px_24px_rgba(245,166,58,0.08)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#ffe3b7]/50 hover:bg-[#4a2a16]/58 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[58px] sm:min-w-0 sm:px-5 sm:text-base lg:px-6"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#fff0d2] text-[#301706]">
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
            className="order-2 inline-flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#fff0d2]/24 bg-[#fff0d2] px-4 text-sm font-black text-[#201006] shadow-[0_8px_22px_rgba(245,190,104,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#fff7e8] sm:hidden sm:h-[58px] sm:px-8 sm:text-base lg:inline-flex lg:px-8"
          >
            <Search size={17} />
            <span className="sm:hidden">{mobileSearchCta}</span>
            <span className="hidden sm:inline">{searchCta}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
