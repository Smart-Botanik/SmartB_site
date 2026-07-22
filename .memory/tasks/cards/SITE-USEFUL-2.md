# SITE-USEFUL-2 — «Полезное»: секции (видео / фото / гайды)

**Статус:** done (2026-07-22)  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-USEFUL-1`](./SITE-USEFUL-1.md) (thin page ✅) · platform [`ARCH-MEDIA-TAX-1`](../../../../memory/tasks/cards/ARCH-MEDIA-TAX-1.md) ✅ · [`BK-CONTENT-GALLERY-1`](../../../../memory/tasks/cards/BK-CONTENT-GALLERY-1.md) · [`FR-VUE-MEDIA-1`](../../../../memory/tasks/cards/FR-VUE-MEDIA-1.md)  

---

## Цель

Сделать `/useful` («Полезное») страницей с **явными секциями**: видеолента, фото, теги, интересные гайды — через **content-service** (hydrated galleries from media by **gallery id**).

---

## Контекст

- Contract: [ADR-0019](../../../../memory/docs/adr/0019-media-gallery-v1.md) — one **image** gallery id + one **video** gallery id; content→media; no edges on gallery load.
- Гайды — published guides с topic «Полезное» / `interesting`.
- Taxonomy labels on site from guide `taxonomyTags` (gallery `tagIds` remain opaque until hydrate).

---

## Scope

1. Sections on `/useful`: video · photo · tags · guides («Полезное»)
2. Site **port** → content `publishedUsefulGalleries` (+ optional env fallback ids)
3. Render image items (url + caption); video (+ poster)
4. Guides section with compact cards + card/list layout toggle
5. Header + footer nav link «Полезное»
6. Empty states

---

## Acceptance

- [x] Separate sections (video / photo / tags / guides) — `UsefulPageContent` + `UsefulGuidesSection`
- [x] Photo section from image gallery id (empty state if unset)
- [x] Video section from video gallery id (empty state if unset)
- [x] Tags from interesting guides (filter chips)
- [x] Guides from published interesting guides, titled «Полезное», card + list views
- [x] Compact gallery + guide preview cards (site styles)
- [x] Header + footer link `/useful`
- [x] Empty states without breaking the page
- [ ] Filled galleries in prod/dev after admin creates + env ids set

---

## Зависимости

| Что | Owner | Card |
|-----|--------|------|
| ARCH decisions | Architect | [`ARCH-MEDIA-TAX-1`](../../../../memory/tasks/cards/ARCH-MEDIA-TAX-1.md) ✅ |
| Media galleries API | Backend | [`BK-MS-GALLERY-1`](../../../../memory/tasks/cards/BK-MS-GALLERY-1.md) |
| Content hydrate bridge | Backend | [`BK-CONTENT-GALLERY-1`](../../../../memory/tasks/cards/BK-CONTENT-GALLERY-1.md) |
| Admin fill galleries | admin-vue | [`FR-VUE-MEDIA-1`](../../../../memory/tasks/cards/FR-VUE-MEDIA-1.md) · [`FR-VUE-CONTENT-GALLERY-1`](../../../../memory/tasks/cards/FR-VUE-CONTENT-GALLERY-1.md) |

---

## Out of scope

- Gallery CRUD in site
- edges culture galleryId ([`CE-GALLERY-REF-1`](../../../../services/content-edges/.memory/tasks/cards/CE-GALLERY-REF-1.md))
- Resolving opaque gallery `tagIds` via taxonomy-service (follow-up when API hydrates labels)

---

## Notes

Admin fills separate image/video gallery ids; content env `USEFUL_*_GALLERY_ID` preferred over `SITE_USEFUL_*`.
