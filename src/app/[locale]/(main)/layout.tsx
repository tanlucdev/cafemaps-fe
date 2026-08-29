import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PageTransition from "@/components/providers/PageTransition";
import RouteAwareFooter from "@/components/layout/RouteAwareFooter";
import DonateFloatingButton from "@/components/layout/DonateFloatingButton";
import { FeedbackCafeProvider } from "@/components/layout/FeedbackCafeContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell flex min-h-[100svh] flex-col">
      <Header />
      <FeedbackCafeProvider>
        <PageTransition>{children}</PageTransition>
        <RouteAwareFooter />
        <DonateFloatingButton />
      </FeedbackCafeProvider>
      <MobileBottomNav />
    </div>
  );
}
