# SITE-USEFUL-6 — «Полезное»: Post canon + filter counts

**Статус:** done · 2026-07-26  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-USEFUL-5`](./SITE-USEFUL-5.md) · [`SITE-USEFUL-4`](./SITE-USEFUL-4.md) · admin [`FR-VUE-USEFUL-FEED-2`](../../../../memory/tasks/cards/FR-VUE-USEFUL-FEED-2.md)

---

## Цель

Зафиксировать канон карточки **Post** (Image + Socials likes-only) и показать **счётчики** на фильтрах `GUIDE | IMAGE | VIDEO | SOURCE`.

---

## Acceptance

- [x] Post card: header · media · body · **likes only** (`EngagementBar` `showComments={false}`)
- [x] Comments / composer UI removed / commented — out of scope (SITE-USEFUL-3 / BK-ENGAGE-1)
- [x] Types documented: GUIDE | IMAGE | VIDEO | SOURCE (`USEFUL_POST_TYPE_LABELS`)
- [x] `countUsefulFeedByType` → sidebar + mobile chip badges
- [x] Empty filter copy mentions 0
- [x] Placeholders flag unchanged; live CMS path retained

---

## Notes

- Socials = likes only for this slice; comments are further future.
- Counts are client-side over the loaded feed (no separate API).
- Do not commit mixed with SITE-CAL-* — separate commits when asked.
