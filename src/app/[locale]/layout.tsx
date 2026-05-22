import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { routing } from "@/i18n/routing"
import LenisProvider from "@/components/providers/LenisProvider"
import QueryProvider from "@/components/providers/QueryProvider"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryProvider>
          <LenisProvider>
            {children}
            <Toaster richColors position="top-right" />
          </LenisProvider>
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
