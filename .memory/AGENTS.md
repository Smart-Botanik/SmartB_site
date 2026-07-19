# Site — AI session contract

> **Минимальный AI env** для `site/` (Next.js public shell).  
> Не читай корневой `growing-app/memory/` целиком — только то, что ниже, плюс точечные ссылки.

## Старт сессии

1. [`.memory/hub.md`](./hub.md) — WIP и фокус
2. [`.memory/tasks/active.md`](./tasks/active.md) — открытые хвосты
3. Карточка задачи из `tasks/cards/` при работе над ID

## Todos (дешёвый канон)

| Артефакт | Роль |
|----------|------|
| `tasks/active.md` | WIP-список (≤5) |
| `tasks/cards/<ID>.md` | чеклисты, handoff, статус |
| `history.md` | локальные вехи site |

**Нет** Obsidian Kanban board в этом проекте — не синхронизировать `memory/tasks/kanban.md` при site-работе.

## Platform (только по необходимости)

Пока `site/` живёт nested в монорепо:

| Нужно | Куда |
|-------|------|
| ADR / cross-cut | `../../memory/docs/adr/` (файл по id, не весь каталог) |
| Platform hub / WIP других apps | `../../memory/hub.md` |
| content-service / TG scheduler | карточки в platform `TG-INT-1`, `BK-MS-CONTENT` — не дублировать здесь |

После выноса репо: platform-контекст — через **growing-brain** / **growing-project** MCP (см. [`ai-env-v1`](../../memory/docs/vision/ai-env-v1.md)).

## Обновления после значимого шага

1. Чеклист в `tasks/cards/<ID>.md`
2. Строка в `tasks/active.md` при смене WIP
3. Краткая веха в `history.md` (date · role · change · impact · reason)
4. Cross-cutting milestone → также platform `memory/project/history.md` (пока nested)

## Код

Только дерево `site/` (app, components, lib). Контент правится в admin / content-service, не в этом репо.

## Outbound (другие проекты)

Если нужен фикс вне `site/` (taxonomy, content, BFF, contracts…):

1. Записать blocker на текущей site-card (+ опционально `history.md`).
2. Создать card у владельца, связать обе стороны.
3. Спросить пользователя перед постановкой в platform hub WIP.
4. Делегировать в другое окно/агент; site не правит чужой код.

Правило: [`.cursor/rules/site-cross-project-handoff.mdc`](../.cursor/rules/site-cross-project-handoff.mdc).
