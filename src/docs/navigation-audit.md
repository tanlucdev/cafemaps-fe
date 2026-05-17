# Navigation Audit — Locale-Aware Routing

## Vấn đề

Trong app Next.js với `[locale]/` route group, mọi navigation qua `next/link` hoặc `next/navigation` đều **bypass locale-aware router**, dẫn đến:

- Full server round-trip thay vì client-side navigation
- Re-render toàn bộ shell UI (~500ms overhead mỗi lần switch tab/route)
- Mất smooth transition, UX kém

`@/i18n/navigation` export `Link`, `useRouter`, `usePathname` được tạo bởi `createNavigation(routing)` — chúng tự handle locale prefix và giữ navigation hoàn toàn client-side trong `[locale]/` routes.

---

## Checklist Audit (chạy từ project root)

### Pattern 1 — Sai import `Link`

```bash
grep -r 'import Link from "next/link"' src/ --include="*.tsx" --include="*.ts" -l
```

**Rule:**
- Trong `[locale]/` routes và components render trong đó → dùng `import { Link } from "@/i18n/navigation"`
- Ngoài `[locale]/` (root layout, providers, middleware) → OK dùng `next/link`

---

### Pattern 2 — Sai import `useRouter`

```bash
grep -rn 'useRouter.*from "next/navigation"' src/ --include="*.tsx"
```

**Rule:**
- Bất kỳ component nào trong `[locale]/` dùng `router.push("/...")` → phải dùng `@/i18n/navigation`
- Ngoại lệ OK: `redirect()`, `notFound()` từ `next/navigation` trong server components

---

### Pattern 3 — Sai import `usePathname`

```bash
grep -rn 'usePathname.*from "next/navigation"' src/ --include="*.tsx"
```

**Rule:**
- Dùng để so sánh với locale-prefixed paths (active route detection) → phải dùng `@/i18n/navigation`
- Dùng trong providers không liên quan locale → OK

---

### Pattern 4 — Hardcoded `href` thiếu locale

```bash
grep -rn 'href="/' src/ --include="*.tsx" | grep -v 'href="/api' | grep -v '\.test\.'
```

**Rule:**
- Trong `[locale]/` routes với `Link` từ `@/i18n/navigation`: `href="/"` được tự động prefix locale → OK
- Với `Link` từ `next/link`: `href="/"` không có locale prefix → phải đổi sang `@/i18n/navigation`

---

### Pattern 5 — Thiếu `layout.tsx` trong route group

Kiểm tra thủ công: nếu nhiều page trong cùng route group đều render cùng một shell UI (header, sidebar, bottom nav), shell đó phải được lift lên `layout.tsx` để stays mounted khi navigate giữa các page trong group.

Checklist:
- [ ] Route group có `layout.tsx` không?
- [ ] Các page trong group có render cùng shell component không?
- [ ] Shell component đã được lift lên layout chưa?

Ví dụ đã fix: `src/app/[locale]/(auth)/layout.tsx` — tạo shared layout cho `/login` và `/register` thay vì mỗi page tự render `AuthShell`.

---

## Vi phạm hiện tại (snapshot — 2026-05-17)

| File | Vi phạm | Trạng thái |
|------|---------|------------|
| `src/app/[locale]/(main)/cafe/[slug]/_components/CafeDetailContent.tsx` | `useRouter` từ `next/navigation` | Chưa fix |
| `src/app/[locale]/_sections/HeroSection.tsx` | `useRouter` từ `next/navigation` | Chưa fix |
| `src/components/cafe/SaveButton.tsx` | `useRouter` từ `next/navigation` | Chưa fix |
| `src/components/layout/Header.tsx` | `usePathname` từ `next/navigation` | Chưa fix |
| `src/components/layout/MobileBottomNav.tsx` | `usePathname` từ `next/navigation` | Chưa fix |
| `src/app/[locale]/(main)/contribute/ContributeForm.tsx` | `next/link` + `href="/"` hardcoded | Chưa fix |

---

## Hướng fix chuẩn

### useRouter

```tsx
// Sai
import { useRouter } from "next/navigation"

// Đúng
import { useRouter } from "@/i18n/navigation"
```

Không cần thay đổi gì khác — API giống hệt nhau.

---

### usePathname

```tsx
// Sai
import { usePathname } from "next/navigation"

// Đúng
import { usePathname } from "@/i18n/navigation"
```

Lưu ý: `usePathname` từ `@/i18n/navigation` trả về path không có locale prefix (e.g. `/search` thay vì `/vi/search`), nên các so sánh như `pathname === "/search"` vẫn hoạt động đúng.

---

### Link

```tsx
// Sai
import Link from "next/link"
<Link href="/login">...</Link>

// Đúng
import { Link } from "@/i18n/navigation"
<Link href="/login">...</Link>  // tự động thêm /vi hoặc /en
```

---

### Layout boundary cho route group

```
// Trước: mỗi page tự render shell
app/[locale]/(auth)/login/page.tsx   → render <AuthShell>...</AuthShell>
app/[locale]/(auth)/register/page.tsx → render <AuthShell>...</AuthShell>

// Sau: shell nằm ở layout, stays mounted khi navigate
app/[locale]/(auth)/layout.tsx       → render <AuthShell>{children}</AuthShell>
app/[locale]/(auth)/login/page.tsx   → chỉ render form content
app/[locale]/(auth)/register/page.tsx → chỉ render form content
```

---

## Quy tắc cho agent

- Mọi import `Link`, `useRouter`, `usePathname` trong `src/app/[locale]/` và components render trong đó → dùng `@/i18n/navigation`
- `redirect()`, `notFound()` từ `next/navigation` trong server components → OK, không đổi
- `href="/"` với `Link` từ `@/i18n/navigation` → OK (locale auto-prefix)
- `href="/"` với `Link` từ `next/link` → sai, đổi sang `@/i18n/navigation`
- Nhiều page trong cùng route group render cùng shell → tạo `layout.tsx` để lift shell lên
- Chạy 4 grep commands ở trên sau mỗi lần fix để verify không còn vi phạm mới
