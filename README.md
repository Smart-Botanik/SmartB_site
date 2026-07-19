# Growing Site

Публичный Next.js сайт: лендинг и SEO-гайды по культурам.

- **Remote**: `git@github.com:The-Lemon-Team/growing-site.git`
- **Монорепо**: `growing-app/site/` (nested repo, не submodule)

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_GRAPHQL_URL
npm run dev
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (:3012) |
| `npm run build` | Production build |
| `npm run start` | Production server |

## Маршруты

| URL | Страница |
|-----|----------|
| `/` | Главная (SitePage home) |
| `/guides` | Каталог гайдов |
| `/guides/kultury/tomat` | Hub культуры |
| `/guides/[slug]` | Статья |

## Push

Коммиты и push — в **этот** репозиторий (`growing-site`), не в монорепо:

```bash
git add .
git commit -m "feat(site): ..."
git push origin main
```

Из корня монорепо: `npm run site:push`.
