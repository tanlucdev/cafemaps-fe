"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Bookmark,
  CheckCircle2,
  ClipboardList,
  Coffee,
  Compass,
  Edit3,
  Heart,
  History,
  Leaf,
  MapPin,
  MessageCircle,
  PlusCircle,
  Sparkles,
  UserRound,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { getAuthUser, type AuthUser } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { Cafe, SavedCafeEntry } from "@/types/cafe"

interface ProfilePageClientProps {
  locale: string
  initialIsLoggedIn: boolean
  initialSavedEntries: SavedCafeEntry[]
}

type ProfileTab = "saved" | "quiz" | "submitted" | "activity"

type Copy = typeof copyByLocale.en

const copyByLocale = {
  en: {
    eyebrow: "Cafe Maps profile",
    titleFallback: "Cafe Explorer",
    subtitle: "Coffee explorer in Ho Chi Minh City",
    editProfile: "Edit profile",
    signIn: "Sign in",
    savedCafes: "Saved cafés",
    quizResults: "Quiz results",
    contributions: "Contributions",
    reviews: "Reviews",
    profileInfo: "Profile info",
    memberSince: "Member since",
    location: "Location",
    account: "Account",
    preferences: "Café vibes",
    quickActions: "Quick actions",
    exploreCafes: "Explore cafés",
    takeQuiz: "Take the quiz",
    submitCafe: "Submit a café",
    savedTab: "Saved cafés",
    quizTab: "Quiz results",
    submittedTab: "Submitted cafés",
    activityTab: "Recent activity",
    view: "View",
    noSavedTitle: "No saved cafés yet.",
    noSavedBody: "Start exploring and save your favorites.",
    quizTitle: "Your vibe: Quiet Nature Café",
    quizBody: "You seem to like calm corners, warm light, leafy tables, and enough quiet for deep work.",
    retakeQuiz: "Retake quiz",
    quizEmptyTitle: "Find your café vibe.",
    quizEmptyBody: "Take the quiz to get a simple recommendation style for your next café hunt.",
    submittedEmptyTitle: "No submitted cafés yet.",
    submittedEmptyBody: "Know a cozy hidden spot? Add it so other café lovers can find it too.",
    activityEmptyTitle: "No recent activity yet.",
    activityEmptyBody: "Saved cafés, quiz moments, and café submissions will show up here.",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    mockLabel: "Preview data",
  },
  vi: {
    eyebrow: "Hồ sơ Cafe Maps",
    titleFallback: "Cafe Explorer",
    subtitle: "Coffee explorer in Ho Chi Minh City",
    editProfile: "Sửa hồ sơ",
    signIn: "Đăng nhập",
    savedCafes: "Quán đã lưu",
    quizResults: "Kết quả quiz",
    contributions: "Đóng góp",
    reviews: "Reviews",
    profileInfo: "Thông tin cá nhân",
    memberSince: "Thành viên từ",
    location: "Khu vực",
    account: "Tài khoản",
    preferences: "Gu cà phê",
    quickActions: "Thao tác nhanh",
    exploreCafes: "Khám phá quán",
    takeQuiz: "Làm quiz",
    submitCafe: "Đóng góp quán",
    savedTab: "Quán đã lưu",
    quizTab: "Kết quả quiz",
    submittedTab: "Quán đã gửi",
    activityTab: "Hoạt động gần đây",
    view: "Xem",
    noSavedTitle: "Chưa lưu quán nào.",
    noSavedBody: "Bắt đầu khám phá và lưu lại những quán bạn thích.",
    quizTitle: "Gu của bạn: Quiet Nature Café",
    quizBody: "Bạn có vẻ thích góc ngồi yên tĩnh, ánh sáng ấm, nhiều cây xanh và đủ riêng tư để tập trung.",
    retakeQuiz: "Làm lại quiz",
    quizEmptyTitle: "Tìm gu cà phê của bạn.",
    quizEmptyBody: "Làm quiz để Cafe Maps gợi ý vibe phù hợp cho lần đi cà phê tiếp theo.",
    submittedEmptyTitle: "Chưa gửi quán nào.",
    submittedEmptyBody: "Biết một quán ẩn mình thật ấm? Gửi lên để người yêu cà phê khác cùng tìm thấy.",
    activityEmptyTitle: "Chưa có hoạt động gần đây.",
    activityEmptyBody: "Quán đã lưu, quiz và đóng góp của bạn sẽ xuất hiện ở đây.",
    pending: "Đang duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
    mockLabel: "Dữ liệu preview",
  },
}

