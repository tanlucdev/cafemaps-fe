# Prompt cho Agent: Refactor Header Mobile và xử lý lỗi iOS Safari URL Bar nhìn xuyên xuống content

## Bối cảnh

Mình đang refactor giao diện mobile của website.

Hiện tại mình muốn đổi header/navigation sang dạng giống tham chiếu trong ảnh:

- Không dùng bottom menu bar nữa.
- Chuyển sang dùng header phía trên với hamburger menu.
- Header mobile cần gọn, rõ ràng, dễ hiểu.
- Website hiện tại có nền màu vàng/kem, nhưng trên iOS Safari mới đang gặp lỗi cảm giác “nhìn xuyên” xuống content khi URL bar ở dưới tự thu nhỏ hoặc mở rộng.

Vấn đề cụ thể:

- Trên iOS Safari, thanh URL ở dưới không nằm trong DOM nên mình không thể style trực tiếp nó.
- Khi URL bar co/giãn hoặc có trạng thái overlay trong suốt, người dùng có thể nhìn thấy content bên dưới như text, line, section, border hoặc background không đồng nhất.
- Điều này làm UI trông giống bị lỗi.
- Tham chiếu CellphoneS xử lý tốt vì phía dưới URL bar luôn có một lớp nền trắng sạch, nên dù Safari URL bar co/giãn thì không thấy content bị lộ ra bên dưới.
- Giao diện hiện tại của mình bị giống lỗi vì phần URL bar nhìn xuyên xuống các nội dung/đường kẻ/text màu vàng bên dưới.

Mục tiêu là xử lý ở cấp layout/global, không xử lý lẻ từng page.

---

## Mục tiêu chính

Hãy refactor mobile layout/header để đạt các mục tiêu sau:

1. Header mobile mới nằm phía trên, thay cho bottom navigation cũ.
2. Dùng hamburger menu ở góc phải hoặc vị trí hợp lý trên header.
3. Phía sau iOS Safari URL bar luôn là một vùng nền solid sạch, không bị lộ content bên dưới.
4. Khi Safari URL bar thu nhỏ, mở rộng, scroll lên/xuống, giao diện vẫn ổn định.
5. Không dùng hack JS để cố điều khiển URL bar của Safari.
6. Không để content quan trọng nằm sát đáy viewport trên mobile.
7. Xử lý bằng CSS safe area, viewport unit mới, background solid và bottom guard layer.

---

## Nguyên tắc quan trọng

Không thể style trực tiếp iOS Safari URL bar vì nó là browser chrome, không nằm trong DOM.

Cách đúng là:

- Kiểm soát background của `html`, `body`, `#__next` hoặc `#root`.
- Thêm một lớp nền cố định ở đáy màn hình để làm “browser guard”.
- Thêm padding-bottom cho main content để content không bị lớp guard che.
- Dùng `env(safe-area-inset-bottom)` để tương thích iPhone có safe area.
- Tránh dùng `100vh` cũ cho layout mobile chính.
- Ưu tiên dùng `100svh` hoặc `100dvh`.

---

## Việc cần làm

### 1. Thêm hoặc kiểm tra meta viewport

Trong file root layout hoặc document head, thêm/cập nhật meta viewport:

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
  --app-header-bg: rgba(251, 247, 236, 0.96);
  --app-border: rgba(83, 63, 35, 0.12);
  --ios-bottom-guard-height: 96px;
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

Gợi ý:

- `100svh`: phù hợp cho màn hình đầu tiên/hero, tránh bị browser UI che.
- `100dvh`: phù hợp khi cần layout phản ứng theo viewport động.
- Tránh dùng `100vh` trên mobile Safari vì dễ lệch khi URL bar hiện/ẩn.

Ví dụ wrapper chính:

```css
.app-shell {
  min-height: 100svh;
  background: var(--app-bg);
}
```

---

### 4. Thêm iOS bottom browser guard

Tạo một lớp fixed ở đáy màn hình để đảm bảo khi iOS Safari URL bar nhìn xuyên thì chỉ thấy nền sạch.

CSS:

