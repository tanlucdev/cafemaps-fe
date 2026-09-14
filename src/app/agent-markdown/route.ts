import { getCafeBySlug } from "@/apis/cafes";
import { routing, type Locale } from "@/i18n/routing";
import { getLocalizedBlogPost } from "@/lib/blog-data";
import { getSiteUrl, normalizeLocale } from "@/lib/metadata";

const STATIC_PAGES: Record<string, { vi: string; en: string }> = {
  "/about": {
    vi: "Thông tin về Cafe Maps và cách bản đồ chọn quán hoạt động.",
    en: "About Cafe Maps and how the cafe discovery guide works.",
  },
  "/contribute": {
    vi: "Đóng góp thông tin quán cà phê cho Cafe Maps.",
    en: "Contribute cafe information to Cafe Maps.",
  },
  "/home2": {
    vi: "Trang khám phá quán cà phê của Cafe Maps.",
    en: "Cafe Maps cafe discovery page.",
  },
  "/login": {
    vi: "Đăng nhập Cafe Maps để quản lý quán đã lưu.",
    en: "Sign in to Cafe Maps to manage saved cafes.",
  },
  "/map": {
    vi: "Bản đồ các quán cà phê đã đi.",
    en: "Map of visited cafes.",
  },
  "/profile": {
    vi: "Trang cá nhân với quán đã lưu, kết quả quiz và đóng góp.",
    en: "Profile with saved cafes, quiz results, and contributions.",
  },
  "/quiz": {
    vi: "Quiz giúp chọn vibe quán cà phê phù hợp.",
    en: "A quiz for finding a cafe vibe that fits.",
  },
  "/register": {
    vi: "Tạo tài khoản Cafe Maps.",
    en: "Create a Cafe Maps account.",
  },
  "/saved": {
    vi: "Danh sách quán cà phê đã lưu.",
    en: "Saved cafe lists.",
  },
  "/search": {
    vi: "Tìm quán cà phê theo tên, khu vực, vibe và mục đích.",
    en: "Find cafes by name, area, vibe, and purpose.",
  },
};

function siteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

function localizedPath(locale: Locale, path = "") {
  return `/${locale}${path}`;
}

function homeMarkdown(locale: Locale) {
  const text =
    locale === "vi"
      ? "Cafe Maps giúp tìm quán cà phê tại TP.HCM theo khu vực, vibe, mục đích ghé quán và trạng thái mở cửa."
      : "Cafe Maps helps people find cafes in Ho Chi Minh City by area, vibe, purpose, and opening status.";
  const home = localizedPath(locale);

  return `# Cafe Maps

${text}

## Khi nào nên dùng

- Tìm quán để làm việc, học tập, hẹn hò, đi một mình hoặc chụp ảnh.
- Lọc quán theo quận, phong cách, mức giá và trạng thái mở cửa.
- Đọc blog để lập kế hoạch cho một buổi cà phê.

## Đi tiếp

- [Khám phá quán](${siteUrl(home)})
- [Quiz chọn quán](${siteUrl(localizedPath(locale, "/quiz"))})
- [Blog](${siteUrl(localizedPath(locale, "/blog"))})
- [Sitemap](${siteUrl("/sitemap.xml")})
- [Hướng dẫn tác nhân](${siteUrl("/llms.txt")})
`;
}

function pageMarkdown(locale: Locale, path: string, description: string) {
  return `# ${description}

Cafe Maps: ${siteUrl(localizedPath(locale, path))}

- [Trang chủ](${siteUrl(localizedPath(locale))})
- [Sitemap](${siteUrl("/sitemap.xml")})
- [Hướng dẫn tác nhân](${siteUrl("/llms.txt")})
`;
}

function blogMarkdown(locale: Locale, path: string) {
  if (path === "/blog") {
    const posts = ["/blog/mot-buoi-sang-cham-o-thao-dien", "/blog/chon-quan-lam-viec-khong-bi-met"]
      .map((postPath) => `- [${postPath.slice(6)}](${siteUrl(localizedPath(locale, postPath))})`)
      .join("\n");

    return `# Cafe Maps Blog

${locale === "vi" ? "Câu chuyện và cẩm nang chọn quán cà phê tại TP.HCM." : "Stories and guides for choosing cafes in Ho Chi Minh City."}

${posts}
`;
  }

  const post = getLocalizedBlogPost(path.slice("/blog/".length), locale);
  if (!post) return null;

  return `# ${post.title}

${post.excerpt}

${post.intro}

## ${post.sections[0]?.heading ?? "Gợi ý"}

${post.sections[0]?.body ?? ""}

- [Về blog](${siteUrl(localizedPath(locale, "/blog"))})
- [Trang chủ](${siteUrl(localizedPath(locale))})
`;
}

async function getMarkdown(pathname: string) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (normalizedPath === "/") return homeMarkdown("vi");

  const segments = normalizedPath.split("/").filter(Boolean);
  const hasLocale = routing.locales.includes(segments[0] as Locale);
  const typedLocale = hasLocale ? normalizeLocale(segments[0]) : "vi";
  const path = hasLocale ? `/${segments.slice(1).join("/")}` || "/" : normalizedPath;
  if (path === "/") return homeMarkdown(typedLocale);
  if (path === "/blog" || path.startsWith("/blog/")) return blogMarkdown(typedLocale, path);

  const staticPage = STATIC_PAGES[path];
  if (staticPage) return pageMarkdown(typedLocale, path, staticPage[typedLocale]);

  if (path.startsWith("/cafe/") && path.split("/").length === 3) {
    const cafe = await getCafeBySlug(path.slice("/cafe/".length), typedLocale);
    if (!cafe) return null;

    return `# ${cafe.name}

${cafe.oneLiner ?? cafe.description ?? ""}

- Khu vực: ${cafe.district ?? "TP.HCM"}
- Địa chỉ: ${cafe.address ?? "Chưa công bố"}
- [Mở trang quán](${siteUrl(localizedPath(typedLocale, path))})
- [Sitemap](${siteUrl("/sitemap.xml")})
`;
  }

  return null;
}

export async function GET(request: Request) {
  const pathname =
    request.headers.get("x-agent-path") ?? new URL(request.url).searchParams.get("path") ?? "/";
  const markdown = await getMarkdown(pathname);
  const headers = {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept, Accept-Encoding",
  };

  if (!markdown) {
    return new Response(
      `# 404 - Không tìm thấy trang

- [Trang chủ](${siteUrl("/vi")})
- [Sitemap](${siteUrl("/sitemap.xml")})
- [Hướng dẫn tác nhân](${siteUrl("/llms.txt")})
`,
      { status: 404, headers },
    );
  }

  return new Response(markdown, { headers });
}
