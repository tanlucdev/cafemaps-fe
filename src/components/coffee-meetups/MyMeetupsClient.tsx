"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getMyCoffeeMeetups, type CoffeeMeetup } from "@/apis/coffee-meetups";
import MeetupCard from "./MeetupCard";

type Data = {
  organized: CoffeeMeetup[];
  joined: CoffeeMeetup[];
  pending: CoffeeMeetup[];
  archived: CoffeeMeetup[];
};

export default function MyMeetupsClient() {
  const t = useTranslations("coffeeMeetups");
  const [data, setData] = useState<Data>({ organized: [], joined: [], pending: [], archived: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    getMyCoffeeMeetups()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : t("errors.load")));
  }, [t]);

  const sections: Array<[keyof Data, string]> = [
    ["organized", t("mine.organized")],
    ["joined", t("mine.joined")],
    ["pending", t("mine.pending")],
    ["archived", t("mine.archived")],
  ];

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-[var(--foreground)]">{t("mine.title")}</h1>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-2xl bg-[#FCEDEA] p-3 text-sm font-bold text-[#C0392B]"
          >
            {error}
          </p>
        )}
        <div className="mt-5 grid gap-6">
          {sections.map(([key, title]) => (
            <section key={key}>
              <h2 className="mb-3 text-lg font-black">{title}</h2>
              {data[key].length ? (
                <div className="grid gap-3">
                  {data[key].map((meetup) => (
                    <MeetupCard key={`${key}-${meetup.id}`} meetup={meetup} />
                  ))}
                </div>
              ) : (
                <p className="rounded-[20px] border border-dashed border-[var(--border)] p-5 text-sm font-bold text-[var(--foreground-muted)]">
                  {t("empty")}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
