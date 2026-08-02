import Image from "next/image";
import Link from "next/link";

import { MoonCalendar } from "@/components/CalendarPage";
import { MaterialIcon } from "@/components/MaterialIcon";
import { loadMoonEntries, type MoonCalendarEntry } from "@/lib/calendar-sections";
import {
  formatDateKey,
  getZodiacSymbol,
  moonPhaseIcon,
  moonPhaseImage,
  moonPhaseLabelRu,
  resolveMoonPhase,
} from "@/lib/moon-phase";

type HomeLunarCalendarProps = {
  entries?: MoonCalendarEntry[];
};

export async function HomeLunarCalendar({
  entries: passedEntries,
}: HomeLunarCalendarProps = {}) {
  const entries = passedEntries ?? (await loadMoonEntries());
  const todayDate = new Date();
  const todayMoon = resolveMoonPhase(todayDate);
  const todayKey = formatDateKey(todayDate);
  const todayEntry = entries.find(e => e.date === todayKey);
  const todayZodiac = todayEntry?.zodiacSign || "в Стрельце";
  const todayZodiacSymbol = getZodiacSymbol(todayZodiac);

  return (
    <div
      id="lunar-calendar"
      className="block-lunar-calendar glass-effect overflow-hidden scroll-mt-28 rounded-2xl border border-outline-variant/10 dark:border-outline-variant/15"
    >
      <div className="header-lunar-calendar section-header relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6 border-b border-outline-variant/10 dark:border-outline-variant/15">
        {/* Background Image Container */}
        <div className="header-lunar-calendar-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/moon-calendar-header-garden-moon.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            className="object-cover object-[center_62%] opacity-70 sm:opacity-80 dark:opacity-58 sm:dark:opacity-68 saturate-[1.08] dark:saturate-105 brightness-[1.04] dark:brightness-100 transition-all duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/55 to-transparent dark:from-background/95 dark:via-background/65 dark:to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/35 dark:from-background/95 dark:via-background/85 dark:to-background/40" />
        </div>

        {/* Header content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-headline text-xl font-bold text-on-surface sm:text-2xl">
                    Лунный календарь
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high/90 dark:bg-surface-container-high/70 text-primary border border-primary/20 backdrop-blur-sm shadow-2xs">
                    <MaterialIcon
                      name={moonPhaseIcon(todayMoon.phase)}
                      className="text-sm text-primary-container moon-glow"
                    />
                    <span>{moonPhaseLabelRu(todayMoon.phase)}</span>
                  </span>
                  {todayZodiac ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high/90 dark:bg-surface-container-high/70 text-secondary border border-secondary/20 backdrop-blur-sm shadow-2xs">
                      <span aria-hidden="true" className="text-sm font-extrabold leading-none">
                        {todayZodiacSymbol}
                      </span>
                      <span>{todayZodiac}</span>
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed max-w-xl font-medium">
                  Выберите культуру — благоприятные дни по лунной матрице (посадка, полив, уход).
                </p>
              </div>
            </div>
            <Link
              href="/calendar"
              className="font-label text-[11px] font-semibold uppercase tracking-wide text-primary hover:text-primary-container transition-all duration-200 flex items-center gap-1 mt-1 shrink-0 px-2.5 py-1 rounded-full bg-surface-container/80 dark:bg-surface-container-high/80 border border-outline-variant/20 shadow-xs hover:shadow-sm backdrop-blur-sm"
            >
              <span>Весь календарь</span>
              <span className="text-xs">→</span>
            </Link>
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

