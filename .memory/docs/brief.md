# Site — brief (local)

**Статус:** living slim · полный vision пока в platform [`10-site`](../../../memory/docs/core/10-site.md) (nested).  
После выноса репо: расширить этот brief или тянуть vision через brain MCP.

## Что это

Публичная оболочка SmartБотаник: главная + гайды. Контент из **content-service** (PUBLISHED only). Редактирование — admin, не этот репо.

## Маршруты

| URL | Назначение |
|-----|------------|
| `/` | Home (`SitePage` sections) |
| `/guides` | Каталог |
| `/guides/[slug]` | Гайд (Markdown `bodySiteMd`) |

## Принципы

- Site **только читает** published API.
- Гайды ↔ taxonomy keys (`crop.*`, `topic.*`) — словарь общий с app; в UI app гайды не показываем.
- Telegram teaser: `bodyTelegramMd`; publish — admin / content-service.

## Сейчас (2026-07)

Launch tails на [`../tasks/cards/SITE-1.md`](../tasks/cards/SITE-1.md). План постов: [`content/telegram-first-posts-v1.md`](./content/telegram-first-posts-v1.md).

## Platform pointers (nested only)

| Тема | Где |
|------|-----|
| ADR content-service | `memory/docs/adr/0016-…` |
| ADR facets | `memory/docs/adr/0015-…` |
| Nested repo how-to | `memory/docs/core/site-repo.md` |
