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

---

## Files

- `components/CalendarPage/`
- `lib/moon-phase.ts`
- `app/globals.css` (moon-glow, cell hover)
