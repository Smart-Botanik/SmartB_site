import Image from "next/image";
import Link from "next/link";

import { MoonCalendar } from "@/components/CalendarPage";
import { loadMoonEntries, type MoonCalendarEntry } from "@/lib/calendar-sections";

type HomeLunarCalendarProps = {
  entries?: MoonCalendarEntry[];
};

export async function HomeLunarCalendar({
  entries: passedEntries,
}: HomeLunarCalendarProps = {}) {
  const entries = passedEntries ?? (await loadMoonEntries());
  return (
    <div
      id="lunar-calendar"
      className="block-lunar-calendar glass-effect overflow-hidden scroll-mt-28 rounded-2xl border border-outline-variant/10 dark:border-outline-variant/15"
    >
      <div className="header-lunar-calendar section-header relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6 border-b border-outline-variant/10 dark:border-outline-variant/15">
        {/* Background Image Container */}
        <div className="header-lunar-calendar-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/moon-calendar-header-garden-moon.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            className="object-cover object-[center_60%] opacity-75 saturate-[1.15] dark:opacity-40 dark:saturate-100 dark:brightness-90 transition-all duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/40 to-transparent dark:from-background/95 dark:via-background/65 dark:to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent dark:from-background/90 dark:via-background/40 dark:to-transparent" />
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
          <div className="flex items-center gap-3 mt-1">
            <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden shadow-md ring-1 ring-white/10">
              <Image
                src="/lunar-calendar-section-logo.png"
                alt="Лунный календарь"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface sm:text-2xl">
                Лунный календарь
              </h2>
              <p className="mt-0.5 text-xs text-on-surface-variant opacity-90 leading-relaxed max-w-xl">
                Выберите культуру — благоприятные дни по лунной матрице (посадка, полив, уход).
              </p>
            </div>
          </div>
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

