import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { blogPosts, getLocalizedBlogPost, getRelatedBlogPosts } from "@/lib/blog-data";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import { BlogCardMotion, BlogHeroMotion, BlogReveal } from "../BlogMotion";

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getLocalizedBlogPost(slug, locale);

  if (!post) {
    return {
      title: normalizeLocale(locale) === "vi" ? "Không tìm thấy bài viết" : "Post not found",
    };
  }

  return createLocalizedMetadata({
    locale,
    pathname: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.heroImage,
    imageAlt: post.heroImageAlt,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const post = getLocalizedBlogPost(slug, locale);

  if (!post) notFound();

  const relatedPosts = getRelatedBlogPosts(post.slug, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    datePublished: post.dateLabel,
    inLanguage: normalizedLocale === "vi" ? "vi-VN" : "en-US",
  };

  return (
    <main className="bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <BlogHeroMotion className="relative isolate overflow-hidden bg-[var(--background)] p-2 pt-[calc(74px+0.5rem)] sm:p-3 sm:pt-[calc(74px+0.75rem)] md:p-4 md:pt-[calc(74px+1rem)]">
          <div className="relative overflow-hidden rounded-[24px] border border-[#ffe3b7]/20 bg-[#4a2a16] shadow-[0_22px_62px_rgba(18,10,5,0.24),0_12px_42px_rgba(245,166,58,0.12)] sm:rounded-[30px] md:rounded-[36px]">
            <Image
              src={post.heroImage}
              alt={post.heroImageAlt}
              fill
              priority
              className="object-cover brightness-[0.9] contrast-[1.02] saturate-[1.05]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,11,5,0.78)_0%,rgba(60,34,18,0.58)_46%,rgba(28,15,6,0.34)_100%)]" />
            <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-14 lg:py-16">
              <BlogReveal>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/28 bg-[#3a2112]/34 px-3.5 py-2 text-sm font-extrabold text-[#ffe7bd] transition hover:bg-white/14 hover:text-white"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  {normalizedLocale === "vi" ? "Về blog" : "Back to blog"}
                </Link>
                <div className="mt-7 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#ffe3b7]/28 bg-[#fff0d2]/14 px-3 py-1 text-xs font-extrabold text-[#ffe7bd]">
                    {post.category}
                  </span>
                  <span className="text-xs font-semibold text-[#fff0d4]/82">{post.dateLabel}</span>
                </div>
                <h1 className="font-system sm:font-lora mt-4 text-[40px] leading-[1.02] font-bold text-[#fff7e8] drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] sm:text-[56px] lg:text-[68px]">
                  {post.title}
                </h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 font-semibold text-[#fff0d4]/92 drop-shadow-[0_5px_18px_rgba(0,0,0,0.34)] sm:text-[17px] sm:leading-8">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#fff0d4]/86">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={15} aria-hidden="true" />
                    {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} aria-hidden="true" />
                    {post.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound size={15} aria-hidden="true" />
                    {post.author}
                  </span>
                </div>
              </BlogReveal>

              <BlogReveal
                delay={0.1}
                className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-[#ffe3b7]/22 shadow-[0_20px_54px_rgba(0,0,0,0.26)]"
              >
                <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 48vw, 100vw"
                />
              </BlogReveal>
            </div>
          </div>
        </BlogHeroMotion>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,760px)_320px] lg:px-8">
          <div>
            <BlogReveal>
              <p className="font-lora text-xl leading-9 text-[var(--foreground)] sm:text-2xl sm:leading-10">
                {post.intro}
              </p>
            </BlogReveal>

            <BlogReveal
              delay={0.06}
              className="font-lora my-8 rounded-[20px] border border-l-4 border-[#ead8bf]/80 border-l-[#c8842a] bg-[#fff8ed] px-5 py-4 text-xl leading-9 font-semibold text-[#5f3b1f] shadow-[0_14px_38px_rgba(91,58,29,0.06)] dark:bg-[#2a2825] dark:text-[#f0d7b4]"
            >
              {post.pullQuote}
            </BlogReveal>

            <div className="space-y-8">
              {post.sections.map((section, index) => (
                <BlogReveal key={section.heading} delay={index * 0.05}>
                  <h2 className="font-display text-2xl font-extrabold text-[var(--foreground)]">
                    {section.heading}
                  </h2>
                  <p className="mt-3 text-[16px] leading-8 text-[var(--foreground-muted)]">
                    {section.body}
                  </p>
                </BlogReveal>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BlogReveal className="rounded-[24px] border border-[#ead8bf]/80 bg-[#fff8ed] p-5 shadow-[0_16px_44px_rgba(91,58,29,0.06)] dark:border-white/10 dark:bg-[#2a2825]">
              <p className="text-xs font-extrabold tracking-[0.14em] text-[#a86d1e] uppercase">
                {normalizedLocale === "vi" ? "Ghi chú nhanh" : "Quick notes"}
              </p>
              <ul className="mt-4 space-y-3">
                {post.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-[var(--foreground-muted)]"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf2eb] text-[#496f4d]">
                      <Check size={13} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </BlogReveal>
          </aside>
        </div>
      </article>

      <section className="mx-auto max-w-7xl border-t border-[#ead8bf] px-4 py-10 sm:px-6 lg:px-8">
        <BlogReveal className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold text-[var(--foreground)]">
            {normalizedLocale === "vi" ? "Đọc tiếp" : "Read next"}
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--accent-hover)]"
          >
            {normalizedLocale === "vi" ? "Tất cả bài viết" : "All posts"}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </BlogReveal>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {relatedPosts.map((relatedPost, index) => (
            <BlogCardMotion
              key={relatedPost.slug}
              index={index}
              className="overflow-hidden rounded-[24px] border border-[#ead8bf]/80 bg-[#fff8ed] transition hover:shadow-[0_16px_38px_rgba(91,58,29,0.10)] dark:border-white/10 dark:bg-[#2a2825]"
            >
              <Link href={`/blog/${relatedPost.slug}`} className="group grid grid-cols-[120px_1fr]">
                <div className="relative min-h-[140px] overflow-hidden">
                  <Image
                    src={relatedPost.heroImage}
                    alt={relatedPost.heroImageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="120px"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#a86d1e] uppercase">
                    {relatedPost.category}
                  </p>
                  <h3 className="font-display mt-2 line-clamp-2 text-lg leading-tight font-extrabold text-[var(--foreground)]">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-[var(--foreground-muted)]">
                    {relatedPost.readTime}
                  </p>
                </div>
              </Link>
            </BlogCardMotion>
          ))}
        </div>
      </section>
    </main>
  );
}
