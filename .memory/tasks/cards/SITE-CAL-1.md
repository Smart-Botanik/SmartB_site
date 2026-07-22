# SITE-CAL-1 — Public calendar page (`/calendar`)

**Статус:** done (slice 2026-07-22) — shell + CMS read + nav; richer viz → SITE-CAL-2  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`FR-VUE-CAL-1`](../../../../memory/tasks/cards/FR-VUE-CAL-1.md) · [`BK-CONTENT-CAL-1`](../../../../memory/tasks/cards/BK-CONTENT-CAL-1.md)  
**Independent of:** app diary lunar widgets · future **Smart Botanik Seasons**

---

## Цель

Публичная страница **Календарь**: режимы **лунный** | **сезонный** (расширяемо). Контент и данные режимов — из CMS (`SitePage` key `calendar`).

---

## Решения (2026-07-22)

| Тема | Решение |
|------|---------|
| IA / nav | `/calendar` + **header** + **footer** |
| Data | CMS (`SitePage`); schema changes — discuss |
| Priority | Ahead of SITE-USEFUL-2 |
| App | Independent; future Seasons product |

---

## Done

- [x] `/calendar` + mode switch moon | seasons
- [x] Descriptions + data from `publishedSitePage("calendar")` (defaults if missing)
- [x] Header «Календарь»; active state
- [x] Footer link
- [x] Graceful empty / unpublished
- [x] No app diary APIs

---

## Files

- `app/calendar/page.tsx`
- `lib/calendar-sections.ts`
- `components/CalendarPage/`
- `lib/site-nav.ts` · `SiteHeader` · `SiteFooter`

---

## Follow-up

- **SITE-CAL-2** — month grid / richer moon viz when data shape stabilizes
- Seed: re-run `db:seed:site` (or Nest seed script) for sample calendar entries
- Admin: Content → Календарь (`FR-VUE-CAL-1`)
