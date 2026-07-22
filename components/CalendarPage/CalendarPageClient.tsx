"use client";

import { useMemo } from "react";

import { MoonCalendar } from "./MoonCalendar";
import {
  parseMoonEntries,
  type ParsedCalendarSections,
} from "@/lib/calendar-sections";

type CalendarPageClientProps = {
  sections: ParsedCalendarSections;
};

export function CalendarPageClient({ sections }: CalendarPageClientProps) {
  const moon = sections.modes.moon;
  const moonEntries = useMemo(
    () => parseMoonEntries(moon.data),
    [moon.data],
  );

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-16">
      <div className="moon-cal-page">
        <header className="moon-cal-page-header">
          <div className="hero-gradient absolute inset-0 -z-10" />
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            Инструменты
          </span>
          <h1 className="moon-cal-page-title">Лунный календарь</h1>
          {sections.intro.subtitle ? (
            <p className="moon-cal-page-subtitle">{sections.intro.subtitle}</p>
          ) : null}
        </header>

        <section aria-label="Лунный календарь">
          <MoonCalendar entries={moonEntries} />
        </section>
      </div>
    </div>
  );
}
