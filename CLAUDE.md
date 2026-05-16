@AGENTS.md

# Cafe Maps — Frontend (fe-uiux)

Next.js 16 app với App Router, React 19, TypeScript strict mode.

## Package Manager

**Chỉ dùng `yarn`** — không dùng `npm` hay `npx` để cài package. Không commit `package-lock.json`.

## Scripts

```bash
yarn dev        # dev server
yarn build      # production build
yarn lint       # ESLint check
yarn lint:fix   # ESLint auto-fix
yarn format     # Prettier format
```

## Cấu trúc thư mục

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── page.tsx                    # Redirect → /vi
│   └── [locale]/                   # i18n routes (vi | en)
│       ├── layout.tsx              # ThemeProvider + LenisProvider + NextIntlClientProvider
│       ├── page.tsx                # Home: HeroSection + FeaturedCafesSection
│       ├── (auth)/login|register/
│       ├── (main)/search|quiz|saved|contribute|cafe/[slug]/
│       └── _sections/              # HeroSection, FeaturedCafesSection, FeaturedSection, MapCtaSection, StorySection
├── components/
│   ├── ui/                         # Button (CVA), Badge, Input, Modal, Skeleton, ThemeToggle, LocaleSwitcher, ...
│   ├── cafe/                       # CafeCard, CafeGrid, CafeList, CafeFilter, NearbyButton, SaveButton, ...
│   ├── layout/                     # Header, Footer, MobileBottomNav
│   └── providers/                  # LenisProvider (smooth scroll context), PageTransition (framer-motion)
├── lib/
│   ├── api.ts                      # apiFetch helper + getCafes/getCafeBySlug/getNearbyCafes/toggleSaveCafe/submitCafe
│   ├── mock-data.ts                # MOCK_CAFES fallback khi API lỗi
│   ├── utils.ts                    # cn() = clsx + tailwind-merge
│   ├── hcmc-wards.ts
│   └── supabase/client.ts|server.ts
├── types/cafe.ts|user.ts|quiz.ts
├── i18n/routing.ts|request.ts      # locales: ['vi', 'en'], defaultLocale: 'vi'
└── messages/vi.json|en.json
```

## Stack & Dependencies

| Mục       | Thư viện                                   |
| --------- | ------------------------------------------ |
| Framework | Next.js 16.2.4, React 19                   |
| i18n      | next-intl ^4.9.1                           |
| Theming   | next-themes ^0.4.6                         |
| Animation | framer-motion ^12.38.0, lenis ^1.3.23      |
| UI Base   | @base-ui/react ^1.4.1, shadcn ^4.5.0       |
| Styling   | Tailwind CSS v4, CVA, clsx, tailwind-merge |
| Icons     | lucide-react ^1.11.0                       |
| Auth/DB   | @supabase/ssr + @supabase/supabase-js      |

## Quy ước code

- **Path alias**: `@/*` → `./src/*`
- **Utility**: Dùng `cn()` từ `@/lib/utils` cho conditional classnames
- **Button**: `buttonVariants({ variant, size })` hoặc `<Button>` component với CVA
- **Routing**: Luôn prefix locale, dùng `useRouter` và `usePathname` từ `@/i18n/navigation` (không phải `next/navigation` hay `next-intl` trực tiếp) trong client components — đây là locale-aware router được tạo bởi `createNavigation(routing)`
- **Translations**: `useTranslations()` (client) / `getTranslations()` (server)
- **Dark mode**: CSS variables `var(--background)`, `var(--foreground)`, `var(--accent)`, v.v.
- **Images**: Dùng `next/image` với `sizes` prop; remote patterns: `*.supabase.co`, `images.unsplash.com`, `lh3.googleusercontent.com`

## Types quan trọng (`src/types/cafe.ts`)

```ts
interface Cafe { id, name, slug, address, district, ward, lat, lng,
  openingHours, priceRange, oneLiner, description, vibe[], purpose[],
  amenities[], signatureDrink, rating, reviewCount, images[], coverImage,
  isPublished, distanceKm, createdAt }

type PriceRange = "under_50k" | "50k_100k" | "100k_150k" | "above_150k"
// Vibes: yên tĩnh | nhộn nhịp | vintage | hiện đại | thiên nhiên | sáng tạo | lãng mạn | minimalist
// Purposes: làm việc | học tập | hẹn hò | họp nhóm | chill một mình | gặp bạn bè
// Areas: 17 quận TP.HCM (Quận 1–12, Bình Thạnh, Gò Vấp, Phú Nhuận, Tân Bình, Tân Phú, Bình Tân, Thủ Đức)
```

## Biến môi trường (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Lưu ý ESLint

`react-hooks/set-state-in-effect` **không tồn tại** — đừng dùng. Các pattern sau hoàn toàn hợp lệ và không cần eslint-disable:

- Hydration guard: `useEffect(() => { setMounted(true) }, [])`
- Đóng menu khi navigate: `useEffect(() => { setMenuOpen(false) }, [pathname])`
- Sync external lib state: `setLenis(instance)` trong Lenis setup effect
