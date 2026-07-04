import { Navigation, Search } from "lucide-react";

type HeroSearchFallbackProps = {
  locale: string;
  placeholder: string;
  searchCta: string;
  mobileSearchCta: string;
  nearbyCta: string;
  quickFilters: Array<{
    emoji: string;
    label: string;
    href: string;
    featured?: boolean;
  }>;
};

export function HeroSearchFallback({
  locale,
  placeholder,
  searchCta,
  mobileSearchCta,
  nearbyCta,
  quickFilters,
}: HeroSearchFallbackProps) {
  const searchPath = `/${locale}/search`;
  const formId = `hero-search-${locale}`;

  return (
    <>
      <div className="relative mt-5 w-full min-w-0 max-w-full lg:mt-6 lg:max-w-5xl">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-center">
          <div className="relative w-full min-w-0 lg:flex-1">
            <form id={formId} action={searchPath} className="w-full min-w-0">
              <div className="flex h-[54px] w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-full border border-[#ffe3b7]/32 bg-[#3a2112]/48 p-1.5 pr-4 pl-4 shadow-[0_16px_40px_rgba(0,0,0,0.18),0_10px_30px_rgba(245,166,58,0.08)] backdrop-blur-xl sm:h-[58px] sm:gap-2 sm:pl-6 lg:pr-5">
                <Search size={20} className="shrink-0 text-[#fff0d4]/68" aria-hidden />
                <input
                  type="text"
                  name="search"
                  placeholder={placeholder}
                  className="h-full min-w-0 flex-1 bg-transparent px-1 text-base font-semibold text-[#fff7e8] placeholder:text-[#fff0d4]/58"
                />
                <button
                  type="submit"
                  className="hidden h-full min-w-[72px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#fff0d2] px-4 text-sm font-black text-[#201006] shadow-[0_8px_18px_rgba(245,190,104,0.22)] sm:inline-flex sm:min-w-[126px] sm:px-5 lg:hidden"
                >
                  <Search size={16} aria-hidden />
                  <span className="sm:hidden">{mobileSearchCta}</span>
                  <span className="hidden sm:inline">{searchCta}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="grid w-full min-w-0 grid-cols-2 items-center gap-3 sm:flex sm:justify-center lg:w-auto lg:shrink-0">
            <a
              href={`${searchPath}?nearMe=true&sort=popular`}
              className="order-1 inline-flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ffe3b7]/30 bg-[#4a2a16]/42 px-4 text-sm font-bold text-[#fff0d4] shadow-[0_10px_24px_rgba(0,0,0,0.13),0_8px_24px_rgba(245,166,58,0.08)] backdrop-blur-xl sm:h-[58px] sm:min-w-0 sm:px-5 sm:text-base lg:px-6"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#fff0d2] text-[#301706]">
                <Navigation size={17} aria-hidden />
              </span>
              <span>{nearbyCta}</span>
            </a>
            <button
              type="submit"
              form={formId}
              className="order-2 inline-flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#fff0d2]/24 bg-[#fff0d2] px-4 text-sm font-black text-[#201006] shadow-[0_8px_22px_rgba(245,190,104,0.18)] sm:hidden sm:h-[58px] sm:px-8 sm:text-base lg:inline-flex lg:px-8"
            >
              <Search size={17} aria-hidden />
              <span className="sm:hidden">{mobileSearchCta}</span>
              <span className="hidden sm:inline">{searchCta}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full max-w-full flex-wrap justify-start gap-2 overflow-visible px-0 md:max-w-5xl lg:flex-nowrap">
        {quickFilters.map((filter) => (
          <a
            key={filter.label}
            href={`${searchPath}${filter.href}`}
            className={
              filter.featured
                ? "inline-flex max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#ffe3b7]/34 bg-[#fff1d6]/20 px-3 py-1.5 text-xs font-bold text-[#fff5e6] shadow-[0_10px_24px_rgba(0,0,0,0.12),0_8px_22px_rgba(245,166,58,0.07)] backdrop-blur-md sm:gap-2 sm:px-3.5 sm:text-sm"
                : "inline-flex max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#ffe3b7]/24 bg-[#3a2112]/36 px-3 py-1.5 text-xs font-bold text-[#fff0d4]/88 shadow-[0_10px_24px_rgba(0,0,0,0.12),0_8px_22px_rgba(245,166,58,0.07)] backdrop-blur-md sm:gap-2 sm:px-3.5 sm:text-sm"
            }
          >
            <span className="text-base leading-none sm:text-[17px]" aria-hidden>
              {filter.emoji}
            </span>
            {filter.label}
          </a>
        ))}
      </div>
    </>
  );
}
