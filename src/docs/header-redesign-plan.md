# Header Redesign Plan

## Mục tiêu

Thiết kế lại header để khớp với vibe mới của Cafe Maps: cinematic, ấm, hình ảnh/quán là trung tâm, có cảm giác discovery hơn là dashboard. Header mới phải nhường sân cho hero video, vẫn đủ rõ để điều hướng, và không phá các flow hiện có như locale, theme, auth, bottom nav.

## Context đã đọc

- `src/components/layout/Header.tsx`: header hiện tại fixed, cao 62px, nền beige/solid trên home, desktop nav dạng pill, actions locale/theme/login/user.
- `src/app/[locale]/_sections/hero/CafeHeroCinematic.tsx`: hero mới dùng full-height video, card bo lớn, glass overlays, amber highlight, Lora headline, CTA/search island nằm trong khung cinematic.
- `src/app/[locale]/_sections/FeaturedSection.tsx`: search/listing mới chuyển sang warm textured background, glass filter bar, rounded surfaces, amber + sage accent.
- `src/app/[locale]/_sections/MapCtaSection.tsx`: visual direction mới là image-forward, dark coffee overlay, warm glow, glass badges.
- `src/components/layout/MobileBottomNav.tsx`: mobile đã có bottom navigation fixed; header mobile không nên cố nhồi đủ nav.
- `src/docs/navigation-audit.md`: navigation trong `[locale]` routes phải dùng `@/i18n/navigation`.
- `AGENTS.md`: nếu implement code Next.js, kiểm tra guide trong `node_modules/next/dist/docs/` trước. Path này hiện không tồn tại trong install hiện tại, nên khi implement cần tìm lại tài liệu tương đương trong package hoặc docs chính thức nếu cần.

## Cross-page Design Alignment

Header không nên được thiết kế riêng lẻ. Nó phải là cầu nối giữa 3 mặt chính của sản phẩm:

1. Home cinematic
   - Video hero, dark coffee overlay, cream typography, amber glow.
   - Cảm giác: editorial, discovery, warm, immersive.

2. Search/listing pages
   - Warm textured surface, glass filter/search controls, cafe cards rõ thông tin.
   - Cảm giác: usable, scannable, vẫn giữ chất cafe guide.

3. Cafe detail pages
   - Image/cafe content là trung tâm, thông tin chi tiết dễ đọc, actions rõ.
   - Cảm giác: editorial detail + practical decision-making.

Thiết kế header tốt nhất là dùng cùng một ngôn ngữ visual nhưng đổi độ nổi theo page state:

- Trên Home top: header gần như tan vào hero, chỉ còn glass nhẹ + text cream.
- Trên Search/List: header rõ hơn, dùng warm surface sáng, giống filter/search surface.
- Trên Cafe Detail: header trung tính, nhẹ, không cạnh tranh với ảnh/quán.

## Shared Style Tokens

Các page nên dùng chung nhóm token dưới đây để nhìn cùng một hệ, không bị mỗi trang một vibe.

### Color

- Coffee dark: `#1f1209`, `#2a170c`, `rgba(32,16,6,...)`
- Cream text/surface: `#fff0d2`, `#fff7e8`, `#fffaf2`
- Amber accent: `#C9870C`, `#F0A830`, `#ffd18c`
- Soft border: `#ffe3b7` với opacity thấp, hoặc `var(--border)` trên light pages
- Muted foreground: dùng `var(--foreground-muted)` trên page sáng, cream opacity trên hero tối

### Surface

- Hero/header top: dark glass, blur vừa, border amber rất nhẹ.
- Search/filter/card: light warm glass, border mảnh, shadow mềm.
- Cafe detail info: surface sáng/neutral, ít glow hơn để đọc tốt.

### Shape

- Header/action/filter chips: `rounded-full`.
- Cards/panels: ưu tiên `rounded-[18px]` đến `rounded-[24px]`, không quá bubble.
- Hero frame lớn hơn: `rounded-[24px]` mobile, `rounded-[36px]` desktop.

