import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import ContributeForm from "./ContributeForm"

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

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-6"
      style={{ background: "#F5EFE6", fontFamily: "Be Vietnam Pro, sans-serif" }}
    >
      <div className="max-w-165 mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-[26px] italic text-[#1C1209] leading-snug font-lora"
          >
            {t("heading")}
          </h1>
          <p className="text-[14px] text-[#9B8B73] mt-2">{t("subtitle")}</p>
        </div>

        <ContributeForm />
      </div>
    </div>
  )
}
