# SITE-1 — Public site & content launch

**Статус:** active  
**Канон:** этот файл в `site/.memory` (не Obsidian kanban)  
**Видение:** [`../docs/brief.md`](../docs/brief.md) · full: platform `10-site` (nested)  
**Handoff:** —

---

## Цель

Pre-launch: главная, гайды, Telegram, brand rollout на site UI.

---

## План (сводка)

1. **Код — главная и гайды** ✅ (FE-SITE-LCH-1/2, FR-SITE-CF-1, publish hub)
2. **Publish flow** ✅ — admin-vue → Telegram
3. **Первые публикации** ✅ — CONTENT-LCH-1…3, CONTENT-BRD-4 · [`telegram-first-posts-v1`](../docs/content/telegram-first-posts-v1.md)
4. **content-service SoT** ✅ — platform ADR-0016 / BK-MS-CONTENT
5. **Hub pages** 🔴 — [`FR-SITE-HUB-1`](./FR-SITE-HUB-1.md) + platform [`BK-CF-2`](../../../../memory/tasks/cards/BK-CF-2.md)

**Пакет A:** ✅ A1/A2 · drafts: [`drafts/`](../docs/content/drafts/) · seed: `backend_nest` → `npm run db:seed:site`

**Остаток:** hub TagSurface; TG smoke A1; пакет B; brand / SEO tails.

---

## Фазы

| Phase | Статус |
|-------|--------|
| 1–2 Backend + admin | ✅ |
| 3 Next MVP | ✅ (tail FE-SITE-6/7) |
| 4 /app routing | placeholder page (/app coming soon) |
| 5 Home + brand | 🔴 active |

---

## Sprint A — Home & Telegram

| ID | Задача | Статус |
|----|--------|--------|
| CONTENT-LCH-1…3 | Home + 2 articles | [x] 2026-07-10 |
| FE-SITE-LCH-1/2 | telegramBlock + culture chips | [x] |
| FR-SITE-CF-1 | Culture sidebar API | [x] 2026-07-07 |
| SITE-HOME-LATEST-1 | Latest glass card = culture sidebar layout | [x] 2026-07-22 |
| FE-SITE-LCH-3 | Footer links / About | [ ] partial |
| FE-SITE-LCH-4 | Header CTA «Скоро» | [ ] partial |
| FR-SITE-LCH-1 / BK-TG-1 / FR-TG-1 | Admin + publish | [x] |

### Done (2026-07-22) — `/app` placeholder

- Route `app/app/page.tsx` — coming-soon glass card (Telegram + гайды CTAs)
- Links from footer / home diary / grow reports (`siteEnv.appBasePath`) no longer 404
- Full app shell still paused (platform backlog)

## Sprint B — Brand

| ID | Задача | Статус |
|----|--------|--------|
| CONTENT-BRD-1…3 | Media, covers, tone | [ ] |
| CONTENT-BRD-4 | bodyTelegramMd A1/A2 | [x] |
| FE-SITE-BRD-1…3 | Logo/tokens/hero/OG | [ ] partial logo |
| FR-CONTENT-BRD-1 | Guide form checklist | [ ] |

## Open tails

- [ ] **FR-SITE-HUB-1** — hub `/guides/kultury/[crop]` via TagSurface
- [ ] FE-SITE-6 metadata / sitemap / OG
- [ ] FE-SITE-7 ISR + webhook (paused while `output: 'export'` — no Node server)
- [ ] FE-SITE-TAX-* hub filters
- [ ] BK-SITE-6 revalidate (platform)

### Done (2026-07-23) — Static export pre-VPS

- `next.config.ts`: `output: 'export'` by default (`SITE_STATIC_EXPORT=0` → Node/`next start` again)
- `images.unoptimized` + `trailingSlash` for static hosts
- Removed page `revalidate` (ISR incompatible with export)
- Culture hub `?label=` → client filter (`GuideCultureHubStatic`)
- Scripts: `npm run build:static` → `out/`; `npm run serve:static` → local preview on :3030
- **Note:** rebuild after CMS content changes; no live revalidate until VPS

### Done (2026-07-22) — `/guides` culture tabs reuse LOGO PNG