```css
.ios-bottom-browser-guard {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
  background: var(--app-bg);
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

Lưu ý:

- `z-index` của guard nên cao hơn content bình thường.
- `pointer-events: none` để không chặn thao tác.
- Guard chỉ nên hiển thị mobile.
- Guard không cần hiển thị desktop/tablet lớn.
- Nếu có popup/modal/menu overlay, overlay đó phải có z-index cao hơn guard.

---

### 5. Thêm padding-bottom cho main content

Vì có lớp guard ở đáy, cần thêm padding-bottom cho main để content không bị che hoặc không nằm sát URL bar.

CSS:

```css
.app-main {
  padding-bottom: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
}
```

Nếu page có sticky CTA hoặc floating button ở dưới, cần cộng thêm spacing phù hợp.

Ví dụ:

```css
.app-main.has-floating-cta {
  padding-bottom: calc(160px + env(safe-area-inset-bottom, 0px));
}
```

---

### 6. Refactor AppLayout

Nếu project dùng React/Next.js, tạo hoặc chỉnh `AppLayout` theo hướng sau:

```tsx
type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <MobileHeader />

      <main className="app-main">
        {children}
      </main>

      <div
        aria-hidden="true"
        className="ios-bottom-browser-guard"
      />
    </div>
  );
}
```

Nếu dùng Tailwind:

```tsx
type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-[100svh] bg-[var(--app-bg)]">
      <MobileHeader />

      <main className="app-main">
        {children}
      </main>

      <div
        aria-hidden="true"
        className="ios-bottom-browser-guard"
      />
    </div>
  );
}
```

Yêu cầu quan trọng:

- Lớp `ios-bottom-browser-guard` phải nằm trong layout cấp cao nhất.
- Không đặt guard trong từng page riêng lẻ.
- Guard phải tồn tại xuyên suốt khi chuyển route.
- `main` phải có padding-bottom tương ứng.

---

## Header mobile mới

### Mục tiêu UI

Header mobile nên:

- Nằm trên cùng.
- Có nền solid hoặc blur nhẹ nhưng không trong suốt hoàn toàn.
- Có logo/tên website ở bên trái.
- Có hamburger button ở bên phải.
- Không dùng bottom menu bar nữa.
- Khi mở menu, menu overlay phải có nền solid, không để nhìn xuyên xuống content.
- Header cần thân thiện, dễ hiểu, phù hợp website cafe/map/discovery.

---

### CSS header đề xuất

```css
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 80;
  padding-top: env(safe-area-inset-top, 0px);
  background: var(--app-header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--app-border);
}

.mobile-header-inner {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #3f2f1f;
  text-decoration: none;
}

.mobile-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-menu-button {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--app-border);
  background: rgba(255, 255, 255, 0.72);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

Nếu không muốn blur, có thể đổi header thành solid hoàn toàn:

```css
.mobile-header {
  background: var(--app-bg);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
```

Ưu tiên solid nếu muốn tránh mọi cảm giác trong suốt trên iOS.

---

### Ví dụ MobileHeader React

Có thể dùng ví dụ này làm hướng refactor, tùy chỉnh theo codebase hiện tại:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="mobile-header">
        <div className="mobile-header-inner">
          <Link href="/" className="mobile-header-logo" aria-label="Go to homepage">
            <span>CafeMaps</span>
          </Link>

          <div className="mobile-header-actions">
            <button
              type="button"
              className="mobile-menu-button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-menu-panel" aria-label="Mobile navigation">
            <Link href="/" onClick={() => setOpen(false)}>
              Trang chủ
            </Link>
            <Link href="/cafes" onClick={() => setOpen(false)}>
              Khám phá quán cafe
            </Link>
            <Link href="/saved" onClick={() => setOpen(false)}>
              Đã lưu
            </Link>
            <Link href="/contribute" onClick={() => setOpen(false)}>
              Đóng góp quán
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
```

CSS cho menu:

```css
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  padding-top: calc(72px + env(safe-area-inset-top, 0px));
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  background: var(--app-bg);
}

.mobile-menu-panel {
  display: grid;
  gap: 8px;
}

.mobile-menu-panel a {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.64);
  border: 1px solid var(--app-border);
  color: #3f2f1f;
  font-weight: 600;
  text-decoration: none;
}
```

Yêu cầu:

- Menu overlay phải có `background: var(--app-bg)`.
- Không dùng overlay trong suốt hoàn toàn.
- Menu overlay cần padding-bottom theo `safe-area-inset-bottom`.
- Khi mở menu, không để content phía sau lộ qua khu vực URL bar.

---

## Nếu đang dùng Tailwind

Có thể giữ phần CSS global cho safe area và guard, còn layout/header dùng Tailwind.

Ví dụ:

```tsx
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-[80] border-b border-[var(--app-border)] bg-[var(--app-header-bg)] pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        <a href="/" className="font-bold text-[#3f2f1f]">
          CafeMaps
        </a>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-white/70"
          aria-label="Open menu"
        >
          <span className="sr-only">Open menu</span>
          ☰
        </button>
      </div>
    </header>
  );
}
```

Global CSS vẫn nên giữ:

```css
:root {
  --app-bg: #fbf7ec;
  --app-header-bg: rgba(251, 247, 236, 0.96);
  --app-border: rgba(83, 63, 35, 0.12);
  --ios-bottom-guard-height: 96px;
}

html,
body,
#__next,
#root {
  background: var(--app-bg);
}

.app-main {
  padding-bottom: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
}

.ios-bottom-browser-guard {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--ios-bottom-guard-height) + env(safe-area-inset-bottom, 0px));
  background: var(--app-bg);
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

---

## Những chỗ cần kiểm tra trong code hiện tại

Hãy tìm và kiểm tra các điểm sau:

### 1. Có bottom nav cũ không?

