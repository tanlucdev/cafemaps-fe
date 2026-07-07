import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import RouteAwareFooter from "@/components/layout/RouteAwareFooter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell flex min-h-[100svh] flex-col">
      <Header />
      <main className="app-main flex-1">{children}</main>
      <RouteAwareFooter />
      <MobileBottomNav />
    </div>
  );
}
