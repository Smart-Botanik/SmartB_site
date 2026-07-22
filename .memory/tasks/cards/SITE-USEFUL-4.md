# SITE-USEFUL-4 — «Полезное» unified feed (prototype layout)

**Статус:** done · 2026-07-22  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-USEFUL-3`](./SITE-USEFUL-3.md) · prototype `prototypes/useful-feed/`

---

## Цель

Перестроить `/useful` по прототипу: **левый sidebar** с фильтрами + **центральная лента** (video / image / guide). Правый sidebar прототипа — не переносим.

---

## Acceptance

- [x] Layout: sticky left filters + central feed (no right rail)
- [x] Filters: Все посты · Гайды и советы · Фото · Таймлапс (`all` | `guide` | `image` | `video`)
- [x] Combined feed from galleries + interesting guides (+ demos when empty)
- [x] Mobile filter chips
- [x] Keep site chrome (header/footer); no prototype top/bottom app bars
- [x] Soft feed cards (media · title · engagement · optional guide link)

---

## Notes

- Removed separate TikTok scroller / photo grid / guides grid sections.
- Prototype right rail (trending / stage pills) intentionally omitted.
- «Фото» added so `image` is first-class alongside Timelapse/Guides (user: filter by video | image | guide).
