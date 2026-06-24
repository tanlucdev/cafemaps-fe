# Site Vibe Alignment Agent Plan

## Mục tiêu

Redesign các trang còn lại để cùng hệ với Cafe Maps mới: cinematic, warm, image-first, editorial discovery nhưng vẫn usable. Agent phải giữ routing, auth, locale, theme, bottom nav và data flow hiện có. Không rewrite app, không đổi backend nếu chưa được yêu cầu.

## Agent Prime Context

Trước khi sửa code, agent phải đọc các file này:

1. `AGENTS.md`
   - Next.js rule: đọc guide trong `node_modules/next/dist/docs/` nếu có trước khi touch Next APIs.
   - Hiện package không có path docs này; nếu cần Next docs, tìm tài liệu tương đương trong package hoặc dùng docs chính thức.
2. `src/docs/header-redesign-plan.md`
   - Source of truth cho header, tokens, cross-page alignment, mobile/bottom-nav rules.
3. `src/docs/navigation-audit.md`
   - Source of truth cho locale-aware navigation.
4. Page/component đang sửa.
5. Một page đã aligned để làm reference:
   - Home: `src/app/[locale]/(main)/page.tsx` + `_sections/hero/CafeHeroCinematic.tsx`
   - Search/list: `src/app/[locale]/_sections/FeaturedSection.tsx`
   - Contribute: `src/app/[locale]/(main)/contribute/page.tsx` + `ContributeForm.tsx`

## Current Aligned Direction

- Header: floating surface/cinematic variant, mobile utility rail only.
- Home: video/image-first cinematic hero, cream/coffee/amber, editorial headline.
- Search/list: warm textured background, glass filter surfaces, cafe cards remain scannable.
- Contribute: first viewport fits; mobile shows intro + form in one screen; desktop shows intro + visual + trust notes + form.
- Metadata: default canonical should resolve to `https://cafemaps.net`; OG image uses `/image/meta-image.webp`.

## Global Visual Rules

- Use existing tokens: `var(--background)`, `var(--foreground)`, `var(--foreground-muted)`, `var(--card)`, `var(--border)`, `var(--accent)`, `var(--accent-light)`, `var(--sage)`, coffee `#1f1209`, cream `#fff0d2/#fffaf2`.
- Keep surfaces warm glass/light cream on non-home pages.
- Use real existing visual assets when possible: `/image/home-polaroid-*.jpg`, `/image/logo.png`, `background.mp4` if suitable.
- Avoid SVG/gradient-only hero art for content pages.
- Avoid decorative orb/blob backgrounds. Subtle texture is OK.
- Use Lora only for editorial page-level headings, not dense controls.
- Keep form/card/header type compact and scannable.
- Cards/panels: `rounded-[18px]` to `rounded-[28px]`; avoid nested cards.
- Page first viewport should not feel like a marketing landing page unless the page is explicitly content/editorial.
- Mobile first screen must prioritize the core workflow, not decorative visuals.

## Interaction Rules

- `Link`, `useRouter`, `usePathname` in localized app/components must come from `@/i18n/navigation`.
- Keep existing auth/loading behavior unless task requires backend work.
- Keep `MobileBottomNav` as primary mobile nav. Do not duplicate desktop nav on mobile.
- Touch targets at least 40px for buttons/icons.
- `aria-current="page"` for active route links.
- Focus states visible with amber ring.
- Reduced motion: avoid layout-heavy animation; opacity/shadow/background only.

## Page Priority

### P0: Fix Active/Shared Shell

- Header active state should remain subtle, no strong amber pill on every active item.
- Footer should not clash with warm cinematic direction.
- Metadata/canonical hygiene should not depend on Vercel preview URLs unless explicitly configured.

### P1: Saved

Files:
- `src/app/[locale]/(main)/saved/page.tsx`
- `src/app/[locale]/(main)/saved/_components/SavedCafesClient.tsx`

Goal:
- Collection page, not dashboard.
- Warm collection surface, saved folders/cards feel like curated coffee list.
- Empty state image-forward or brand-forward, not generic SaaS.

Checks:
- Logged-out state still clear.
- Folder create/rename/delete unchanged.
- Mobile bottom nav does not crowd first viewport.

### P1: Profile

Files:
- `src/app/[locale]/(main)/profile/page.tsx`
- `src/app/[locale]/(main)/profile/_components/ProfilePageClient.tsx`

Goal:
- Utility page with warm account surfaces.
- Avoid oversized hero. Keep account actions obvious.
- Quick links should feel like cafe guide actions, not admin tiles.

