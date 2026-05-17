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
      className="h-screen overflow-hidden flex flex-col pt-20 pb-4 px-6"
      style={{ background: "#F5EFE6", fontFamily: "Be Vietnam Pro, sans-serif" }}
    >
      <div className="max-w-lg mx-auto w-full flex flex-col min-h-0 flex-1">
        <div className="text-center mb-5">
          <h1 className="text-[22px] italic text-[#1C1209] leading-snug font-lora">
            {t("heading")}
          </h1>
          <p className="text-[13px] text-[#9B8B73] mt-1">{t("subtitle")}</p>
        </div>

        <ContributeForm />
      </div>
    </div>
  )
}
