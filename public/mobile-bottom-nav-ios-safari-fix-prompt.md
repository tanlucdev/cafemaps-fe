# Prompt cho Agent: Chuyển mobile navigation xuống dưới và xử lý lỗi iOS Safari URL Bar nhìn xuyên content

## Bối cảnh

Mình muốn refactor giao diện mobile của website theo dạng **bottom navigation nằm ở dưới cùng**, giống layout tham chiếu trong ảnh CellphoneS.

Lưu ý quan trọng:

- **Không dùng header hamburger nữa.**
- **Không chuyển sang hamburger menu ở phía trên.**
- Mobile navigation cần nằm ở **dưới cuối màn hình**, dạng tab bar.
- Đây chỉ là giao diện **mobile / tablet nhỏ dưới desktop**.
- Giao diện desktop hiện tại phải giữ nguyên, không bị ảnh hưởng.

Hiện tại website của mình gặp lỗi trên iOS Safari mới:

- Thanh URL bar của iOS Safari nằm phía dưới.
- URL bar có lúc tự thu nhỏ / mở rộng / overlay.
- Khi URL bar có hiệu ứng trong suốt, người dùng có thể nhìn xuyên xuống content bên dưới.
- Giao diện hiện tại bị cảm giác lỗi vì bên dưới URL bar lộ ra text, line, border hoặc content màu vàng/kem.
- Tham chiếu CellphoneS xử lý tốt vì phía dưới URL bar luôn có một lớp nền trắng sạch, không để content bị lộ.

Mục tiêu là làm mobile bottom navigation giống hướng CellphoneS: phía dưới luôn sạch, có nền solid, không thấy content xuyên qua URL bar.

---

## Mục tiêu chính

Hãy refactor layout mobile để đạt các mục tiêu sau:

1. Dùng **bottom navigation bar** cho mobile.
2. Bottom navigation nằm ở dưới màn hình, giống tab bar.
3. Không dùng hamburger header.
4. Không render hamburger menu ở mobile.
5. Desktop header/navigation hiện tại giữ nguyên.
6. Chỉ áp dụng bottom navigation cho mobile/tablet nhỏ.
7. Trên iOS Safari, khi URL bar co/giãn hoặc overlay, phía dưới vẫn là một vùng nền solid sạch.
8. Không để text, line, image, border, section hoặc content scroll lọt xuống dưới URL bar.
9. Không dùng JS hack để điều khiển URL bar Safari.
10. Xử lý ở cấp `AppLayout` / `RootLayout` / `global.css`, không xử lý riêng từng page.

---

## Phạm vi áp dụng theo breakpoint

Bottom navigation mới **chỉ áp dụng dưới desktop**.

Yêu cầu rất quan trọng:

- Desktop giữ nguyên header/navigation hiện tại.
- Mobile dùng bottom navigation.
- Không để bottom navigation xuất hiện ở desktop.
- Không để desktop bị dư padding-bottom.
- Không làm ảnh hưởng layout desktop.

Breakpoint đề xuất:

```css
/* Mobile / tablet nhỏ */
@media (max-width: 767px) {
  .mobile-bottom-nav {
    display: block;
  }

  .desktop-header {
    display: none;
  }
}

/* Desktop / tablet lớn */
@media (min-width: 768px) {
  .mobile-bottom-nav {
    display: none;
  }

  .desktop-header {
    display: block;
  }

  .ios-bottom-browser-guard {
    display: none;
  }

  .app-main {
    padding-bottom: 0;
  }
}
```

Nếu project dùng Tailwind:

```tsx
<>
  <div className="hidden md:block">
    <DesktopHeader />
  </div>

  <div className="block md:hidden">
    <MobileBottomNav />
  </div>
</>
```

---

## Nguyên tắc quan trọng

Không thể style trực tiếp iOS Safari URL bar vì nó là browser chrome, không nằm trong DOM.

Cách đúng là:

- Kiểm soát background của `html`, `body`, `#__next` hoặc `#root`.
- Tạo bottom navigation có nền solid.
- Thêm một lớp nền cố định ở đáy màn hình để làm “iOS browser guard”.
- Cho bottom navigation có background extension xuống dưới, để khi URL bar trong suốt thì vẫn chỉ thấy nền sạch.
- Thêm padding-bottom cho main content để content không bị bottom nav và URL bar che.
- Dùng `env(safe-area-inset-bottom)` để tương thích iPhone có safe area.
- Tránh dùng `100vh` cũ cho layout mobile chính.
- Ưu tiên dùng `100svh` hoặc `100dvh`.

