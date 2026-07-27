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
- [x] Active: `public/moon-calendar-header-garden-moon.png` (garden path + crescent)
- [x] Saved: `public/moon-calendar-header-moonlit-saved.png` (prev night sky)
- [x] Saved: `public/moon-calendar-header-garden-saved.png` (warm garden illustration)
- [x] Lunar howto guide (`calendarLunarGuide`) + phase SVGs under `public/calendar/`
- [x] Compact moon grid on home after «Последние гайды» (`HomeLunarCalendar`, `variant="compact"`)
- [x] Home compact denser cells + hardcoded favorable-day icons (landing/watering/nutrients/harvest/care)
- [x] Day panel internal padding (grid float + compact + table expand)
- [x] Compact home cells: bottom inset so favorable icons clear the edge
- [x] Legend help block padding (tone + activity icons)

## Follow-up

- **SITE-CAL-3** — real `publishedCalendarDays` + matrix resolve; drop demo favorability / no `generalState` cell bg · [`SITE-CAL-3`](./SITE-CAL-3.md)
- Strategy: [`ARCH-CAL-EPHEM-1`](../../../../memory/tasks/cards/ARCH-CAL-EPHEM-1.md)

---

## Files

- `components/CalendarPage/`
- `components/HomeLunarCalendar/`
- `lib/moon-phase.ts`
- `lib/moon-favorable-days.ts` (demo markers)
- `lib/calendar-sections.ts` (`calendarLunarGuide`)
- `app/globals.css` (moon-glow, cell hover, header media fade, guide, compact, favorable)
- `app/page.tsx` (home compact calendar)
- `public/moon-calendar-header-garden-moon.png`
- `public/moon-calendar-header-moonlit-saved.png`
- `public/moon-calendar-header-garden-saved.png`
- `public/calendar/moon-phase-{new,waxing,full,waning}.svg`
