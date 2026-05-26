import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell flex min-h-[100svh] flex-col">
      <Header />
      <main className="app-main flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
