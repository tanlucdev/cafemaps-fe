import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileBottomNav from "@/components/layout/MobileBottomNav"
import PageTransition from "@/components/providers/PageTransition"

interface MainLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function MainLayout({ children, params }: MainLayoutProps) {
  const { locale } = await params

  return (
    <div className="app-shell flex min-h-[100svh] flex-col">
      <Header locale={locale} />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
