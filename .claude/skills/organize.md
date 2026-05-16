# Skill: Component & Project Structure Organization

When asked to add a new component, page, or feature, follow these guidelines.

## Core Principles

**Place code as close to where it's used as possible. Only promote to shared when there's a real reuse need.**

1. Local first, shared later — don't promote code prematurely.
2. Keep page files thin: fetch data and compose layout only. Logic lives in components/hooks.
3. Separate server components (async, fetch) from client components (`"use client"`, state, events).

---

## File Classification & Placement

### App-wide reusable UI → `src/components/ui/`
Primitives with no business logic: Button, Badge, Input, Modal, Skeleton, Select...

### Layout components → `src/components/layout/`
Header, Footer, MobileBottomNav — used across all pages.

### App-wide domain components → `src/components/cafe/`
CafeCard, CafeGrid, CafeFilter, NearbyButton, SaveButton — used across multiple pages.

### Page-local components → `src/app/[locale]/(main)/<page>/_components/`
Serves only that page. No need to export outside. Examples:
- `cafe/[slug]/_components/CafeDetailContent.tsx`
- `saved/_components/SavedCafesClient.tsx`

### Home page sections → `src/app/[locale]/_sections/`
HeroSection, FeaturedCafesSection, MapCtaSection, StorySection... — exclusive to the home page.

### API & data fetching → `src/lib/api.ts`
All `fetch` calls centralized here (getCafes, getCafeBySlug, getNearbyCafes...). Components never call fetch directly.

### Shared types → `src/types/`
DTOs and domain models (Cafe, User, Quiz). Types used in only one file can stay inline.

### Utilities → `src/lib/utils.ts`
Pure functions with no React dependency. `cn()`, transforms, formatters...

---

## Quick Decision Tree

```
How many pages use this component?
├── Only 1 page → place in that page's _components/
├── Multiple pages, cafe business logic → src/components/cafe/
└── Pure UI primitive → src/components/ui/

Does it need "use client"?
├── Has state/events/hooks → add "use client", name it *Client.tsx
└── Render only → server component (async, fetch directly)

Does it have complex logic?
├── Pure function → src/lib/utils.ts or a helper file next to the feature
└── React hook → custom hook next to the component, or src/hooks/ if reusable
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `CafeCard.tsx`, `SearchLoader.tsx` |
| Client component | `Client` suffix | `SavedCafesClient.tsx` |
| Home page section | `Section` suffix | `HeroSection.tsx`, `FeaturedCafesSection.tsx` |
| Loader/Skeleton | `Loader`/`Skeleton` suffix | `FeaturedCafesSkeleton.tsx` |
| Local component folder | `_components/` | Underscore prefix prevents Next.js treating it as a route |
| Route folder | kebab-case | `cafe/[slug]/`, `(main)/`, `(auth)/` |

---

## Routing & i18n

- **Never use** `next/navigation` or `next-intl` directly in client components.
- **Always use** `useRouter`, `usePathname`, `Link` from `@/i18n/navigation` — this is the locale-aware router.
- All routes under `(main)/` and `(auth)/` live inside `[locale]/`; Next.js prefixes the locale automatically.

---

## Example: Adding a `/profile` page

```
# 1. Create the page
src/app/[locale]/(main)/profile/page.tsx      ← server component, fetch data

# 2. If UI needs state
src/app/[locale]/(main)/profile/_components/ProfileClient.tsx   ← "use client"

# 3. If a new API call is needed → add to
src/lib/api.ts                                ← getUserProfile() function

# 4. If new types are needed → add to
src/types/user.ts                             ← if shared; inline if used in only one place
```

**Do not create** standalone `hooks/`, `stores/`, or `helpers/` directories unless there's a clear need — project scope is small, keep it flat.
