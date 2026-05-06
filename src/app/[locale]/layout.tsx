import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { routing } from "@/i18n/routing"
import LenisProvider from "@/components/providers/LenisProvider"
import PageTransition from "@/components/providers/PageTransition"
import QueryProvider from "@/components/providers/QueryProvider"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryProvider>
          <LenisProvider>
            <Header locale={locale} />
            <PageTransition>{children}</PageTransition>
            <Footer locale={locale} />
          </LenisProvider>
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
