# SITE-USEFUL-5 — «Полезное»: источники + placeholder feed

**Статус:** done · 2026-07-26  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-USEFUL-4`](./SITE-USEFUL-4.md)

---

## Цель

Адаптировать `/useful`: добавить тип **Источники** в ленту и на этом шаге заполнить ленту **placeholder**-контентом (без ожидания CMS).

---

## Acceptance

- [x] Post type + filter `source` («Источники»)
- [x] Placeholder feed (video / image / guide / source) via `USEFUL_FEED_USE_PLACEHOLDERS`
- [x] Source cards: host chip, external CTA «Открыть источник»
- [x] Live CMS path retained behind flag (`false` → galleries + interesting guides)

---

## Notes

- Flag: `USEFUL_FEED_USE_PLACEHOLDERS` in `useful-feed.ts`
- CMS wiring for real sources — follow-up (content/admin)