const vibeTags = ["Quiet corners", "Garden cafés", "Specialty coffee", "Work friendly"]

interface SubmittedCafePreview {
  name: string
  area: string
  status: "pending" | "approved" | "rejected"
}

interface ActivityPreview {
  icon: typeof Bookmark
  title: string
  time: string
}

export default function ProfilePageClient({
  locale,
  initialIsLoggedIn,
  initialSavedEntries,
}: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("saved")
  const [user, setUser] = useState<AuthUser | null>(null)
  const copy = locale === "vi" ? copyByLocale.vi : copyByLocale.en
  const displayName = user?.displayName || copy.titleFallback
  const email = user?.email ?? (initialIsLoggedIn ? "coffee@cafemaps.vn" : "guest@cafemaps.vn")
  const initials = getInitials(displayName, email)
  const savedCafes = useMemo(
    () => initialSavedEntries.map((entry) => entry.cafe).slice(0, 4),
    [initialSavedEntries]
  )
  const hasPreviewProfileData = !user && !initialIsLoggedIn

  useEffect(() => {
    setUser(getAuthUser())
  }, [])

  const stats = [
    { label: copy.savedCafes, value: initialSavedEntries.length, icon: Bookmark },
    { label: copy.quizResults, value: 0, icon: Sparkles },
    { label: copy.contributions, value: 0, icon: PlusCircle },
    { label: copy.reviews, value: 0, icon: MessageCircle },
  ]

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-4 pt-24 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ProfileHeader
          copy={copy}
          displayName={displayName}
          email={email}
          initials={initials}
          isLoggedIn={Boolean(user || initialIsLoggedIn)}
          hasPreviewProfileData={hasPreviewProfileData}
        />

        <ProfileStats stats={stats} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <ProfileInfoCard copy={copy} email={email} isLoggedIn={Boolean(user || initialIsLoggedIn)} />
            <PreferencesCard copy={copy} />
            <QuickActions copy={copy} />
          </aside>

          <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-sm)] sm:p-4">
            <ProfileTabs activeTab={activeTab} copy={copy} onChange={setActiveTab} />
            <div className="mt-4">
              {activeTab === "saved" && <SavedCafeList cafes={savedCafes} copy={copy} />}
              {activeTab === "quiz" && <QuizResultCard copy={copy} hasResult={false} />}
              {activeTab === "submitted" && (
                <SubmittedCafeList copy={copy} submissions={[]} />
              )}
              {activeTab === "activity" && <RecentActivity copy={copy} activities={[]} />}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function ProfileHeader({
  copy,
  displayName,
  email,
  initials,
  isLoggedIn,
  hasPreviewProfileData,
}: {
  copy: Copy
  displayName: string
  email: string
  initials: string
  isLoggedIn: boolean
  hasPreviewProfileData: boolean
}) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[#fffaf2] p-5 shadow-[var(--shadow-sm)] dark:bg-[var(--card)] sm:p-7">
      <div className="absolute top-5 right-5 hidden h-24 w-24 rounded-full border border-dashed border-[#d9b47d] opacity-50 sm:block" aria-hidden="true" />
      <div className="absolute right-20 bottom-6 hidden h-10 w-20 rotate-[-12deg] rounded-full border border-[#e6c89f] opacity-45 lg:block" aria-hidden="true" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-[26px] bg-[var(--accent)] text-2xl font-black text-white shadow-[0_14px_30px_rgba(200,132,42,0.22)]">
            {initials}
          </div>
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#ead8bd] bg-white/70 px-3 py-1 text-xs font-bold text-[#875200] dark:border-white/10 dark:bg-white/5 dark:text-[#f0b869]">
              <Coffee size={13} />
              {copy.eyebrow}
            </div>
            <h1 className="font-display text-3xl font-black leading-tight text-[var(--foreground)] sm:text-4xl">
              {displayName}
            </h1>
            <p className="mt-1 text-sm font-medium text-[var(--foreground-muted)]">{email}</p>
            <p className="mt-2 max-w-xl text-sm text-[var(--foreground-muted)]">{copy.subtitle}</p>
            {hasPreviewProfileData && (
              <p className="mt-2 text-xs font-semibold text-[#9a6a26]">{copy.mockLabel}</p>
            )}
          </div>
        </div>

        {isLoggedIn ? (
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(200,132,42,0.22)] transition hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
          >
            <Edit3 size={16} />
            {copy.editProfile}
          </button>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(200,132,42,0.22)] transition hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
          >
            <UserRound size={16} />
            {copy.signIn}
          </Link>
        )}
      </div>
    </section>
  )
}