### Typography

- Hero headline: Lora, lớn, editorial.
- Header/nav/filter/card: Plus Jakarta Sans, gọn, scan nhanh.
- Không dùng display-size text trong card/filter/header.

### Motion

- Header chỉ animate opacity/background/shadow.
- Card/filter hover nhẹ: translate 1-2px, shadow mềm.
- Không animate layout lớn khi scroll.

## Page Matching Strategy

### Home

- Header top dùng cinematic variant.
- Header không tạo full-width band.
- Logo/nav/actions phải readable trên video bằng glass group, không bằng shadow text đơn thuần.
- Primary action vẫn nằm trong hero, header chỉ hỗ trợ navigation.

### Search/List

- Header dùng surface variant ngay từ đầu.
- Active `Khám phá` nhẹ hơn: dot/underline/soft wash, không full amber pill lớn.
- Search/filter bar nên cùng chất với header: warm glass, border mảnh, không dashboard-blue/gray.

### Cafe Detail

- Header surface variant, không map active nav về `Khám phá` mặc định.
- Nếu detail hero/cover image tối, header vẫn giữ light glass để nhất quán với content page.
- Detail actions như save/share/open map nên dùng cùng token cream/amber/sage, không tạo palette mới.

### Auth/Profile/Saved/Contribute

- Header surface variant.
- Giữ tone utilitarian hơn Home, nhưng vẫn warm.
- Không dùng cinematic dark header trừ khi page có image hero tương ứng.

## Two-page Visual Comparison QA

Khi redesign header, cần so trực tiếp ít nhất 2 cặp page để đảm bảo giống style:

1. Home top vs Search page
   - Header đổi state nhưng không đổi brand mood.
   - Nav/action spacing giống nhau.
   - Amber/cream dùng cùng sắc độ.

2. Search page vs Cafe detail
   - Header surface giống nhau.
   - Card/detail surfaces cùng độ bo, border, shadow.
   - Active nav không gây hiểu nhầm trên detail.

3. Home mobile vs Search mobile
   - Header mobile chỉ là utility rail.
   - Bottom nav là navigation chính.
   - Không có duplicate nav gây chật hero.

## Design Deliverable Before Code

Trước khi implement header nên chốt nhanh 1 design spec nhỏ:

- Variant A: cinematic top home.
- Variant B: scrolled/surface home.
- Variant C: non-home surface.
- Mobile header state.
- Active nav state.
- Login/user state.

Nếu làm kỹ hơn, tạo screenshot checklist cho 2 page chính:

- `/vi` home.
- `/vi/search` listing.
- `/vi/cafe/[slug]` detail nếu có data ổn.

## Vấn đề với header hiện tại

1. Quá solid trên home
   - Hero mới đã có khung video cinematic, shadow và glass overlay.
   - Header beige/solid + shadow dày làm hero bị cắt mood ngay ở first viewport.

2. Visual language lệch
   - Nav pill active `#C9870C` nhìn giống app admin/filter chip.
   - Hero dùng dark coffee glass, amber cream, subtle border; header hiện tại dùng surface phẳng.

3. Brand chưa đủ editorial
   - Logo chỉ là ảnh 40px, không có lockup hay cảm giác “Cafe Maps” như một guide/curator.
   - Trên cinematic hero, logo cần nhẹ, sang, ít “buttony”.

4. Desktop nav đang ngang hàng với CTA
   - `Khám phá`, `Đã lưu`, `Đóng góp`, `Đăng nhập` có cùng trọng lượng thị giác.
   - Với home mới, primary action nên là search/explore, còn saved/contribute là secondary.

5. Mobile header dư vai trò
   - Mobile bottom nav đã xử lý Home/Search/Saved/Profile.
   - Header mobile nên chỉ giữ brand + utility actions, tránh che hero và giảm chiều cao cảm nhận.

