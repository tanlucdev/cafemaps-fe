import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import PageTransition from "@/components/providers/PageTransition"

interface MainLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function MainLayout({ children, params }: MainLayoutProps) {
  const { locale } = await params

  return (
    <>
      <Header locale={locale} />
      <PageTransition>{children}</PageTransition>
      <Footer locale={locale} />
    </>
  )
}
