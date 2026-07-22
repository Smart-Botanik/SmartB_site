# SITE-USEFUL-3 — «Полезное» social feed (likes / comments UI)

**Статус:** done (UI + hardcoded) · 2026-07-22  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-USEFUL-2`](./SITE-USEFUL-2.md) · platform [`ARCH-ENGAGE-1`](../../../../memory/tasks/cards/ARCH-ENGAGE-1.md) · [`BK-ENGAGE-1`](../../../../memory/tasks/cards/BK-ENGAGE-1.md)

---

## Цель

Сделать `/useful` sociable: видеолента (infinite scroll / TikTok-like), фото с комментариями, гайды с лайками/комментариями (card + list), подготовка guide article под backend.

---

## Acceptance

- [x] Remove top knowledge-section chips (Выращивание / Закрутка / Репорты / Полезное) from `/useful`
- [x] Vertical infinite-scroll video feed
- [x] Photo gallery with expandable hardcoded comments
- [x] Guides section: tags as filters (combined, no separate «Теги» H2) + card/list + like/comment counters
- [x] Guide article: EngagementBar + CommentsList (hardcoded, contract-shaped)
- [x] Task cards for real API (ARCH + BK)
- [ ] Swap mocks → GraphQL when BK-ENGAGE-1 ships

---

## Notes

Site types: `lib/engagement.ts` (`CommentDto`, `EngagementStatsDto`, …). Composer disabled until API.

### Fix (2026-07-22)
- **Symptom:** `/useful` crashed — `galleryItemsToFeed` called from Server Component but lived in `"use client"` `UsefulVideoFeed`.
- **Fix:** moved `galleryItemsToFeed` + `UsefulFeedItem` to shared `useful-feed.ts` (no client directive).