Nếu còn bottom nav cũ, hãy remove hoặc disable hoàn toàn trên mobile.

Tìm các component có tên tương tự:

- `BottomNavigation`
- `BottomTabBar`
- `MobileNav`
- `TabBar`
- `FooterNav`
- `MobileBottomMenu`

Mục tiêu: không render bottom menu cũ nữa.

---

### 2. Có section nào nằm sát bottom không?

Tìm các section có:

```css
position: fixed;
bottom: 0;
```

hoặc Tailwind:

```tsx
fixed bottom-0
sticky bottom-0
```

Nếu có, cần chỉnh lại để không xung đột với iOS URL bar.

Các phần như floating CTA, filter bar, action bar cần có:

```css
bottom: calc(16px + env(safe-area-inset-bottom, 0px));
```

hoặc nếu muốn tránh URL bar hoàn toàn, nên đặt cao hơn và có background riêng.

---

### 3. Có dùng 100vh không?

Tìm toàn project:

```txt
100vh
h-screen
min-h-screen
```

Với Tailwind:

- `h-screen` tương đương `height: 100vh`
- `min-h-screen` tương đương `min-height: 100vh`

Trên mobile Safari, cân nhắc thay bằng:

```tsx
min-h-[100svh]
h-[100dvh]
```

hoặc class custom.

---

### 4. Có background transparent không?

Kiểm tra:

- `body`
- root layout
- page wrapper
- main
- header
- menu overlay

Không để các lớp chính bị transparent nếu phía sau có content dễ lộ.

---

### 5. Có border/line/text sát đáy viewport không?

Nếu có line hoặc text bị lộ dưới URL bar, thêm spacing hoặc đảm bảo guard che phủ.

---

## Acceptance Criteria

Sau khi refactor, cần đạt các tiêu chí sau:

1. Trên iPhone Safari thật, khi mới load trang, không thấy content lộ dưới URL bar.
2. Khi scroll xuống làm URL bar thu nhỏ, UI không bị nhấp nháy hoặc lộ content bên dưới.
3. Khi scroll ngược lên làm URL bar mở rộng lại, phía dưới URL bar vẫn là nền sạch.
4. Không còn bottom navigation cũ.
5. Header mobile mới hiển thị đúng, rõ ràng, không che content.
6. Hamburger menu mở/đóng ổn định.
7. Menu overlay có background solid.
8. Không có khoảng trắng bất thường trên desktop.
9. Không có content quan trọng bị guard che.
10. Không dùng JS hack để điều khiển Safari URL bar.

---

## Test checklist

Hãy test trên thiết bị thật nếu có thể:

### iPhone Safari

- Mở trang lần đầu.
- Scroll xuống chậm.
- Scroll xuống nhanh.
- Scroll lên lại đầu trang.
- Chạm vào URL bar.
- Đóng/mở hamburger menu.
- Chuyển route rồi quay lại.
- Xoay màn hình nếu layout có hỗ trợ landscape.

### Chrome mobile responsive mode

- Chỉ dùng để kiểm tra layout cơ bản.
- Không coi Chrome responsive mode là kết quả cuối cùng cho lỗi iOS Safari URL bar.

### Android Chrome

- Kiểm tra không bị dư padding-bottom quá lớn.
- Kiểm tra hamburger menu vẫn ổn.

### Desktop

- Guard phải ẩn ở desktop.
- Header desktop nếu có không bị ảnh hưởng.

---

## Gợi ý hướng xử lý cuối cùng

Tốt nhất hãy xử lý theo thứ tự:

1. Thêm/cập nhật meta viewport `viewport-fit=cover`.
2. Set background solid cho `html`, `body`, root app.
3. Refactor app shell dùng `min-height: 100svh`.
4. Remove bottom navigation cũ.
5. Thêm mobile header mới với hamburger.
6. Thêm `ios-bottom-browser-guard` ở layout cấp cao.
7. Thêm `padding-bottom` cho `main`.
8. Kiểm tra tất cả `100vh`, `h-screen`, `min-h-screen`.
9. Test trên iPhone Safari thật.
10. Điều chỉnh `--ios-bottom-guard-height` nếu còn thấy lộ content.

---

## Lưu ý quan trọng cho agent

Không nên chỉ sửa header. Vấn đề chính nằm ở mobile viewport và vùng đáy màn hình trên iOS Safari.

Hãy xử lý ở cấp global layout:

- `global.css`
- `AppLayout`
- `RootLayout`
- mobile header component
- mobile menu overlay

Không xử lý từng page riêng lẻ vì lỗi sẽ quay lại khi chuyển route hoặc mở trang khác.

Nếu cần chọn giữa blur và solid background, ưu tiên solid background để giao diện trên iOS Safari trông sạch và ít lỗi hơn.

Mục tiêu thị giác là: khi URL bar của iOS Safari co/giãn, người dùng chỉ thấy một nền sạch giống CellphoneS, không thấy nội dung website bị lộ phía sau.
