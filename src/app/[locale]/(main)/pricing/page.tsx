import Image from "next/image";
import { getCafePassPricing } from "@/apis/payments";
import { ArrowLeft, ArrowRight, Check, Coffee, Heart, Images, Store, Ticket } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createLocalizedMetadata } from "@/lib/metadata";
import styles from "./pricing.module.css";

const copy = {
  vi: {
    title: "Bảng giá Cafe Maps",
    headline: "Khám phá nhiều hơn",
    headlineAccent: "cùng Cafe Maps",
    free: "Miễn phí",
    freeDescription: "Cho những buổi cà phê hằng ngày.",
    freeFeatures: [
      "Tìm, lọc quán và mở chỉ đường",
      "Lưu quán, tạo thư mục và làm quiz",
      "Đánh dấu và xem danh sách quán đã đi",
      "Xem ảnh và menu của 10 quán mỗi tháng",
      "Tạo hẹn cà phê và gửi lời mời",
    ],
    freeAction: "Khám phá quán",
    passDescription: "Cho người thích khám phá và hay rủ bạn đi cà phê.",
    passPeriod: "/ 30 ngày",
    standardPrice: "Giá thường",
    launchPrice: "Giá ưu đãi",
    launchSold: (sold: string, limit: string) => `${sold}/${limit} suất ưu đãi đã được mua`,
    priceUnavailable: "Chưa tải được giá",
    passFeatures: [
      "Xem thêm ảnh và menu không giới hạn",
    ],
    included: "Gồm mọi quyền lợi của gói Miễn phí",
    payment: "Thanh toán một lần, không tự gia hạn",
    preview: "Sắp mở bán",
    supportBody: "Tìm quán và xem lại những quán đã mở vẫn miễn phí. Pass dành cho lúc bạn muốn khám phá thêm ảnh và menu của nhiều quán hơn.",
    planned: "Dự kiến thêm bản đồ quán đã đi và bình chọn quán cho buổi hẹn.",
    backToCafe: "Quay lại quán đang xem",
    owner: "Bạn là chủ quán?",
    ownerDescription: "Dự kiến miễn phí gửi 3 hồ sơ quán mới mỗi tháng để duyệt. Cập nhật hồ sơ đã có vẫn miễn phí.",
    ownerAction: "Gửi hồ sơ quán",
  },
  en: {
    title: "Cafe Maps pricing",
    headline: "Explore more",
    headlineAccent: "with Cafe Maps",
    free: "Free",
    freeDescription: "For everyday coffee outings.",
    freeFeatures: [
      "Search, filter and get directions",
      "Save cafés, create folders and take the quiz",
      "Mark cafés as visited and view your list",
      "Explore photos and menus for 10 cafés a month",
      "Create coffee meetups and send invites",
    ],
    freeAction: "Explore cafés",
    passDescription: "For café explorers and the friends who bring everyone together.",
    passPeriod: "/ 30 days",
    standardPrice: "Regular price",
    launchPrice: "Launch price",
    launchSold: (sold: string, limit: string) => `${sold}/${limit} launch offers purchased`,
    priceUnavailable: "Pricing unavailable",
    passFeatures: [
      "Browse extended photos and menus without limits",
    ],
    included: "Everything in Free, plus",
    payment: "One-time payment, no automatic renewal",
    preview: "Coming soon",
    supportBody: "Finding cafés and reopening ones you’ve already viewed are free. Get the Pass when you want to explore more photos and menus.",
    planned: "Planned features include an interactive visited-café map and meetup polls.",
    backToCafe: "Back to the café",
    owner: "Own a café?",
    ownerDescription: "Proposed free allowance of 3 new café submissions a month. Updates to existing listings stay free.",
    ownerAction: "Submit a café",
  },
} as const;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cafe?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = copy[locale === "en" ? "en" : "vi"];

  return {
    ...createLocalizedMetadata({ locale, pathname: "/pricing", title: t.title, description: t.supportBody }),
    robots: { index: false, follow: true },
  };
}

