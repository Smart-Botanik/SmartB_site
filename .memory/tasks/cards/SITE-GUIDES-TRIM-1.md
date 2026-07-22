# SITE-GUIDES-TRIM-1 — `/guides` = только «Выращивание»

**Статус:** done (2026-07-22)  
**Owner:** site · **Role:** [Frontend]  
**Related:** [`SITE-USEFUL-1`](./SITE-USEFUL-1.md) · [`SITE-PRESERVE-1`](./SITE-PRESERVE-1.md) · [`SITE-REPORTS-1`](./SITE-REPORTS-1.md)

---

## Цель

Убрать с `/guides` разделы **Закрутка**, **Репорты**, **Полезное**. Каталог гайдов = культура + **Выращивание**.

---

## Acceptance

- [x] `/guides` рендерит только секцию `growing`
- [x] Чипы разделов ведут на отдельные страницы (не `#preserving` / `#reports` / `#interesting` на `/guides`)
- [x] Copy hero/нав не обещает «закрутка / репорты / подборки» как содержимое этой страницы
- [x] View-режим `/guides/view` — тот же trim

---

## Notes

Фильтрация по topic keys (`resolveGuideKnowledgeSection`) остаётся — просто UI не показывает чужие бакеты на `/guides`.
