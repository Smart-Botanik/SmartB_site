# SITE-JOURNAL-1 — `/journal` news column + page chrome

**Статус:** in progress (2026-07-27)  
**Owner:** site · **Role:** [Frontend]  
**Prototype:** `prototypes/journal/`  
**Related:** [`SITE-HOME-NEWS-1`](./SITE-HOME-NEWS-1.md) · [`SITE-REPORTS-1`](./SITE-REPORTS-1.md)

---

## Цель

Страница `/journal` («Журнал выращивания»): редакционные **Новости и обновления** из CMS; **Лента циклов** — placeholder до публичного API дневников.

---

## Scope (site)

- [x] `lib/journal-sections.ts` — parse `SitePage` key `journal` (`journalIntro`)
- [x] `lib/journal-feed.ts` — `publishedCropGuides(termKey: topic.news)` → news cards; fallback `journal-content.ts`
- [x] `app/journal/page.tsx` — async fetch intro + news; metadata from CMS when published
- [ ] Visual QA vs prototype (glass, grid 8+4)
- [ ] Retest when BFF up + seed has `topic.news` guides

## Out of scope (this slice)

- **Лента циклов** / community stats — stay mock (`JOURNAL_FEED`)
- Dedicated `SiteNews` entity — deferred (see upstream)
- Home teaser of latest news — not requested (home = guides)

---

## Upstream (handoff — not site WIP)

| ID | Owner | Суть | Status |
|----|-------|------|--------|
| **BK-CONTENT-JOURNAL-1** | content / nest seed | `SitePage` key `journal` + seed 2–3 `CropGuide` with `topic.news` | proposed — awaiting user confirm |
| **FR-VUE-JOURNAL-1** | admin-vue | Editor: journal SitePage + news guides filter/tag | proposed — awaiting user confirm |
| **SITE-JOURNAL-2** | site | Wire cycle feed when public diary/community API exists | backlog |

**Taxonomy:** add `topic.news` (TOPIC) in taxonomy seed if missing — owner TAX or BK seed.

---

## Acceptance

- `/journal` renders CMS news when `topic.news` guides published
- Empty / API down → existing placeholder cards (no blank page)
- Page title/subtitle/SEO from `publishedSitePage("journal")` when published
- Nav «Журнал» + footer link unchanged
- Cycle sidebar still mock; CTA «Вся лента» → `/reports`

---

## Files

- `app/journal/page.tsx`
- `lib/journal-feed.ts`, `lib/journal-sections.ts`, `lib/journal-content.ts`
- `components/JournalNewsSection/`, `JournalFeedSidebar/`
