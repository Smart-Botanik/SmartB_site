# Первые публикации Telegram + Site (v1)

**Роль:** [Lead] · Content  
**Дата:** 2026-07-10  
**Связь:** SITE-1 (CONTENT-LCH-*, CONTENT-BRD-4) · TG-INT-1 (CONTENT-TG-1) · vision [`10-site` §4.3](../core/10-site.md)

---

## Контекст

| Слой | Статус |
|------|--------|
| Publish now + multi-bot hub | ✅ TG-BOTS-1 Phase 1.5 |
| content-service / content_db | ✅ ADR-0016 |
| Планировщик очереди | ⏳ Phase 2 (BK-TG-QUEUE-1) — пока **ручной** publish |
| Контент статей + `bodyTelegramMd` | ✅ пакет A (CONTENT-LCH-3 / BRD-4) |

**Принцип:** контент-first — готовим 2–4 гайда с TG-анонсом **до** анонса канала; scheduler UI не блокирует черновики.

---

## Рубрики (taxonomy `guides` / TOPIC)

| Key | Label | Для первых постов |
|-----|-------|-------------------|
| `topic.growing` | Выращивание | ✅ основной поток |
| `topic.preserving` | Закрутка | ✅ 1 пост |
| `topic.interesting` | Интересное | опционально (канал about) |
| `topic.reports` | Репорты | позже (когда есть Grow Reports) |

Культуры (chips / фильтры): `crop.tomato`, `crop.cucumber`, + pepper/basil по seed site.

---

## Пакет A — минимум launch (CONTENT-LCH-3 + CONTENT-BRD-4)

| # | Тема | Slug (черновик) | Теги | Формат |
|---|------|-----------------|------|--------|
| **A1** | Выращивание помидоров на грядке: старт сезона | `tomato-outdoor-bed-start` | `crop.tomato`, `environment.type.outdoor.bed`, `topic.growing` | Полный гайд + TG teaser |
| **A2** | Гроубокс: свет и вентиляция без перегрева | `growbox-light-ventilation` | `environment.type.indoor.growbox`, `topic.growing` | Полный гайд + TG teaser |

**Дополнительно (канал, не обязательно статья):**

| # | Тема | Куда |
|---|------|------|
| **P0** | Описание канала + pinned (что публикуем, ссылка на сайт) | CONTENT-LCH-2 |
| **H0** | Hero / CTA home: guides + TG, «приложение скоро» | CONTENT-LCH-1 |

---

## Пакет B — очередь на 2 недели (после A)

| # | Тема | Slug | Теги | Неделя |
|---|------|------|------|--------|
| **B1** | Полив в жару: когда и сколько | `watering-in-heat` | `topic.growing`, outdoor env | W1 |
| **B2** | Закрутка после сушки: базовый чеклист | `preserving-after-dry` | `topic.preserving` (+ crop optional) | W1–W2 |
| **B3** | Огурцы: пчелоопыление vs партенокарпик (коротко) | `cucumber-pollination-basics` | `crop.cucumber`, `topic.growing` | W2 |
| **B4** | Как мы строим SmartБотаник #1 (behind the scenes) | `building-smart-botanik-1` | `topic.interesting` | W2 · CONTENT-BLOG-1 |

---

## Шаблон `bodyTelegramMd` (CONTENT-TG-1)

```markdown
🌱 {заголовок}

{2–4 предложения сути}

• пункт 1
• пункт 2
• пункт 3

📖 Полная статья: {PUBLIC_SITE_BASE_URL}/guides/{slug}

#SmartБотаник #выращивание {#культура}
```

CTA в конце обязателен. Hashtags — через BK-TG-2 footer, если уже включён.

---

## Календарь (ручной, до Phase 2)

| День | Действие | ID |
|------|----------|-----|
| D0 | Черновики A1+A2 в admin (`bodySiteMd` + `bodyTelegramMd`) | CONTENT-LCH-3, CONTENT-BRD-4 |
| D0 | Тексты home + описание TG | CONTENT-LCH-1, CONTENT-LCH-2 |
| D1 | Publish A1 на сайт → «Отправить в Telegram» (default channel) | FR-VUE-TG-5 |
| D3 | Publish A2 → TG | |
| D5+ | B1… по 1 посту / 2–3 дня | CONTENT-TG-1 |

Когда появится **BK-TG-QUEUE-1** — перенести B* в tab «Очередь» с `scheduledAt`.

---

## Критерий «готово к анонсу канала»

- [x] ≥2 published guides на сайте *(A1/A2 seed 2026-07-10)*
- [x] У обоих заполнен `bodyTelegramMd`
- [x] Pinned / описание канала (CONTENT-LCH-2) — шаблон в [`telegram-announce-template-v1.md`](./telegram-announce-template-v1.md); telegramBlock в home seed
- [x] Home ведёт на guides + TG (CONTENT-LCH-1)
- [ ] Хотя бы 1 успешный publish в канал через admin *(ручной smoke)*

---

## Следующий шаг сессии

Publish **A1** в Telegram из admin-vue (channel select) → затем A2 через 1–2 дня; пакет B по календарю.
