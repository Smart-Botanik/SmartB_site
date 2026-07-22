# SITE-CULT-TXT-1 — Culture presentation TEXT (tomato + cucumber)

**Статус:** done (2026-07-22)  
**Родитель:** SITE-1 · ADR-0015 culture_tag  
**Роль:** Frontend (+ contracts / admin-vue / seed)

---

## Цель

Расширить TEXT-презентацию culture hub (не новый page type): `hub_title`, `hub_lead`, `about_short`, `seo_description` на TagSurface; контент для **tomato** и **cucumber**.

---

## Чеклист

- [x] contracts — `ABOUT_SHORT` в `culture_tag.textRoles`
- [x] admin-vue — CultureFacetEditor: hub_title / hub_lead / about_short / seo_description
- [x] seed — richer TEXT для `crop.tomato` + `crop.cucumber`
- [x] site — render `aboutShort`; metadata из `seoDescription` / `hubTitle`
- [ ] reseed / republish profiles в dev (операционный шаг)

---

## Acceptance

- Admin сохраняет и публикует четыре text-поля на crop root
- `/guides/kultury/tomat` и `/guides/kultury/ogurec` показывают lead + about; meta — facet SEO
- Остальные культуры без обязательного about (только capacity в editor)

---

## Ссылки

- Hub: `site/app/guides/kultury/[crop]/page.tsx`
- Admin: `admin-vue/src/pages/content/CultureFacetEditorPage.vue`
- Seed: `backend_nest/src/scripts/seed-culture-facets.ts`
- Contracts: `packages/contracts/src/content-facets.ts`