## Direction đề xuất

Header mới nên là **floating cinematic top bar**:

- Home top state: transparent/glass rất nhẹ, text cream, nằm trên nền hero nhưng không như một band riêng.
- Scrolled state: chuyển thành warm glass surface, border mảnh, shadow nhẹ, vẫn fixed.
- Non-home state: dùng warm glass/light surface, không quá dark, khớp Featured/Search/Cafe detail.
- Desktop: brand lockup trái, nav giữa/trái nhẹ, actions phải.
- Mobile: brand icon/short lockup trái, locale/theme/user phải; nav chính để bottom nav xử lý.

Tone: “cafe guide/editorial discovery”, không “SaaS navbar”.

## Design rules cho website

Các rule này nên follow khi implement header và các surface sau này.

1. Image-first
   - Trên home, mọi chrome cố định phải nhường cho video/ảnh.
   - Header không dùng nền opaque ở top hero trừ khi contrast fail.

2. Warm cinematic glass
   - Dùng `rgba(32, 16, 6, ...)`, `#fff0d2`, `#ffe3b7`, `var(--accent)` cho hero/top overlay.
   - Dùng `var(--background)`, `#fffaf2`, `var(--border)` cho non-home/light pages.
   - Border nên là 1px opacity thấp, shadow mềm, blur vừa.

3. Ít pill hơn, nhiều text-link hơn
   - Nav item default nên là text/icon subtle, không phải badge nổi.
   - Active state dùng underline/dot/soft amber wash, tránh full amber pill lớn.

4. One primary action
   - Header chỉ nên có 1 CTA nổi rõ: `Khám phá` hoặc search shortcut.
   - `Đã lưu`, `Đóng góp` là secondary; auth/user là utility.

5. Header state phải route-aware
   - Home at top: cinematic transparent.
   - Home scrolled: warm glass compact.
   - Search/detail/blog/profile: readable warm surface ngay từ đầu.

6. Mobile không duplicate bottom nav
   - Không show desktop nav links trên mobile.
   - Mobile header chỉ giữ brand + locale/theme/auth avatar.
   - Tránh menu drawer nếu chưa có nhu cầu thật.

7. Motion nhẹ, có reduced motion
   - Chỉ animate opacity/translate/shadow background khi scroll.
   - Không animate layout height mạnh.
   - Respect `prefers-reduced-motion` nếu thêm framer-motion.

8. Accessibility trước polish
   - `aria-current="page"` cho active nav.
   - Touch target tối thiểu 40px cho icon/action.
   - Contrast test trên hero video, light page, dark mode.
   - Focus ring rõ, dùng amber nhưng không chìm trên dark overlay.

## Header information architecture

### Desktop/tablet >= md

Trái:
- Logo image hiện có `/image/logo.png`.
- Optional wordmark: `Cafe Maps` hoặc text ẩn ở small desktop nếu quá chật.

Nav:
- `Khám phá` -> `/search`, primary nav.
- `Đã lưu` -> `/saved`, secondary.
- `Đóng góp` -> `/contribute`, secondary.
- Không đưa Blog/Quiz trở lại trừ khi product muốn đẩy content/quiz.

Phải:
- Locale switcher.
- Theme toggle.
- Auth avatar nếu logged in, login CTA nếu logged out.

### Mobile < md

Trái:
- Logo only hoặc logo + `Cafe Maps` nếu còn đủ width.

Phải:
- Locale compact.
- Theme icon.
- User avatar hoặc login icon/button compact.

Không show:
- Desktop nav links.
- Large login pill.

Lý do: bottom nav đã có Home/Search/Saved/Profile; header mobile nên là utility rail.

## Visual spec

### Dimensions

- Outer header vẫn fixed top, z-index cao hơn hero/filter bars.
- Height target: 58-62px desktop, 54-58px mobile.
- Home top padding vẫn respect `env(safe-area-inset-top)` qua `.site-header`.
- Inner max width: `max-w-7xl`, nhưng visual surface có thể là floating rounded bar thay vì full-width band.