function ProfileStats({
  stats,
}: {
  stats: Array<{ label: string; value: number; icon: typeof Bookmark }>
}) {
  return (
    <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]"
        >
          <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
            <Icon size={18} />
          </div>
          <p className="text-2xl font-black leading-none text-[var(--foreground)]">{value}</p>
          <p className="mt-1 text-xs font-bold text-[var(--foreground-muted)]">{label}</p>
        </div>
      ))}
    </section>
  )
}

function ProfileInfoCard({
  copy,
  email,
  isLoggedIn,
}: {
  copy: Copy
  email: string
  isLoggedIn: boolean
}) {
  const rows = [
    { icon: UserRound, label: copy.account, value: isLoggedIn ? email : "Guest preview" },
    { icon: MapPin, label: copy.location, value: "Ho Chi Minh City" },
    { icon: Coffee, label: copy.memberSince, value: "2026" },
  ]

  return (
    <Panel title={copy.profileInfo} icon={ClipboardList}>
      <div className="space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--background-secondary)] text-[#875200] dark:text-[#f0b869]">
              <Icon size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--foreground-muted)]">{label}</p>
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function PreferencesCard({ copy }: { copy: Copy }) {
  return (
    <Panel title={copy.preferences} icon={Leaf}>
      <div className="flex flex-wrap gap-2">
        {vibeTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#e6d2b4] bg-[#fff8ee] px-3 py-1.5 text-xs font-bold text-[#6c4a22] dark:border-white/10 dark:bg-white/5 dark:text-[#ead8bd]"
          >
            {tag}
          </span>
        ))}
      </div>
    </Panel>
  )
}

