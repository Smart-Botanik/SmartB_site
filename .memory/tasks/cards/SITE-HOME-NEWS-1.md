# SITE-HOME-NEWS-1 — News & updates on home + nav

**Статус:** done (2026-07-22) · follow-up images (2026-07-22)  
**Родитель:** SITE-1  
**Роль:** [Frontend]

---

## Цель

На главной: один блок «Последнее» (recent guides); «Все» → `/guides`. Пункт меню «Последнее» ведёт на якорь `#news-updates` и подсвечивается. Журнал/новости — на `/journal`.

---

## Чеклист

- [x] `HomeLatest` — title «Последнее»; «Все» → `/guides`
- [x] Home: single left block `#news-updates` (guides); right cultures sidebar
- [x] Removed separate home news block (`HomeNewsUpdates`)
- [x] Nav: «Последнее» → `/#news-updates` (+ active highlight by hash)
- [x] Follow-up (2026-07-24): header hash sync on click/popstate so «Последнее» actually highlights after Next soft-nav
- [x] Follow-up (2026-07-24): optimistic nav active (`pendingHref`) so click «Гайды» from «Последнее» does not flash «Главная»
- [x] Local preview images (`public/previews/*.jpg`); `HomeLatest` via `getGuidePreviewImage`

---

## Acceptance

- Menu item scrolls to «Последнее» on `/`
- Block shows recent crop guides; «Все» → `/guides`
- Guide thumbs show images without remote CDN

---

## Файлы

- `site/components/HomeLatest/HomeLatest.tsx`
- `site/app/page.tsx`
- `site/lib/site-nav.ts`
- `site/lib/content-api.ts` (`CROP_PREVIEW_IMAGES`)
- `site/public/previews/`