### Shape

- Home top: no full-width border band. Dùng inner floating surface hoặc fully transparent.
- Scrolled/non-home: rounded-full or rounded-[22px] inner bar, not full width slab.
- Border radius nên nhất quán với cinematic cards nhưng nhỏ hơn hero: `rounded-full` for nav/action groups, `rounded-[22px]` nếu dùng container.

### Color states

Home top:
- Container: `bg-[#1f1209]/22`, `border-[#ffe3b7]/18`, `backdrop-blur-md` hoặc transparent.
- Text: `#fff0d4`, muted `text-[#ffe3b7]/72`.
- Active/search CTA: `bg-[#fff0d2] text-[#201006]` hoặc amber cream.

Home scrolled:
- Container: `bg-[#fffaf2]/86 dark:bg-[#1c1209]/76`.
- Border: `border-[#ead8bf]/70 dark:border-[#ffe3b7]/14`.
- Shadow: `0 12px 34px rgba(44,26,14,0.10)`.

Non-home:
- Container: same as home scrolled, but active nav can use `var(--accent)`.
- Avoid pure dark unless route background is cinematic.

### Typography

- Brand wordmark: Plus Jakarta Sans bold, 14-15px; optional tiny sublabel `HCMC cafe guide` only desktop if it does not clutter.
- Nav: 13px, font-semibold/bold, no uppercase tracking except tiny badges.
- Avoid negative letter spacing.

### Icons

- Keep lucide icons, but reduce visual weight.
- Desktop nav can use icons only for primary/important items or all items at 14px with low opacity.
- Login can be text button on desktop; icon/compact on mobile.

## Interaction spec

1. Scroll state
   - Current `window.scrollY > 4` can become `> 12` or `> 16` to avoid flicker.
   - Add initial sync on mount so reload mid-page gets correct state.

2. Active route
   - Use `pathname === href` for exact pages.
   - Use `pathname.startsWith("/cafe")` can map to `/search` only if desired; otherwise no nav active on detail.
   - Add `aria-current={isActive ? "page" : undefined}`.

3. Home overlay contrast
   - If header transparent over bright video frame, apply dark glass to inner controls.
   - Do not rely only on text shadow.

4. Auth loading
   - Keep `authState === null ? null` to avoid hydration mismatch/flicker.
   - Reserve action width only if layout shift is noticeable.

5. Locale/theme components
   - Either pass `className` variants for cinematic mode or wrap them in a small action group that normalizes their colors.
   - Avoid editing their behavior unless needed.

## Implementation plan

### Step 1: Extract route/state decisions in `Header.tsx`

- Keep component client-side.
- Continue using `Link`, `usePathname` from `@/i18n/navigation`.
- Compute:
  - `isHome = pathname === "/"`
  - `isCinematicTop = isHome && !scrolled`
  - `isSurface = !isCinematicTop`
- Add initial scroll sync in `useEffect`:
  - run `onScroll()` once before adding listener.

### Step 2: Change full-width slab into floating inner bar

- Keep `<header className="site-header fixed ...">` for safe-area behavior.
- Remove always-on `border-b` from outer header.
- Move background/border/shadow to inner bar:
  - outer: transparent, pointer area only.
  - inner: rounded/floating, responsive margin top.
- Suggested structure:
  - `header`
  - `div mx-auto max-w-7xl px-3 sm:px-6 lg:px-8`
  - `div header-shell flex h-[54/58px] items-center ... rounded-full border backdrop-blur-xl`

### Step 3: Brand lockup

- Keep `Image` logo.
- Add desktop wordmark next to logo:
  - `Cafe Maps`
  - optional small `HCMC guide` hidden below lg if too dense.
- On home top, wordmark cream; on surface, foreground.
- Mobile can hide wordmark at very small widths.

