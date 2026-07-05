import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import RouteAwareFooter from "@/components/layout/RouteAwareFooter";
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const cookieStore = await cookies();
  const initialIsLoggedIn = cookieStore.has(AUTH_COOKIE_KEYS.accessToken);

  return (
    <div className="app-shell flex min-h-[100svh] flex-col">
      <Header initialIsLoggedIn={initialIsLoggedIn} />
      <main className="app-main flex-1">{children}</main>
      <RouteAwareFooter />
      <MobileBottomNav />
    </div>
  );
}
