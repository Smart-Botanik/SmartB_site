# SITE-CAL-3 — Calendar data: ephemeris + culture tones (no generalState)

**Статус:** done · 2026-07-26  
**Owner:** site · **Role:** [Frontend]  
**Depends:** [ARCH-CAL-EPHEM-1](../../../../memory/tasks/cards/ARCH-CAL-EPHEM-1.md) · soft [BK-CONTENT-CAL-3](../../../../memory/tasks/cards/BK-CONTENT-CAL-3.md) · matrix [ADR-0026](../../../../memory/docs/adr/0026-culture-lunar-matrix-v1.md)  
**Related:** [SITE-CAL-2](./SITE-CAL-2.md) (viz) · [SITE-CAL-1](./SITE-CAL-1.md)

---

## Цель

Подключить `/calendar` (и compact home) к **реальным** данным дня:

1. фаза / знак — из content `publishedCalendarDays` (кэш эфемерид) или fallback local viz;
2. favorability — **resolve** матрицы (не `generalState`, не hardcoded demo);
3. редакционный note — `CalendarDay` title/body если опубликован.

---

## Scope

- [x] Detail по клику: `publishedCalendarDay(date)` → title / bodyMd / phase / zodiac
- [x] Common calendar panel: **«Благоприятно для»** culture — action (matrix `resolveDefaultTone`)
- [x] `publishedCalendarDays(from,to)` для месяца (фаза/знак в ячейках без клика)
- [x] Ячейка: **не** красить по `generalState`; тон только от matrix + выбранной культуры
- [x] Иконки в ячейках — matrix для выбранной культуры («Все» → без иконок работ)
- [x] Culture select (Все / DEFAULT_CULTURES); compact default `crop.tomato`
- [x] Graceful: день без CMS → local phase; favorable только при zodiac в кэше дня

### Out of scope

- Admin editor (FR-VUE-CAL-TONE-1)
- Seasons product mode
- Dropping Prisma `generalState` column
- Public `lunarFacts` (admin-only) — zodiac only from published day cache
- Relying on legacy dated `CalendarDayCultureMark` as SoT (ADR-0026)

---

## Acceptance

- [x] Click cell loads CMS day description when published
- [x] Panel lists favorable culture×action pairs from contracts catalog when zodiac present
- [x] Month grid uses published phase when present, else local viz
- [x] Favorable icons follow matrix for selected crop, not hardcoded list
- [x] No dependency on editor-set GOOD/BAD day tone

---

## Notes

- BFF: missing day → GraphQL error «Published CalendarDay not found»; site → null.
- Files: `lib/calendar-api.ts`, `lib/calendar-favorable.ts`, `lib/moon-favorable-days.ts` (meta only), `MoonCalendar.tsx`
