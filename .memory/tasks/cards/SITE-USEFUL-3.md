# SITE-USEFUL-3 — «Полезное» social feed (likes / comments UI)

**Статус:** in progress · live path + mock fallback · 2026-07-23  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-USEFUL-2`](./SITE-USEFUL-2.md) · platform [`ARCH-ENGAGE-1`](../../../../memory/tasks/cards/ARCH-ENGAGE-1.md) · [`BK-MS-SOCIAL-1`](../../../../memory/tasks/cards/BK-MS-SOCIAL-1.md) · [`BK-ENGAGE-1`](../../../../memory/tasks/cards/BK-ENGAGE-1.md) · [ADR-0020](../../../../memory/docs/adr/0020-social-service-v1.md)

---

## Цель

Сделать `/useful` sociable: видеолента, фото с комментариями, гайды с лайками/комментариями; guide article — comments under guide via **`discussionId`**.

---

## Acceptance

- [x] Remove top knowledge-section chips from `/useful`
- [x] Vertical infinite-scroll video feed
- [x] Photo gallery with expandable comments (hardcoded)
- [x] Guides section: tags as filters + card/list + like/comment counters
- [x] Guide article: EngagementBar + CommentsList (hardcoded, contract-shaped)
- [x] Align `lib/engagement.ts` to discussion-centric DTOs (`discussionId`) + mocks
- [x] Site → social-service (`lib/social-api.ts`) with **mock fallback**
- [x] Guide article + `/useful` feed resolve engagement (live if `discussionId` + social up)
- [ ] Composer / auth write (like, createComment) — still disabled
- [ ] Gallery items mint real `discussionId` (media/content) — still mock subject ids

---

## Notes

- Env: `SOCIAL_GRAPHQL_URL=http://localhost:3014/graphql`, `SOCIAL_SERVICE_INTERNAL_KEY`
- Path: site → **social-service** (not nest). Mocks when social down or no `discussionId`.

### Fix (2026-07-22)
- **Symptom:** `/useful` crashed — `galleryItemsToFeed` called from Server Component but lived in `"use client"` `UsefulVideoFeed`.
- **Fix:** moved `galleryItemsToFeed` + `UsefulFeedItem` to shared `useful-feed.ts` (no client directive).