function QuickActions({ copy }: { copy: Copy }) {
  const actions = [
    { href: "/search", label: copy.exploreCafes, icon: Compass, primary: true },
    { href: "/quiz", label: copy.takeQuiz, icon: Sparkles },
    { href: "/contribute", label: copy.submitCafe, icon: PlusCircle },
  ]

  return (
    <Panel title={copy.quickActions} icon={Coffee}>
      <div className="grid gap-2">
        {actions.map(({ href, label, icon: Icon, primary }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30",
              primary
                ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                : "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </Panel>
  )
}

function ProfileTabs({
  activeTab,
  copy,
  onChange,
}: {
  activeTab: ProfileTab
  copy: Copy
  onChange: (tab: ProfileTab) => void
}) {
  const tabs: Array<{ id: ProfileTab; label: string; icon: typeof Bookmark }> = [
    { id: "saved", label: copy.savedTab, icon: Bookmark },
    { id: "quiz", label: copy.quizTab, icon: Sparkles },
    { id: "submitted", label: copy.submittedTab, icon: PlusCircle },
    { id: "activity", label: copy.activityTab, icon: History },
  ]

  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      className="flex gap-2 overflow-x-auto rounded-3xl bg-[var(--background-secondary)] p-1"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30",
              isActive
                ? "bg-[var(--card)] text-[var(--accent)] shadow-[var(--shadow-sm)]"
                : "text-[var(--foreground-muted)] hover:bg-white/45 hover:text-[var(--foreground)] dark:hover:bg-white/5"
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

function SavedCafeList({ cafes, copy }: { cafes: Cafe[]; copy: Copy }) {
  if (cafes.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={copy.noSavedTitle}
        body={copy.noSavedBody}
        actionHref="/search"
        actionLabel={copy.exploreCafes}
      />
    )
  }

  return (
    <div className="grid gap-3">
      {cafes.map((cafe) => (
        <article
          key={cafe.id}
          className="grid gap-3 rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-3 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)] dark:bg-white/5 sm:grid-cols-[116px_minmax(0,1fr)_auto] sm:items-center"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--background-secondary)] sm:aspect-auto sm:h-24">
            {cafe.coverImage ? (
              <Image
                src={cafe.coverImage}
                alt={cafe.name}
                fill
                sizes="(max-width: 640px) 100vw, 116px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--accent)]">
                <Coffee size={24} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-black text-[var(--foreground)]">{cafe.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[var(--foreground-muted)]">
              <MapPin size={14} />
              {cafe.district || cafe.address || "Ho Chi Minh City"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cafe.vibes.slice(0, 3).map((vibe) => (
                <span
                  key={vibe}
                  className="rounded-full bg-[var(--accent-light)] px-2.5 py-1 text-xs font-bold text-[#875200] dark:text-[#f0b869]"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={`/cafe/${cafe.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--background-secondary)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
          >
            {copy.view}
          </Link>
        </article>
      ))}
    </div>
  )
}

function QuizResultCard({ copy, hasResult }: { copy: Copy; hasResult: boolean }) {
  if (!hasResult) {
    return (
      <EmptyState
        icon={Sparkles}
        title={copy.quizEmptyTitle}
        body={copy.quizEmptyBody}
        actionHref="/quiz"
        actionLabel={copy.takeQuiz}
      />
    )
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-5 dark:bg-white/5">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
        <Sparkles size={22} />
      </div>
      <h2 className="text-xl font-black text-[var(--foreground)]">{copy.quizTitle}</h2>
      <p className="mt-2 max-w-xl text-sm text-[var(--foreground-muted)]">{copy.quizBody}</p>
      <Link
        href="/quiz"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
      >
        <Sparkles size={15} />
        {copy.retakeQuiz}
      </Link>
    </div>
  )
}

function SubmittedCafeList({
  copy,
  submissions,
}: {
  copy: Copy
  submissions: SubmittedCafePreview[]
}) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={PlusCircle}
        title={copy.submittedEmptyTitle}
        body={copy.submittedEmptyBody}
        actionHref="/contribute"
        actionLabel={copy.submitCafe}
      />
    )
  }

  return (
    <div className="grid gap-3">
      {submissions.map((submission) => (
        <div
          key={submission.name}
          className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-4 dark:bg-white/5"
        >
          <div>
            <h2 className="font-black text-[var(--foreground)]">{submission.name}</h2>
            <p className="text-sm text-[var(--foreground-muted)]">{submission.area}</p>
          </div>
          <StatusBadge status={submission.status} copy={copy} />
        </div>
      ))}
    </div>
  )
}

function RecentActivity({
  copy,
  activities,
}: {
  copy: Copy
  activities: ActivityPreview[]
}) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={History}
        title={copy.activityEmptyTitle}
        body={copy.activityEmptyBody}
      />
    )
  }

  return (
    <div className="space-y-1">
      {activities.map(({ icon: Icon, title, time }, index) => (
        <div key={title} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3">
          <div className="flex flex-col items-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
              <Icon size={16} />
            </div>
            {index < activities.length - 1 && <div className="h-8 border-l border-dashed border-[var(--border)]" />}
          </div>
          <div className="pb-5">
            <p className="font-bold text-[var(--foreground)]">{title}</p>
            <p className="text-sm text-[var(--foreground-muted)]">{time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  icon: typeof Coffee
  title: string
  body: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-[#dfc9aa] bg-[#fffaf2] px-5 py-10 text-center dark:border-white/15 dark:bg-white/5">
      <div className="mb-4 flex size-14 items-center justify-center rounded-3xl bg-[var(--accent-light)] text-[var(--accent)]">
        <Icon size={24} />
      </div>
      <h2 className="text-lg font-black text-[var(--foreground)]">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--foreground-muted)]">{body}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-[var(--accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof Coffee
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[26px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
          <Icon size={17} />
        </div>
        <h2 className="font-black text-[var(--foreground)]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function StatusBadge({ status, copy }: { status: string; copy: Copy }) {
  const statusCopy =
    status === "approved" ? copy.approved : status === "rejected" ? copy.rejected : copy.pending

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-light)] px-3 py-1.5 text-xs font-black text-[#875200] dark:text-[#f0b869]">
      <CheckCircle2 size={13} />
      {statusCopy}
    </span>
  )
}

function getInitials(displayName: string, email: string) {
  const source = displayName.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}
