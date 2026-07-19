# FR-SITE-HUB-1 — Culture hub pages via Tag Surface

**Статус:** done (2026-07-11)  
**Родитель:** SITE-1 · ADR-0015 Phase 2  
**Роль:** Frontend (+ platform BK-CF-2)  
**Handoff:** —

---

## Цель

Страницы `/guides/kultury/[crop]` получают данные из **одного** composed query `publishedTagSurface(tagKey)` вместо ad-hoc фильтров гайдов.

Показываем: lead/icon/preview из **content-facets**, список **guides**, позже — products/brands.

---

## Зависимости (platform)

| ID | Что | Card |
|----|-----|------|
| **BK-CF-2** | `TagSurfaceService` в BFF — compose taxonomy + facets + guides (+ products) | [`BK-CF-2`](../../../../memory/tasks/cards/BK-CF-2.md) |
| ADR-0015 | Контракт `TagSurface`, слоты facets | [`0015-content-facets-v1`](../../../../memory/docs/adr/0015-content-facets-v1.md) |
| FR-SITE-CF-1 | ✅ Home sidebar уже отдаёт `hubSlug` + emoji/preview | done |

---

## Чеклист (site)

- [ ] `lib/tag-surface.ts` — fetch `publishedTagSurface`, map `ContentFacetWords` + media URLs
- [x] `/guides/kultury/[crop]` — resolve `crop` slug → `tagKey` (`CROP_TAG_HUB_SLUGS` inverse)
- [x] Hub hero: `hub_title`, `hub_lead`, `IMAGE_M` / `PREVIEW`, chip icon (emoji или LOGO)
- [x] Guide streams: overview vs variant grouping (сохранить FE-SITE-TPL-2 семантику)
- [x] ISR: `revision` из `TagSurface` для `revalidate`
- [x] Fallback при пустых facets (taxonomy label + static emoji из contracts)
- [x] Smoke: `tomat` hub с seed culture-facets + A1/A2 guides (manual / dev stack)

---

## Не в этом срезе

- Admin facet editor → **FR-VUE-CF-1** (platform)
- Product cards на hub → BK-CF-2 tail / ADR-0015 Phase 3
- Extract `content-facets-service` → **BK-CF-3**

---

## Ссылки

- Route MVP: [`site-repo`](../../../../memory/docs/core/site-repo.md) § routes
- Contracts: `packages/contracts/operations/content-facets.graphql`
