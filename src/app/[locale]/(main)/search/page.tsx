import { redirect } from "next/navigation";
import { normalizeLocale } from "@/lib/metadata";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== undefined) query.set(key, value);
  }

  redirect(`/${normalizeLocale(locale)}${query.size ? `?${query}` : ""}`);
}
