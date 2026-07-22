# SITE-USEFUL-1 — Страница «Полезное»

**Статус:** done (2026-07-22)  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-GUIDES-TRIM-1`](./SITE-GUIDES-TRIM-1.md)

---

## Цель

Вынести «Полезное» из `/guides` и из главного меню на отдельную страницу.

---

## Scope

1. Маршрут `/useful` — секция `interesting` (`topic.interesting`)
2. Убрать «Полезное» из `SITE_HEADER_NAV_LINKS`
3. Убрать полный блок «Полезное» с главной (`/#interesting`)
4. Обновить ссылки (HomeKnowledge, journal, static previews) → `/useful`

---

## Acceptance

- [x] `/useful` показывает материалы раздела «Полезное»
- [x] В header нет пункта «Полезное»
- [x] На home нет якорной секции `interesting`
- [x] Нет живых ссылок на `/guides#interesting` / `/#interesting`

---

## Out of scope

Закрутка / Репорты — [`SITE-PRESERVE-1`](./SITE-PRESERVE-1.md) / [`SITE-REPORTS-1`](./SITE-REPORTS-1.md).

---

## Follow-up

- [x] Rich sections (видео / фото / гайды) — [`SITE-USEFUL-2`](./SITE-USEFUL-2.md)
- Platform: Media+taxonomy+caption talk [`ARCH-MEDIA-TAX-1`](../../../../memory/tasks/cards/ARCH-MEDIA-TAX-1.md) · admin upload [`FR-VUE-MEDIA-1`](../../../../memory/tasks/cards/FR-VUE-MEDIA-1.md)
