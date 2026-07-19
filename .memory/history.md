# Site history (local)

> Локальный лог `site/`. **Не** копия platform `memory/project/history.md`.  
> Шаблон: date · role · change · impact · reason.

## 2026-07-17 — Outbound handoff rule (Architect)

**Role**: Architect  
**Change**: Rule `site-cross-project-handoff.mdc` + AGENTS.md: on out-of-site fixes, create owner task cards, ask before hub WIP, delegate to another project/window.  
**Impact**: Cross-service blockers persist as cards, not chat-only.  
**Reason**: Site isolation — taxonomy/content/BFF changes owned elsewhere.

## 2026-07-17 — Culture list: popular taxonomy labels (Frontend)

**Role**: Frontend  
**Change**: Shared popular taxonomy labels (Грядка / Гроубокс / Теплица, max 3) reused on every culture; sidebar chips + hub filter merge; `crop.pumpkin` in contracts hub slugs + taxonomy seed.  
**Impact**: Culture list shows taxonomy labels; same popular tags on all cultures.  
**Reason**: Extend culture list beyond crop name; cross-cutting placement tags.

## 2026-07-17 — Культуры: 6 пунктов несмотря на CMS (Frontend)

**Role**: Frontend  
**Change**: `resolveCultureTagKeys` — CMS `cultureTagKeys` может reorder/extend, но не отрезает site defaults (Капуста, Тыква).  
**Impact**: Sidebar «Культуры» всегда ≥6 (полный `DEFAULT_CULTURES`).  
**Reason**: Published home держал только 4 ключа — список выглядел урезанным.

## 2026-07-17 — Культуры: Тыква в дефолтном наборе (Frontend)

**Role**: Frontend  
**Change**: В `DEFAULT_CULTURES` добавлена **Тыква** (`crop.pumpkin` / `tykva`); Капуста уже была.  
**Impact**: Sidebar «Культуры», каталог и hub slug gen включают тыкву.  
**Reason**: Расширение набора культур; иконки пока emoji-fallback (Перец = 🌶️).

## 2026-07-17 — Home nav: Последнее + Полезное (Frontend)

**Role**: Frontend  
**Change**: Header — убран «Репорты», добавлен «Последнее» → `/#latest`; на главной после «Последнее» — секция «Полезное» (тот же блок, что на `/guides`).  
**Impact**: Короче меню; быстрый переход к свежим материалам; полезные подборки на home.  
**Reason**: UX nav / home composition.

## 2026-07-11 — FR-SITE-HUB-1 wired: TagSurface hub (Frontend)

**Role**: Frontend · Backend  
**Change**: Hub pages consume `publishedTagSurface`; facets lead/preview; BK-CF-2 BFF gateway.  
**Impact**: Culture hubs не зависят от отдельных cropKind queries.  
**Reason**: FR-SITE-HUB-1 implementation slice.

## 2026-07-11 — FR-SITE-HUB-1: hub pages task (Architect)

**Role**: Architect  
**Change**: Card [`FR-SITE-HUB-1`](./tasks/cards/FR-SITE-HUB-1.md) — `/guides/kultury/[crop]` via `publishedTagSurface`; hub focus; depends on platform **BK-CF-2**.  
**Impact**: Явный следующий frontend slice после culture sidebar.  
**Reason**: ADR-0015 Phase 2; composed hub surface.

## 2026-07-11 — Memory pilot: site/.memory (Architect)

**Role**: Architect  
**Change**: Добавлен минимальный AI env: `hub`, `active`, `cards/SITE-1`, local `history`, content docs; todos = cards (без Obsidian kanban). Platform stubs указывают сюда.  
**Impact**: Сессии по site читают только `.memory/`; путь к выносу nested `growing-site`.  
**Reason**: Декомпозиция brain; экономия токенов.

## 2026-07-10 — Home + launch guides (Content · Frontend)

**Role**: Content · Frontend  
**Change**: Home hero/CTA/telegramBlock; guides A1/A2; culture sidebar via facets API.  
**Impact**: Pre-launch контент на сайте готов; next — TG smoke A1.  
**Reason**: CONTENT-LCH + FR-SITE-CF-1 (деталь в platform history при nested).
