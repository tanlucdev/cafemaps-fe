import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PageTransition from "@/components/providers/PageTransition";
import RouteAwareFooter from "@/components/layout/RouteAwareFooter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell flex min-h-[100svh] flex-col">
      <Header />
      <PageTransition>{children}</PageTransition>
      <RouteAwareFooter />
      <MobileBottomNav />
    </div>
  );
}
