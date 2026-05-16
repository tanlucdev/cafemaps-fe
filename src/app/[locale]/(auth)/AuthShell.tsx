import Link from "next/link";
import { ChevronLeft, Coffee } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  locale: string;
  mode: "login" | "register";
  copy: {
    backHome: string;
    brand: string;
    footerLine: string;
    loginGreetingTitle: string;
    loginGreetingSub: string;
    registerGreetingTitle: string;
    registerGreetingSub: string;
    loginTab: string;
    registerTab: string;
    noAccount: string;
    hasAccount: string;
    switchToRegister: string;
    switchToLogin: string;
  };
}

function CupMark({ mode }: { mode: AuthShellProps["mode"] }) {
  const isRegister = mode === "register";

  return (
    <div className="relative mb-1 inline-block">
      <span className="steam-1 absolute bottom-[72%] left-[30%] h-3.5 w-1.5 rounded-full bg-[rgba(201,135,12,0.28)]" />
      <span className="steam-2 absolute bottom-[72%] left-1/2 h-3.5 w-1.5 rounded-full bg-[rgba(201,135,12,0.28)]" />
      <span className="steam-3 absolute bottom-[72%] left-[68%] h-3.5 w-1.5 rounded-full bg-[rgba(201,135,12,0.28)]" />
      <svg width="58" height="50" viewBox="0 0 60 52" fill="none" aria-hidden="true">
        <ellipse cx="30" cy="46" rx="22" ry="5" fill="#EDE4D6" />
        <path d="M10 20 Q11 40 30 42 Q49 40 50 20 Z" fill={isRegister ? "#C9870C" : "#A96E08"} />
        <ellipse cx="30" cy="20" rx="20" ry="5" fill={isRegister ? "#D99820" : "#C9870C"} />
        <ellipse cx="30" cy="20" rx="17" ry="4" fill="rgba(255,255,255,.16)" />
        <path
          d="M26 20 Q27 18.5 30 20.5 Q33 18.5 34 20 Q34 22.5 30 24 Q26 22.5 26 20 Z"
          fill="rgba(255,255,255,.35)"
          opacity={isRegister ? "1" : ".6"}
        />
        <path
          d="M50 26 Q58 26 58 33 Q58 40 50 40"
          stroke={isRegister ? "#C9870C" : "#A96E08"}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function AuthShell({ children, locale, mode, copy }: AuthShellProps) {
  const isLogin = mode === "login";
  const title = isLogin ? copy.loginGreetingTitle : copy.registerGreetingTitle;
  const subtitle = isLogin ? copy.loginGreetingSub : copy.registerGreetingSub;

  return (
    <main
      data-auth-page="true"
      className="flex min-h-[100dvh] flex-col bg-[#F5EFE6] bg-[radial-gradient(circle,rgba(201,135,12,0.09)_1.5px,transparent_1.5px)] bg-[length:22px_22px] px-6 py-[clamp(1.5rem,5vh,3.5rem)] text-[#1C1209] dark:bg-[#1E1C1A] dark:text-[#F0EBE3]"
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="mb-2 w-full max-w-[420px]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#9B8B73] transition-colors hover:text-[#1C1209] dark:text-[#B8AFA6] dark:hover:text-[#F0EBE3]"
          >
            <ChevronLeft size={14} />
            {copy.backHome}
          </Link>
        </div>

        <section className="w-full max-w-[420px] overflow-hidden rounded-[26px] border border-[#ECE4D6] bg-white shadow-[0_8px_40px_rgba(40,22,4,0.13)] max-[520px]:rounded-b-[26px] dark:border-[#3D3A36] dark:bg-[#2A2825]">
          <div className="relative overflow-hidden border-b border-[#ECE4D6] bg-[#EDE4D6] px-8 pt-5 pb-4 text-center max-[520px]:px-5 max-[520px]:pt-4 max-[520px]:pb-3.5 dark:border-[#3D3A36] dark:bg-[#242220]">
            <div className="absolute -top-8 -right-6 h-24 w-24 rounded-full bg-[rgba(201,135,12,0.08)]" />
            <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-full bg-[rgba(201,135,12,0.06)]" />

            <Link href={`/${locale}`} className="relative mb-2.5 inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#C9870C] text-white">
                <Coffee size={18} />
              </span>
              <span className="text-[15px] font-extrabold tracking-tight text-[#C9870C]">
                {copy.brand}
              </span>
            </Link>

            <div className="relative">
              <CupMark mode={mode} />
              <h1 className="font-lora mt-0.5 text-[18px] leading-snug font-semibold text-[#1C1209] italic max-[520px]:text-[17px] dark:text-[#F0EBE3]">
                &ldquo;{title}&rdquo;
              </h1>
              <p className="mt-1 text-[13px] leading-relaxed text-[#9B8B73] dark:text-[#B8AFA6]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="px-8 pt-[18px] pb-6 max-[520px]:px-5 max-[520px]:pt-4 max-[520px]:pb-5">
            <div className="mb-4 flex gap-0.5 rounded-full bg-[#EDE4D6] p-1 dark:bg-[#242220]">
              <Link
                href={`/${locale}/login`}
                className={`flex-1 rounded-full px-3.5 py-2 text-center text-[13.5px] font-bold transition-all ${
                  isLogin
                    ? "bg-white text-[#C9870C] shadow-[0_2px_10px_rgba(40,22,4,0.1)] dark:bg-[#2A2825]"
                    : "text-[#9B8B73] hover:text-[#1C1209] dark:text-[#B8AFA6] dark:hover:text-[#F0EBE3]"
                }`}
              >
                {copy.loginTab}
              </Link>
              <Link
                href={`/${locale}/register`}
                className={`flex-1 rounded-full px-3.5 py-2 text-center text-[13.5px] font-bold transition-all ${
                  !isLogin
                    ? "bg-white text-[#C9870C] shadow-[0_2px_10px_rgba(40,22,4,0.1)] dark:bg-[#2A2825]"
                    : "text-[#9B8B73] hover:text-[#1C1209] dark:text-[#B8AFA6] dark:hover:text-[#F0EBE3]"
                }`}
              >
                {copy.registerTab}
              </Link>
            </div>

            {children}

            <p className="mt-4 text-center text-[13px] text-[#9B8B73] dark:text-[#B8AFA6]">
              {isLogin ? copy.noAccount : copy.hasAccount}{" "}
              <Link
                href={isLogin ? `/${locale}/register` : `/${locale}/login`}
                className="font-bold text-[#C9870C] hover:underline"
              >
                {isLogin ? copy.switchToRegister : copy.switchToLogin}
              </Link>
            </p>
          </div>
        </section>

        <p className="mt-3 text-center text-xs text-[#9B8B73] dark:text-[#B8AFA6]">
          {copy.footerLine}
        </p>
      </div>
    </main>
  );
}
