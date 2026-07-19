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
| 4 `/app` routing | paused (platform backlog) |
| 5 Home + brand | 🔴 active |

---

## Sprint A — Home & Telegram

| ID | Задача | Статус |
|----|--------|--------|
| CONTENT-LCH-1…3 | Home + 2 articles | [x] 2026-07-10 |
| FE-SITE-LCH-1/2 | telegramBlock + culture chips | [x] |
| FR-SITE-CF-1 | Culture sidebar API | [x] 2026-07-07 |
| FE-SITE-LCH-3 | Footer links / About | [ ] partial |
| FE-SITE-LCH-4 | Header CTA «Скоро» | [ ] partial |
| FR-SITE-LCH-1 / BK-TG-1 / FR-TG-1 | Admin + publish | [x] |

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
- [ ] FE-SITE-7 ISR + webhook
- [ ] FE-SITE-TAX-* hub filters
- [ ] BK-SITE-6 revalidate (platform)

---

## Platform deps (не вести здесь)

TG Phase 2 scheduler · content-service · admin-vue Stream Registry — platform hub / cards.