---

## Việc cần làm

### 1. Thêm hoặc kiểm tra meta viewport

Trong root layout hoặc document head, thêm/cập nhật:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Nếu project dùng Next.js App Router, kiểm tra trong `app/layout.tsx` hoặc metadata config.

Nếu project dùng Pages Router, kiểm tra trong `_document.tsx` hoặc `_app.tsx`.

---

### 2. Đặt background solid cho toàn bộ app

Cần đảm bảo các element root không bị trong suốt.

Thêm vào global CSS:

```css
:root {
  --app-bg: #fbf7ec;
  --app-surface: #fffdf6;
  --app-text: #3f2f1f;
  --app-muted: rgba(63, 47, 31, 0.58);
  --app-border: rgba(83, 63, 35, 0.12);

  --mobile-bottom-nav-height: 72px;
  --ios-bottom-guard-height: 120px;
}

html,
body {
  min-height: 100%;
  background: var(--app-bg);
  overscroll-behavior-y: none;
}

body {
  margin: 0;
}

#__next,
#root {
  min-height: 100%;
  background: var(--app-bg);
}
```

Nếu màu nền thật của website khác `#fbf7ec`, hãy thay `--app-bg` bằng màu nền thật đang dùng.

Yêu cầu: không để `body`, `html`, wrapper chính hoặc layout root có background transparent.

---

### 3. Không dùng 100vh cho mobile layout chính

Nếu đang có code kiểu:

```css
min-height: 100vh;
height: 100vh;
```

hãy thay bằng:

```css
min-height: 100svh;
```

hoặc nếu cần viewport động theo thanh trình duyệt:

```css
min-height: 100dvh;
```

Với Tailwind:

- Hạn chế `h-screen` và `min-h-screen` trên mobile.
- Ưu tiên `min-h-[100svh]` hoặc `h-[100dvh]`.

Ví dụ:

```css
.app-shell {
  min-height: 100svh;
  background: var(--app-bg);
}
```

---

## Bottom navigation mobile

### Mục tiêu UI

Bottom navigation cần giống kiểu tab bar ở dưới:

- Nằm fixed ở cuối màn hình.
- Có 4 hoặc 5 tab, ví dụ:
  - Home
  - Search
  - Saved
  - Profile
- Có icon phía trên, label phía dưới.
- Active tab có màu nổi bật.
- Inactive tab có màu nhẹ hơn.
- Nền của nav phải solid hoặc gần như solid.
- Không dùng background trong suốt hoàn toàn.
- Không để content lộ phía sau nav hoặc phía sau iOS URL bar.

---

### CSS bottom navigation đề xuất

```css
.mobile-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  display: block;
  background: var(--app-surface);
  border-top: 1px solid var(--app-border);
  box-shadow: 0 -10px 30px rgba(63, 47, 31, 0.08);
  transform: translateZ(0);
}

/*
  Phần này rất quan trọng:
  Tạo nền kéo dài xuống dưới nav để iOS Safari URL bar khi overlay/trong suốt
  chỉ nhìn thấy một lớp nền sạch, không thấy content phía sau.
*/
.mobile-bottom-nav::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
  background: var(--app-surface);
  pointer-events: none;
}

.mobile-bottom-nav-inner {
  height: calc(var(--mobile-bottom-nav-height) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  background: var(--app-surface);
}

.mobile-bottom-nav-item {
  min-width: 0;
  height: var(--mobile-bottom-nav-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--app-muted);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  -webkit-tap-highlight-color: transparent;
}

.mobile-bottom-nav-item svg {
  width: 24px;
  height: 24px;
}

.mobile-bottom-nav-item.is-active {
  color: #9a6a16;
  font-weight: 700;
}

@media (min-width: 768px) {
  .mobile-bottom-nav {
    display: none;
  }
}
```

Nếu muốn nền trắng giống CellphoneS, đổi:

```css
--app-surface: #ffffff;
```

Nếu muốn giữ nền kem/vàng của website, dùng:

```css
--app-surface: #fffdf6;
```

---

## iOS bottom browser guard

Ngoài `::after` của bottom nav, nên thêm một lớp guard riêng ở cấp layout để đảm bảo phía sau Safari URL bar luôn sạch.

```css
.ios-bottom-browser-guard {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
  background: var(--app-surface);
  pointer-events: none;
  z-index: 40;
  transform: translateZ(0);
}

@media (min-width: 768px) {
  .ios-bottom-browser-guard {
    display: none;
  }
}
```

Lưu ý z-index:

