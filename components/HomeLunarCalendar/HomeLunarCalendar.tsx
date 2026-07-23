"use client";

import Link from "next/link";

import { MoonCalendar } from "@/components/CalendarPage";
import type { MoonCalendarEntry } from "@/lib/calendar-sections";

type HomeLunarCalendarProps = {
  entries: MoonCalendarEntry[];
};

export function HomeLunarCalendar({ entries }: HomeLunarCalendarProps) {
  return (
    <div
      id="lunar-calendar"
      className="glass-effect scroll-mt-28 rounded-xl border border-outline-variant/10 p-3.5 dark:border-outline-variant/15 sm:p-4"
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 className="font-headline text-lg text-on-surface sm:text-xl">
          Лунный календарь
        </h2>
        <Link
          href="/calendar"
          className="font-label text-[10px] uppercase tracking-wide text-primary-container hover:underline"
        >
          Весь
        </Link>
      </div>
      <p className="mb-3 text-xs text-on-surface-variant opacity-80 sm:text-sm">
        Благоприятные дни для посадки, полива, подкормки, урожая и ухода.
      </p>

      <MoonCalendar entries={entries} variant="compact" />
    </div>
  );
}
