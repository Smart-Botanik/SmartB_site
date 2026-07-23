"use client";

import Image from "next/image";
import { useMemo } from "react";

import { LunarGuide } from "./LunarGuide";
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
          <div className="moon-cal-page-header-media" aria-hidden="true">
            <Image
              src="/moon-calendar-header-moonlit.png"
              alt=""
              fill
              priority
              sizes="(max-width: 960px) 100vw, 920px"
              className="moon-cal-page-header-img"
            />
            <div className="moon-cal-page-header-fade" />
          </div>
          <div className="moon-cal-page-header-copy">
            <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
              Инструменты
            </span>
            <h1 className="moon-cal-page-title">Лунный календарь</h1>
            {sections.intro.subtitle ? (
              <p className="moon-cal-page-subtitle">{sections.intro.subtitle}</p>
            ) : null}
          </div>
        </header>

        <section aria-label="Лунный календарь">
          <MoonCalendar entries={moonEntries} />
        </section>

        <LunarGuide guide={sections.lunarGuide} />
      </div>
    </div>
  );
}