- Content bình thường: thấp hơn 40.
- `ios-bottom-browser-guard`: `z-index: 40`.
- `mobile-bottom-nav`: `z-index: 80`.
- Modal/overlay nếu có: cao hơn 100.

---

## Padding-bottom cho main content

Vì có bottom navigation và guard, main content cần padding-bottom đủ lớn.

```css
.app-main {
  padding-bottom: calc(
    var(--mobile-bottom-nav-height) +
    var(--ios-bottom-guard-height) +
    env(safe-area-inset-bottom, 0px)
  );
}

@media (min-width: 768px) {
  .app-main {
    padding-bottom: 0;
  }
}
```

Nếu page có floating CTA hoặc sticky action ở dưới, cần cộng thêm spacing hoặc đưa CTA lên trên bottom nav.

Không để content quan trọng nằm sát đáy viewport.

---

## Refactor AppLayout

Nếu dùng React/Next.js, chỉnh layout theo hướng:

```tsx
type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <main className="app-main">
        {children}
      </main>

      <div
        aria-hidden="true"
        className="ios-bottom-browser-guard"
      />

      <div className="block md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
```

Yêu cầu:

- Không render `MobileBottomNav` ở desktop.
- Không render hamburger header.
- Không thay thế `DesktopHeader`.
- Guard phải nằm ở layout cấp cao, không đặt trong từng page.
- `main` phải có padding-bottom tương ứng trên mobile.

---

## Ví dụ MobileBottomNav React

Có thể dùng ví dụ này làm hướng refactor:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
  },
  {
    label: "Saved",
    href: "/saved",
    icon: Heart,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "mobile-bottom-nav-item",
                isActive ? "is-active" : "",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

Nếu website dùng tiếng Việt, có thể đổi label:

```tsx
const navItems = [
  {
    label: "Trang chủ",
    href: "/",
    icon: Home,
  },
  {
    label: "Tìm kiếm",
    href: "/search",
    icon: Search,
  },
  {
    label: "Đã lưu",
    href: "/saved",
    icon: Heart,
  },
  {
    label: "Tài khoản",
    href: "/profile",
    icon: User,
  },
];
```

---

## Nếu dùng Tailwind

Có thể dùng Tailwind cho component, nhưng vẫn nên giữ CSS global cho safe-area, `::after`, guard và padding-bottom.

Ví dụ component:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, User } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Saved", href: "/saved", icon: Heart },
  { label: "Profile", href: "/profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex h-[var(--mobile-bottom-nav-height)] min-w-0 flex-col items-center justify-center gap-1.5 text-xs no-underline",
                isActive
                  ? "font-bold text-[#9a6a16]"
                  : "font-medium text-[var(--app-muted)]",
              ].join(" ")}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

Global CSS vẫn giữ:

```css
:root {
  --app-bg: #fbf7ec;
  --app-surface: #fffdf6;
  --app-muted: rgba(63, 47, 31, 0.58);
  --app-border: rgba(83, 63, 35, 0.12);
  --mobile-bottom-nav-height: 72px;
  --ios-bottom-guard-height: 120px;
}

html,
body,
#__next,
#root {
  background: var(--app-bg);
}

.app-shell {
  min-height: 100svh;
  background: var(--app-bg);
}

.app-main {
  padding-bottom: calc(
    var(--mobile-bottom-nav-height) +
    var(--ios-bottom-guard-height) +
    env(safe-area-inset-bottom, 0px)
  );
}

.mobile-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  background: var(--app-surface);
  border-top: 1px solid var(--app-border);
  box-shadow: 0 -10px 30px rgba(63, 47, 31, 0.08);
  transform: translateZ(0);
}

.mobile-bottom-nav::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
  background: var(--app-surface);
  pointer-events: none;
}

.mobile-bottom-nav-inner {
  height: calc(var(--mobile-bottom-nav-height) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  background: var(--app-surface);
}

.ios-bottom-browser-guard {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
  background: var(--app-surface);
  pointer-events: none;
  z-index: 40;
  transform: translateZ(0);
}

@media (min-width: 768px) {
  .app-main {
    padding-bottom: 0;
  }

  .mobile-bottom-nav,
  .ios-bottom-browser-guard {
    display: none;
  }
}
```

---

## Những chỗ cần kiểm tra trong code hiện tại

### 1. Xóa hoặc không render hamburger mobile

Tìm và remove/disable trên mobile các component như:

- `MobileHeader`
- `HamburgerMenu`
- `MobileMenu`
- `DrawerMenu`
- `SidebarMobile`

Nếu desktop đang dùng header riêng thì giữ nguyên desktop.

