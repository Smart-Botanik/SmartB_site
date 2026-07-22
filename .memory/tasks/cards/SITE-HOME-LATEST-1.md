# SITE-HOME-LATEST-1 — Latest section: glass card + sidebar layout

**Статус:** done (2026-07-22)  
**Родитель:** SITE-1  
**Роль:** [Frontend]

---

## Цель

Секция «Последнее» на главной — glass shell как у sidebar «Культуры»; внутри — прежние guide cards (preview + crop pill + excerpt).

---

## Чеклист

- [x] `HomeLatest` — `glass-effect rounded-2xl` card shell как у `HomeSidebarCultures`
- [x] Header: title + «Все» link; short description
- [x] Items: restored card style (large thumb, crop pill, date, title, excerpt)
- [x] Empty state внутри карточки

---

## Acceptance

- Latest и Культуры в grid — пара glass-панелей; внутри Latest — прежние карточки гайдов
- Гайды кликабельны на `/guides/[slug]`; «Все» → `/guides`

---

## Файлы

- `site/components/HomeLatest/HomeLatest.tsx`
