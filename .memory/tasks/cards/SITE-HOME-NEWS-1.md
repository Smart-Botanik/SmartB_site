# SITE-HOME-NEWS-1 — News & updates on home + nav

**Статус:** done (2026-07-22) · follow-up images (2026-07-22)  
**Родитель:** SITE-1  
**Роль:** [Frontend]

---

## Цель

На главной: блок «Новости и обновления» (news/updates feed); guides-блок — «Последние гайды». Пункт меню «Последнее» ведёт на якорь `#news-updates`.

---

## Чеклист

- [x] `HomeLatest` — title «Последние гайды»
- [x] `HomeNewsUpdates` — glass list (featured + journal articles); title «Новости и обновления»
- [x] Home: left stack `#news-updates` + `#guides`; right cultures sidebar
- [x] Nav: «Последнее» → `/#news-updates`
- [x] Local preview images (`public/previews/*.jpg`); `HomeLatest` via `getGuidePreviewImage`; journal URLs local (Unsplash unavailable)

---

## Acceptance

- Menu item scrolls to news block on `/`
- Guides block still shows recent crop guides; «Все» → `/guides`
- News «Все» → `/journal`
- News + guides thumbs show images without remote CDN

---

## Файлы

- `site/components/HomeNewsUpdates/`
- `site/components/HomeLatest/HomeLatest.tsx`
- `site/app/page.tsx`
- `site/lib/site-nav.ts`
- `site/lib/journal-content.ts`
- `site/lib/content-api.ts` (`CROP_PREVIEW_IMAGES`)
- `site/public/previews/`