---

### 2. Giữ desktop header

Không thay đổi hoặc remove:

- `DesktopHeader`
- desktop nav
- desktop menu
- desktop layout

Chỉ conditionally render theo breakpoint.

---

### 3. Kiểm tra bottom navigation cũ nếu có

Nếu project đã có bottom navigation cũ, có thể tái sử dụng, nhưng phải sửa lại:

- Thêm safe area.
- Thêm background solid.
- Thêm `::after` extension.
- Thêm guard.
- Thêm padding-bottom cho main.
- Đảm bảo không hiện desktop.

---

### 4. Kiểm tra các element fixed bottom khác

Tìm:

```css
position: fixed;
bottom: 0;
```

hoặc Tailwind:

```txt
fixed bottom-0
sticky bottom-0
```

Nếu có floating CTA/filter/action bar, cần tránh đè lên bottom nav.

Ví dụ:

```css
.floating-cta {
  bottom: calc(
    var(--mobile-bottom-nav-height) +
    16px +
    env(safe-area-inset-bottom, 0px)
  );
}
```

---

### 5. Kiểm tra các layout dùng 100vh

Tìm toàn project:

```txt
100vh
h-screen
min-h-screen
```

Trên mobile Safari, cân nhắc thay bằng:

```txt
100svh
100dvh
min-h-[100svh]
h-[100dvh]
```

---

### 6. Kiểm tra content nằm sát đáy

Không để những thứ sau nằm sát đáy viewport:

- line divider
- border
- text
- image
- sticky filter
- tab
- section title
- card
- CTA

Nếu có, bottom guard và padding-bottom phải che/đẩy lên đủ.

---

## Acceptance Criteria

Sau khi refactor, cần đạt:

1. Mobile dùng bottom navigation ở dưới, không dùng hamburger.
2. Desktop giữ nguyên header/navigation hiện tại.
3. Bottom nav không xuất hiện ở desktop.
4. Trên iPhone Safari thật, khi mới load trang không thấy content lộ dưới URL bar.
5. Khi scroll xuống làm URL bar thu nhỏ, phía dưới vẫn là nền sạch.
6. Khi scroll lên làm URL bar mở rộng lại, không thấy line/text/card lộ sau URL bar.
7. Bottom nav có nền solid, không trong suốt hoàn toàn.
8. Bottom nav có safe-area padding.
9. Main content không bị bottom nav che.
10. Không có khoảng trắng bất thường trên desktop.
11. Không dùng JS hack để điều khiển URL bar.
12. Tất cả route mobile đều có behavior giống nhau.

---

## Test checklist

Test trên iPhone Safari thật:

- Mở trang lần đầu.
- Scroll xuống chậm.
- Scroll xuống nhanh.
- Scroll lên lại.
- Chạm vào URL bar.
- Chuyển route bằng bottom nav.
- Vào page dài và page ngắn.
- Vào page có filter/search.
- Kiểm tra có text/line/card nào lộ dưới URL bar không.

Test desktop:

- Header desktop vẫn còn.
- Bottom nav không xuất hiện.
- Không dư padding-bottom.
- Layout desktop không bị thay đổi.

Test Android:

- Bottom nav hiển thị đúng.
- Không bị dư khoảng trống quá lớn.
- Không che content quan trọng.

---

## Gợi ý thứ tự làm

Hãy làm theo thứ tự:

1. Giữ nguyên desktop header.
2. Remove/disable hamburger mobile.
3. Tạo hoặc refactor `MobileBottomNav`.
4. Thêm global CSS cho root background.
5. Thêm `viewport-fit=cover`.
6. Thêm bottom nav safe area.
7. Thêm `mobile-bottom-nav::after`.
8. Thêm `ios-bottom-browser-guard`.
9. Thêm padding-bottom cho `app-main`.
10. Kiểm tra `100vh`, `h-screen`, `min-h-screen`.
11. Test trên iPhone Safari thật.
12. Điều chỉnh `--ios-bottom-guard-height` nếu vẫn còn lộ content.

---

## Lưu ý cuối cùng cho agent

Không được làm header hamburger nữa.

Hướng đúng là:

- Desktop: giữ header hiện tại.
- Mobile: dùng bottom navigation ở cuối màn hình.
- iOS Safari: xử lý bằng solid background, safe-area, bottom nav extension và bottom guard.

Mục tiêu thị giác là giống CellphoneS: khi URL bar của iOS Safari co/giãn hoặc trong suốt, người dùng chỉ thấy một vùng nền sạch phía sau, không thấy nội dung website bị lộ.
