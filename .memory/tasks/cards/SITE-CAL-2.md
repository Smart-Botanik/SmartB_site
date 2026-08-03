# SITE-CAL-2 — Richer calendar viz (month grid)

**Статус:** in progress (2026-07-22)  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-CAL-1`](./SITE-CAL-1.md) · prototype `prototypes/moon-calendar/`  
**Independent of:** app diary lunar widgets · prototype app shell / sidebar

---

## Цель

Визуальный **месячный грид** лунного календаря на `/calendar` по layout/styles прототипа Celestial Glass — без копирования app shell (top nav «Lunar Cycle», правый inspector, bottom mobile app nav).

---

## Scope

- [x] Month grid 7×N (Mon–Sun), square cells, glass panel + hover
- [x] Month prev/next + Grid|List toggle
- [x] Moon phase icons (Material) + today ring
- [x] CMS `entries` overlay (phase / note) on matching dates
- [x] Keep site header/footer; seasons mode switch disabled (moon only; CMS parse kept)
- [x] Skip prototype fixed right sidebar / app chrome
- [x] Table view: day / weekday / phase / lunar day / illumination / note
- [x] Grid: floating day panel absolute top-right inside calendar
- [x] Table: expand row for day info (no floating panel)
- [x] Header art under titles with fade (mask + light veil) — light: opacity 0.92 + soft border; dark: 0.58 (2026-07-24)
- [x] Active: `public/moon-calendar-header-garden-moon.webp` (moonlit veg garden, 1600×791, ~90KB) — 2026-08-02
- [x] Archive alias: `public/moon-calendar-header-garden-moonlit-night.webp`
- [x] Source: `assets/moon-calendar-header-garden-moonlit-night-source.png`
- [x] Prev active PNG: `public/moon-calendar-header-garden-moon-prev.png`
- [x] Saved: `public/moon-calendar-header-moonlit-saved.png` (prev night sky)
- [x] Saved: `public/moon-calendar-header-garden-saved.png` (warm garden illustration)
- [x] Lunar howto guide (`calendarLunarGuide`) + phase SVGs under `public/calendar/`
- [x] Compact moon grid on home after «Последние гайды» (`HomeLunarCalendar`, `variant="compact"`)
- [x] Home compact denser cells + hardcoded favorable-day icons (landing/watering/nutrients/harvest/care)
- [x] Day panel internal padding (grid float + compact + table expand)
- [x] Compact home cells: bottom inset so favorable icons clear the edge
- [x] Legend help block padding (tone + activity icons)
- [x] Day panel: CMS `.guide-paragraph` above `.moon-cal-favorable-block` (2026-08-02)
- [x] «Все культуры»: cell icons = general day signs (phase×zodiac), not culture emojis
- [x] Day panel «Знаки дня» + `soil` activity (`resolveGeneralDayActivities`)
- [x] Home compact: day# top-right (larger), lunar day top-right; fav icon string; Esc closes modal; «Благоприятные для:» / «Культуры» grouped; watering_can / nutrition / content_cut (2026-08-02)
- [x] Shared cell chrome on `/calendar` + home: day# on top, lunar+zodiac row beneath; `/calendar` larger day labels + month header (chevrons + title); table mode only on full (2026-08-02)
- [x] `app/css/calendar.css` dedupe/minify: dropped duplicate guide+day-panel block, dead `.moon-cal-cell-moon` sizes, folded `calendar-cell-hover` into `.moon-cal-cell` (~35KB→29KB)

## Follow-up

- **SITE-CAL-3** — real `publishedCalendarDays` + matrix resolve; drop demo favorability / no `generalState` cell bg · [`SITE-CAL-3`](./SITE-CAL-3.md)
- Strategy: [`ARCH-CAL-EPHEM-1`](../../../../memory/tasks/cards/ARCH-CAL-EPHEM-1.md)

---

## Files

- `components/CalendarPage/`
- `components/HomeLunarCalendar/`
- `lib/moon-phase.ts`
- `lib/moon-favorable-days.ts` (activity meta + soil)
- `lib/calendar-favorable.ts` (`resolveGeneralDayActivities`)
- `lib/calendar-sections.ts` (`calendarLunarGuide`)
- `app/globals.css` (moon-glow, cell hover, header media fade, guide, compact, favorable)
- `app/page.tsx` (home compact calendar)
- `public/moon-calendar-header-garden-moon.webp`
- `public/moon-calendar-header-garden-moonlit-night.webp`
- `public/moon-calendar-header-garden-moon-prev.png`
- `public/moon-calendar-header-moonlit-saved.png`
- `public/moon-calendar-header-garden-saved.png`
- `assets/moon-calendar-header-garden-moonlit-night-source.png`
- `public/calendar/moon-phase-{new,waxing,full,waning}.svg`