Checks:
- Logged-out/login flows unchanged.
- User menu/auth event behavior unchanged.

### P1: Cafe Detail

Files:
- `src/app/[locale]/(main)/cafe/[slug]/page.tsx`
- `src/app/[locale]/(main)/cafe/[slug]/_components/*`

Goal:
- Image/detail-first, editorial detail + practical decision-making.
- Info panels align with search/contribute warm surfaces.
- Detail route should not make `Khám phá` active by default unless product explicitly wants it.

Checks:
- Save/share/map actions work.
- Gallery still usable.
- Similar cafes, hours, amenities readable.

### P2: Blog

Files:
- `src/app/[locale]/(main)/blog/page.tsx`
- `src/app/[locale]/(main)/blog/[slug]/page.tsx`

Goal:
- Editorial magazine vibe within same palette.
- Use real cafe imagery/assets, no generic card wall if avoidable.
- Article page should be readable, not over-decorated.

Checks:
- Slug pages SSG still work.
- Locale routes OK.

### P2: Quiz

Files:
- `src/app/[locale]/(main)/quiz/page.tsx`

Goal:
- Playful but still Cafe Maps warm discovery.
- Actual quiz experience first, not landing copy.
- Progress and answers use icons/surfaces, not emoji-only UI.

Checks:
- Result routes/actions work.
- Mobile fits controls without bottom nav overlap.

### P3: Auth

Files:
- `src/app/[locale]/(auth)/*`

Goal:
- Auth shell should align with warm brand, but stay focused.
- Keep login/register form behavior intact.

Checks:
- Validation unchanged.
- Provider buttons unchanged.

## Per-page Agent Workflow

1. Read relevant docs and target files.
2. Identify page job-to-be-done.
3. Choose one of these layouts:
   - Workflow page: compact intro + primary tool/form/list first.
   - Collection page: toolbar + content grid/list + empty state.
   - Detail page: image/header content + practical info/actions.
   - Editorial page: image-led intro + readable content.
4. Preserve data/auth/navigation contracts.
5. Move hardcoded copy to `src/messages/vi.json` and `src/messages/en.json` when adding new user-facing strings.
6. Use lucide icons instead of emoji UI.
7. Verify 375x812, 768x1024, 1440x900.
8. Run `npm run lint` and `npm run build`.
9. Mention any pre-existing warnings/errors separately.

## QA Checklist

For each redesigned page:

- [ ] First viewport shows the page's real task/content.
- [ ] Mobile does not require scroll just to find the primary action.
- [ ] Header and bottom nav do not overlap meaningful content.
- [ ] Light and dark mode readable.
- [ ] Empty/loading/error states styled in same system.
- [ ] Locale strings exist in VI and EN.
- [ ] Navigation uses `@/i18n/navigation` where applicable.
- [ ] Focus states visible.
- [ ] No text overflows at 375px width.
- [ ] No nested card stacks unless required by content structure.
- [ ] `npm run lint` passes or only known unrelated warnings remain.
- [ ] `npm run build` passes.

## Copy-paste Prompt For Next Agent

```md
You are working in `/Users/nguyentanluc/tanlucdev/cafe/fe-uiux`.

Task: redesign `<PAGE>` to match the Cafe Maps warm cinematic / image-first direction.

Before editing, read:
- `AGENTS.md`
- `src/docs/header-redesign-plan.md`
- `src/docs/navigation-audit.md`
- `src/docs/site-vibe-alignment-agent-plan.md`
- target page files

Constraints:
- Keep current data/auth/locale behavior.
- Use `@/i18n/navigation` for localized navigation.
- Move new user-facing copy to `src/messages/vi.json` and `src/messages/en.json`.
- Use existing warm coffee/cream/amber/sage tokens.
- Use lucide icons instead of emoji UI.
- Do not add hamburger/drawer.
- Do not duplicate mobile bottom nav.
- Keep mobile first viewport focused on the actual task.

Verify:
- `npm run lint`
- `npm run build`
- screenshots/visual QA at 375x812, 768x1024, 1440x900

Report changed files, known unrelated warnings, and any blocked QA.
```

## Known Current Build Notes

- `npm run lint` may report existing unused `locale` warnings in unrelated files.
- Build can log sitemap API `400 Bad Request` from `getCafesWithMeta`, but currently completes.
- Do not run dev server and production build at the same time; `.next` can be invalidated during concurrent runs.