export default async function PricingPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const english = locale === "en";
  const t = copy[english ? "en" : "vi"];
  const currency = new Intl.NumberFormat(english ? "en" : "vi", {
    style: "currency",
    currency: "VND",
    currencyDisplay: "narrowSymbol",
  });
  const [pricing, messages, { cafe }] = await Promise.all([
    getCafePassPricing().catch(() => null),
    getTranslations({ locale, namespace: "cafe" }),
    searchParams,
  ]);
  const cafeHref = typeof cafe === "string" && /^[\p{L}\p{N}-]{1,200}$/u.test(cafe)
    ? `/cafe/${encodeURIComponent(cafe)}`
    : null;
  const launch = pricing && pricing.launchRemaining > 0 ? pricing : null;
  const number = new Intl.NumberFormat(locale);
  const plans = [
    {
      name: t.free,
      description: t.freeDescription,
      price: currency.format(0),
      period: null,
      features: t.freeFeatures,
      icon: Coffee,
    },
    {
      name: "Cafe Maps Pass",
      description: t.passDescription,
      price: pricing ? currency.format(launch?.launchPrice ?? pricing.standardPrice) : t.priceUnavailable,
      period: pricing ? t.passPeriod : null,
      features: t.passFeatures,
      icon: Ticket,
    },
  ];

  return (
    <main className="bg-[var(--background)] px-4 pt-24 pb-12 text-[var(--foreground)] sm:px-6 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-[1040px]">
        <header className="mb-7 grid items-center gap-5 sm:mb-9 sm:grid-cols-[1fr_240px] sm:gap-8 lg:grid-cols-[1fr_338px]">
          <div>
            <p className="mb-3 text-sm font-bold text-[var(--focus)] dark:text-[var(--accent)]">{t.title}</p>
            <h1 className="text-[clamp(2.25rem,5.6vw,4.15rem)] leading-[1.07] font-extrabold tracking-[-0.045em]">
              {t.headline}{" "}
              <span className="block text-[var(--focus)] dark:text-[var(--accent)]">{t.headlineAccent}</span>
            </h1>
            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-[var(--foreground-muted)] sm:text-base">
              {t.supportBody}
            </p>
          </div>
          <div aria-hidden="true" className={`${styles.photos} relative mx-auto h-36 w-full max-w-[338px] sm:h-48 lg:h-52`}>
            <div className={`${styles.photo} absolute top-[10%] left-[5%] w-[57%] -rotate-[8deg] rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-1.5 pb-3 shadow-[var(--shadow-warm)]`}>
              <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-[var(--background-secondary)]">
                <Image src="/image/home-polaroid-1.jpg" alt="" fill sizes="175px" className="object-cover" />
              </div>
            </div>
            <div className={`${styles.photo} absolute top-[23%] right-[5%] w-[51%] rotate-[8deg] rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-1.5 pb-3 shadow-[var(--shadow-warm)]`}>
              <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-[var(--background-secondary)]">
                <Image src="/image/home-polaroid-2.jpg" alt="" fill sizes="165px" className="object-cover object-[47%_58%]" />
              </div>
            </div>
          </div>
        </header>

        <div className={`${styles.plans} grid gap-4 md:grid-cols-[0.9fr_1.1fr]`}>
          {plans.map((plan, index) => {
            const paid = index === 1;
            const Icon = plan.icon;
            return (
              <section
                key={plan.name}
                aria-labelledby={paid ? "pass-plan" : "free-plan"}
                className={`flex min-w-0 scroll-mt-24 flex-col rounded-[1.6rem] border px-5 pt-5 sm:px-7 sm:pt-7 ${paid
                  ? styles.ticket
                  : "border-[var(--border)] bg-[var(--surface-raised)]"}`}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-[0.7rem] ${paid ? "bg-[color-mix(in_srgb,var(--accent)_22%,var(--surface))]" : "bg-[var(--accent-light)]"} text-[var(--focus)] dark:text-[var(--accent)]`}>
                    <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
                  </span>
                  <h2 id={paid ? "pass-plan" : "free-plan"} className="scroll-mt-24 text-lg font-extrabold tracking-tight sm:text-xl">
                    {plan.name}
                  </h2>
                  {paid && (
                    <span className="ml-auto rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold">
                      {t.preview}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {plan.description}
                </p>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <strong className={paid && !pricing ? "text-xl font-bold" : "text-[clamp(2.45rem,5vw,3.85rem)] leading-tight font-extrabold tracking-[-0.06em]"}>
                    {paid && launch && <span className="sr-only">{t.launchPrice} </span>}
                    {plan.price}
                  </strong>
                  {paid && launch && (
                    <span className="text-base font-semibold text-[var(--foreground-muted)] sm:text-lg">
                      <span className="sr-only">{t.standardPrice} </span>
                      <s>{currency.format(launch.standardPrice)}</s>
                    </span>
                  )}
                  {plan.period && <span className="text-sm font-medium text-[var(--foreground-muted)]">{plan.period}</span>}
                </p>
                {paid && pricing && (
                  <p className="mt-2 text-sm font-semibold tabular-nums text-[var(--focus)] dark:text-[var(--accent)]">
                    {t.launchSold(number.format(pricing.launchLimit - pricing.launchRemaining), number.format(pricing.launchLimit))}
                  </p>
                )}
                <ul className="mt-4 flex-1 space-y-2.5 border-t border-[var(--border)] pt-4 text-sm leading-snug">
                  {paid && (
                    <li className="flex gap-2.5 font-bold">
                      <Check aria-hidden="true" size={17} className="shrink-0 text-[var(--focus)] dark:text-[var(--accent)]" />
                      {t.included}
                    </li>
                  )}
                  {plan.features.map((feature) => {
                    const FeatureIcon = paid ? Images : Check;
                    return (
                      <li key={feature} className="flex gap-2.5">
                        <FeatureIcon aria-hidden="true" size={17} className="shrink-0 text-[var(--focus)] dark:text-[var(--accent)]" />
                        {feature}
                      </li>
                    );
                  })}
                </ul>
                {paid && <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">{t.planned}</p>}
                {paid ? (
                  <div className={`${styles.stub} mx-[-1.25rem] mt-6 space-y-2 px-5 py-4 text-sm sm:mx-[-1.75rem] sm:px-7`}>
                    <p className="font-semibold">{t.payment}</p>
                    <p className="flex items-start gap-2 text-[var(--foreground-muted)]">
                      <Heart aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-[var(--focus)] dark:text-[var(--accent)]" />
                      {messages("paymentSupport")}
                    </p>
                    {cafeHref && (
                      <Link href={cafeHref} prefetch={false} className="inline-flex min-h-10 items-center gap-2 rounded-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]">
                        <ArrowLeft aria-hidden="true" size={15} />
                        {t.backToCafe}
                      </Link>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/"
                    className={`${styles.explore} mt-5 mb-4 flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3.5 py-2.5 text-sm font-bold hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]`}
                  >
                    {t.freeAction}
                    <ArrowRight aria-hidden="true" size={17} />
                  </Link>
                )}
              </section>
            );
          })}
        </div>

        <aside className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3">
          <div className="flex items-start gap-3">
            <Store aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-[var(--focus)] dark:text-[var(--accent)]" />
            <div>
              <h2 className="text-sm font-bold">{t.owner}</h2>
              <p className="mt-0.5 text-sm leading-relaxed text-[var(--foreground-muted)]">{t.ownerDescription}</p>
            </div>
          </div>
          <Link
            href="/contribute/owner"
            className="flex min-h-11 items-center gap-2 rounded-md pl-8 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            {t.ownerAction} <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </aside>
      </div>
    </main>
  );
}