### Step 4: Restyle nav links

- Replace full amber active pill with subtle active state:
  - Active: text foreground/cream + tiny amber dot or soft background `bg-white/10` on cinematic, `bg-[var(--accent-light)]` on surface.
  - Default: muted text, hover soft background.
- Keep icons 14px but lower stroke/opacity for inactive.
- Add `aria-current`.
- Keep nav hidden on mobile.

### Step 5: Actions group

- Wrap locale/theme/auth in a single rounded action group:
  - Home top: dark glass `bg-[#1f1209]/26 border-[#ffe3b7]/16`.
  - Surface: light glass `bg-white/50 border-[var(--border)]`.
- Login desktop:
  - Home top: cream fill or border cream.
  - Surface: amber text/fill with lower shadow.
- Mobile login:
  - Use compact icon/textless or short `Login`; avoid 5px horizontal pill if cramped.

### Step 6: CSS support in `globals.css`

- Keep `.site-header` safe-area pseudo-element.
- Add optional custom classes if Tailwind strings get too long:
  - `.site-header-shell`
  - `.site-header-shell[data-variant="cinematic"]`
  - `.site-header-shell[data-variant="surface"]`
- Prefer CSS vars for repeated colors:
  - `--header-cinematic-bg`
  - `--header-surface-bg`
  - `--header-border`
- Avoid big global side effects.

### Step 7: Mobile behavior polish

- Verify header + hero first viewport:
  - Hero starts with `pt-[calc(62px+...)]`; if header height changes, update hero top padding or keep visual height compatible.
  - Do not let header overlap hero text/search island at narrow widths.
- Keep `MobileBottomNav` unchanged unless active state visually conflicts.

### Step 8: QA

- Run lint/build if implementation changes code:
  - `npm run lint`
  - `npm run build`
- Manual viewport checks:
  - 375x812 home top, home scrolled, search page, cafe detail.
  - 768x1024 tablet.
  - 1440x900 desktop.
- Check themes:
  - light home top over video.
  - dark home top over video.
  - light search/detail.
  - dark search/detail.
- Check auth states:
  - logged out.
  - logged in user menu.
  - auth loading no large layout jump.
- Check locale switcher dropdown z-index above header/hero.
- Check focus states via keyboard.

## Suggested implementation order

1. Implement structural header shell in `src/components/layout/Header.tsx` only.
2. Adjust class variants for cinematic/surface states.
3. Add `aria-current`, initial scroll sync, active matching refinements.
4. Add small CSS helpers in `src/app/globals.css` only if class strings become hard to maintain.
5. Verify home and non-home pages visually.
6. Only then consider updating `ThemeToggle`, `LocaleSwitcher`, or `UserMenu` variants if their default colors still clash.

## Things to avoid

- Do not add a hamburger/drawer unless nav scope grows.
- Do not make a large opaque header band on home.
- Do not use strong amber pills for every active nav item.
- Do not duplicate bottom nav on mobile.
- Do not introduce a new design palette; extend current warm coffee tokens.
- Do not make header taller than current hero top padding unless hero padding is updated too.

## Open decisions

1. Brand lockup: chỉ logo, hay logo + `Cafe Maps` trên desktop?
2. Primary CTA: header nên nhấn `Khám phá` hay đổi thành icon/search shortcut?
3. Cafe detail route: active nav nên là none, hay map về `Khám phá`?
4. Login mobile: hiện text `Đăng nhập`, icon-only, hay ẩn vì profile đã có ở bottom nav?

## Recommended default

- Dùng logo + `Cafe Maps` trên desktop, logo-only trên mobile.
- Dùng `Khám phá` làm primary CTA nhẹ, không phải pill quá lớn.
- Cafe detail không active nav, để tránh hiểu nhầm đang ở search page.
- Mobile logged-out giữ compact `Đăng nhập` text nếu đủ rộng; nếu không thì dùng user icon với aria-label.
