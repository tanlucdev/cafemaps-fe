import { MapPin, Search } from "lucide-react";
import type { CafeSuggestion, SmartSuggestion } from "./types";

type HeroSuggestionsDropdownProps = {
  nameSuggestions: CafeSuggestion[];
  smartSuggestions: SmartSuggestion[];
  isVi: boolean;
  onCafeSelect: (slug: string) => void;
  onSmartSearch: (query: string) => void;
};

export function HeroSuggestionsDropdown({
  nameSuggestions,
  smartSuggestions,
  isVi,
  onCafeSelect,
  onSmartSearch,
}: HeroSuggestionsDropdownProps) {
  return (
    <div className="absolute top-[calc(100%+10px)] right-0 left-0 z-50 max-h-[min(60vh,330px)] overflow-y-auto rounded-[18px] border border-[#e8d8c0] bg-white text-left shadow-[0_18px_42px_rgba(44,26,14,0.16)]">
      {nameSuggestions.length > 0 && (
        <div className="border-b border-[#e8d8c0] py-2 last:border-b-0">
          <div className="px-4 pt-1 pb-1 text-[11px] font-semibold tracking-[0.08em] text-[#8c6d4f] uppercase">
            {isVi ? "Quán cà phê" : "Cafes"}
          </div>
          {nameSuggestions.map((cafe) => (
            <button
              key={cafe.id}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onCafeSelect(cafe.slug);
              }}
              className="flex w-full items-center gap-3 bg-transparent px-4 py-2.5 text-left transition-colors hover:bg-[#f5edd8]"
            >
              <MapPin size={15} className="shrink-0 text-[#c8842a]" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#2c1a0e]">
                  {cafe.name}
                </span>
                <span className="block truncate text-xs text-[#8c6d4f]">{cafe.district}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {smartSuggestions.length > 0 && (
        <div className="py-2">
          <div className="px-4 pt-1 pb-1 text-[11px] font-semibold tracking-[0.08em] text-[#8c6d4f] uppercase">
            {isVi ? "Tìm kiếm" : "Search"}
          </div>
          {smartSuggestions.map((suggestion) => (
            <button
              key={suggestion.query}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onSmartSearch(suggestion.query);
              }}
              className="flex w-full items-center gap-3 bg-transparent px-4 py-2.5 text-left transition-colors hover:bg-[#f5edd8]"
            >
              <Search size={15} className="shrink-0 text-[#c8842a]" />
              <span className="truncate text-sm font-semibold text-[#2c1a0e]">
                {suggestion.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
