import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { PlusCircle } from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contribute" })
  return {
    title: t("title"),
    description: t("subtitle"),
  }
}

export default async function ContributePage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contribute" })
  const tf = await getTranslations({ locale, namespace: "contribute.form" })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center mx-auto mb-4">
            <PlusCircle size={24} className="text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)] mb-2">
            {t("title")}
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm">
            {t("subtitle")}
          </p>
        </div>

        <form className="space-y-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          {(["name", "address", "district", "description"] as const).map(
            (field) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--foreground-muted)] block">
                  {tf(field)}
                </label>
                {field === "description" ? (
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                )}
              </div>
            )
          )}
          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity mt-2"
          >
            {tf("submit")}
          </button>
        </form>
      </div>
    </div>
  )
}
