"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, MessageCircle, PlusCircle, Sparkles } from "lucide-react";
import { getAuthUser, type AuthUser } from "@/lib/auth-client";
import type { SavedCafeEntry } from "@/types/cafe";
import { copyByLocale } from "./constants";
import { ProfileContent } from "./ProfileContent";
import { ProfileHeader, ProfileStats } from "./ProfileHeader";
import { ProfileInfoCard, PreferencesCard, QuickActions } from "./ProfileSidebar";
import { getInitials } from "./helpers";
import type { ProfileStat, ProfileTab } from "./types";

interface ProfilePageClientProps {
  locale: string;
  initialIsLoggedIn: boolean;
  initialSavedEntries: SavedCafeEntry[];
}

export default function ProfilePageClient({
  locale,
  initialIsLoggedIn,
  initialSavedEntries,
}: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("saved");
  const [user, setUser] = useState<AuthUser | null>(null);
  const copy = locale === "vi" ? copyByLocale.vi : copyByLocale.en;
  const isLoggedIn = Boolean(user || initialIsLoggedIn);
  const displayName = user?.displayName || copy.titleFallback;
  const email = user?.email ?? (initialIsLoggedIn ? "coffee@cafemaps.vn" : "guest@cafemaps.vn");
  const initials = getInitials(displayName, email);
  const savedCafes = useMemo(
    () => initialSavedEntries.map((entry) => entry.cafe).slice(0, 4),
    [initialSavedEntries],
  );
  const stats: ProfileStat[] = [
    { label: copy.savedCafes, value: initialSavedEntries.length, icon: Bookmark },
    { label: copy.quizResults, value: 0, icon: Sparkles },
    { label: copy.contributions, value: 0, icon: PlusCircle },
    { label: copy.reviews, value: 0, icon: MessageCircle },
  ];

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ProfileHeader
          copy={copy}
          displayName={displayName}
          email={email}
          initials={initials}
          isLoggedIn={isLoggedIn}
          hasPreviewProfileData={!user && !initialIsLoggedIn}
        />

        <ProfileStats stats={stats} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <ProfileInfoCard copy={copy} email={email} isLoggedIn={isLoggedIn} />
            <PreferencesCard copy={copy} />
            <QuickActions copy={copy} />
          </aside>

          <ProfileContent
            activeTab={activeTab}
            cafes={savedCafes}
            copy={copy}
            onChange={setActiveTab}
          />
        </div>
      </div>
    </main>
  );
}