- Tabs on `/guides` used hardcoded `DEFAULT_CULTURES` emoji; now merge `publishedCultureOptions.icon` into `CulturePresentation`
- `CultureThumbnail` `variant="inline"` (20px) — same LOGO→emoji priority as home sidebar
- Files: `culture-presentation.ts`, `GuidesCatalogClient.tsx`, `CultureThumbnail.tsx`
- **Retest:** open `/guides` — culture pills show PNG when BFF returns `icon.kind=MEDIA`

### Blocked / upstream bug (2026-07-22) — tomato PNG LOGO

- **Symptom:** Sidebar «Культуры» не показывает PNG для `crop.tomato` (emoji/🌱 fallback).
- **Repro:** public BFF `publishedCultureOptions` → tomato `icon = { kind: EMOJI, emoji: null, image: null }`; `publishedContentFacets` → 404 published profile not found.
- **Suspected owner:** `services/content-edges` (publish LOGO path)
- **Owner task:** [`CE-CHIP-PNG-1`](../../../../services/content-edges/.memory/tasks/cards/CE-CHIP-PNG-1.md) — **done** (publish + clear `chip_icon`; BFF now `icon.kind=MEDIA` + PNG url)
- **Site note:** sidebar + `/guides` tabs both use `CultureThumbnail` / `icon.MEDIA`
- **Retest:** pending visual when site up (BFF contract ✅ 2026-07-22; guides tabs wired 2026-07-22)

### Done (2026-07-22) — Knowledge sections IA

- `/guides` = growing only (+ culture presentation)
- New pages: `/useful` (Полезное), `/preserving` (Закрутка), `/reports` (Репорты)
- «Полезное» removed from header nav and home block
- Cards: SITE-GUIDES-TRIM-1, SITE-USEFUL-1, SITE-PRESERVE-1, SITE-REPORTS-1

### Done (2026-07-22) — `/guides` interactive culture presentation

- Culture chips on `/guides` select in-place (no hub redirect): presentation block (photos + lead/about) + popular sub-tags
- Tomato popular tags: Подкормка / Уборка / Засев / Розовые / Детерминантные → filter `crop.tomato` + tag
- Filter bar shows **Томаты + selected label**; query `?culture=tomat&label=…`
- Components: `CulturePresentationBlock`, `GuidesCatalogClient`

### Blocked / upstream seed (2026-07-22) — culture popular tag keys

- **Symptom:** Site shows per-culture popular tags (max 2 sidebar / max 5 hub), but several keys are not in taxonomy seed yet.
- **Site map:** tomato determinate/indeterminate ✅; pepper/cabbage/zucchini/pumpkin variants + potato topics + **tomato presentation topics/pink** ❌
- **Suspected owner:** `services/taxonomy`
- **Proposed owner task:** TAX-SEED-CULTURE-VAR-1 — seed missing keys listed below — **awaiting user confirm**
- **Missing keys:**
  - `crop.pepper.bell`, `crop.pepper.hot`
  - `crop.cabbage.whitecabbage`, `crop.cabbage.whitecabbage.broccoli`
  - `crop.zucchini.zucchini`, `crop.zucchini.whitefruited`
  - `crop.pumpkin.butternut`, `crop.pumpkin.muscat`
  - `crop.cucumber.gherkin` (Корнишоны), `crop.cucumber.chinese` (Китайские) — sidebar cucumber chips
  - `guides.spraying`, `guides.landing`
  - `guides.feeding` (Подкормка), `guides.harvest` (Уборка), `guides.sowing` (Засев)
  - `crop.tomato.pink` (Розовые)
- **Retest:** pending after taxonomy seed

### Done (2026-07-22) — Culture presentation TEXT (SITE-CULT-TXT-1)

- Extended `culture_tag` TEXT: `about_short` (+ admin hub_title / seo)
- Seed richer copy for `crop.tomato` / `crop.cucumber`
- Site hub renders `aboutShort`; metadata uses facet SEO
- Card: [`SITE-CULT-TXT-1`](./SITE-CULT-TXT-1.md) — reseed still operational

### Done (2026-07-22) — Guide preview card sizes

- `GuidePreviewCard` size ladder: `small` | `middle` | `big` | `auto`
- `/guides` catalog: all cards `middle` at **fixed 168px** height (overflow clipped)
- CSS: `.guide-preview-card--{small,middle,big}` with hard `height` (not min-height)
- Layout versions: `card` (grid) / `list` (88px rows) + toggle on first section header

---

## Platform deps (не вести здесь)

TG Phase 2 scheduler · content-service · admin-vue Stream Registry — platform hub / cards.
