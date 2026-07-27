"use client";

import Image from "next/image";
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
      className="glass-effect overflow-hidden scroll-mt-28 rounded-2xl border border-outline-variant/10 dark:border-outline-variant/15"
    >
      <div className="relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6 border-b border-outline-variant/10 dark:border-outline-variant/15">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/moon-calendar-header-garden-moon.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            className="object-cover object-[center_60%] opacity-[0.06] dark:opacity-[0.08] grayscale transition-opacity duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20 dark:from-background/98 dark:via-background/70 dark:to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/10 dark:from-background/95 dark:via-transparent dark:to-background/20" />
        </div>

        {/* Header content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim">
              Инструменты
            </span>
            <Link
              href="/calendar"
              className="font-label text-[10px] uppercase tracking-wide text-primary hover:text-primary-container transition-colors duration-200 flex items-center gap-1"
            >
              <span>Весь календарь</span>
              <span className="text-xs">→</span>
            </Link>
          </div>
          <h2 className="font-headline text-lg font-bold text-on-surface sm:text-xl">
            Лунный календарь
          </h2>
          <p className="mt-1.5 text-xs text-on-surface-variant opacity-90 leading-relaxed max-w-xl">
            Выберите культуру — благоприятные дни по лунной матрице (посадка, полив, уход).
          </p>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="p-4 sm:p-5">
        <MoonCalendar
          entries={entries}
          variant="compact"
          initialCultureTagKey=""
        />
      </div>
    </div>
  );
}

