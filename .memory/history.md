# Site history (local)

> Локальный лог `site/`. **Не** копия platform `memory/project/history.md`.  
> Шаблон: date · role · change · impact · reason.

## 2026-07-23 — Home mobile density (Frontend)

**Role**: Frontend  
**Change**: Mobile denser home — smaller item/section titles in «Новости», «Последние гайды», «База знаний»; tighter `py`/`space-y`/`p` between blocks and cards.  
**Impact**: Less empty vertical space on phones; desktop sizes largely unchanged (`sm:`).  
**Reason**: User reported sparse mobile layout on main page.

## 2026-07-23 — SITE-CAL-2: denser home + favorable days (Frontend)

**Role**: Frontend  
**Change**: Compact home moon grid tightened; hardcoded day markers (`lib/moon-favorable-days.ts`) with icons for посадка / полив / подкормка / урожай / уход; legend + day-panel chips.  
**Impact**: Home calendar reads as a teaser with clear work cues; data is demo-only until CMS.  
**Reason**: User asked for smaller home calendar and presentation favorable-day icons.

## 2026-07-23 — SITE-CAL-2: larger moon + emoji favorable (Frontend)

**Role**: Frontend  
**Change**: Moon phase icons slightly larger; favorable markers switched to color emoji (🌱💧🧪🌾🧤) with bigger cell/legend sizes.  
**Impact**: Home/calendar markers read clearer for presentation.  
**Reason**: User asked for bigger moon/favorable icons and colorized emoji.

## 2026-07-23 — SITE-CAL-2: soft green/red day tones (Frontend)

**Role**: Frontend  
**Change**: Cells tinted by moon-phase tone — waxing = soft green (favorable), new/full/waning = soft red (unfavorable); legend swatches + day-panel label.  
**Impact**: Quick scan of good/bad lunar days on home and `/calendar`.  
**Reason**: User asked for red/green favorable coloring with soft opacity.

## 2026-07-23 — SITE-1: static export pre-VPS (Frontend)

**Role**: Frontend  
**Change**: `output: 'export'` (default; `SITE_STATIC_EXPORT=0` for Node); `images.unoptimized` + trailingSlash; drop page ISR; culture `?label=` client-side; `out/` via `npm run build:static`.  
**Impact**: Full static HTML site in `out/` for CDN/file hosting before VPS; rebuild to refresh CMS data.  
**Reason**: Represent public site without Node server until VPS.

## 2026-07-23 — SITE-CAL-2: compact lunar on home (Frontend)

**Role**: Frontend  
**Change**: `MoonCalendar` `variant="compact"` + `HomeLunarCalendar` after «Последние гайды»; home loads CMS moon entries from calendar page.  
**Impact**: Main page shows dense month grid with link to `/calendar`; day info stacks under grid.  
**Reason**: User asked for compact lunar calendar copy on home after Last Guides.

## 2026-07-23 — SITE-USEFUL-3: social-api + mock fallback (Frontend)

**Role**: Frontend  
**Change**: `lib/social-api.ts` → social-service :3014; guide + `/useful` resolve live engagement with hardcoded mock fallback; env `SOCIAL_GRAPHQL_URL`.  
**Impact**: Direct site→social path per ADR-0020; UI works offline social / without discussionId.  
**Reason**: Connect points; keep mocks until full mint + auth write.

## 2026-07-23 — SITE-USEFUL-3: discussionId mocks (Frontend)

**Role**: Frontend  
**Change**: `lib/engagement.ts` → discussion-centric DTOs + mocks; guide/`useful` feed use `discussionId` when present (still hardcoded until BFF live).  
**Impact**: UI contract matches ADR-0020; ready to swap mocks → BFF GraphQL later.  
**Reason**: Social for site first; nest SocialModule is proxy only.

## 2026-07-23 — Lunar howto guide on `/calendar` (Frontend)

**Role**: Frontend  
**Change**: Section `calendarLunarGuide` — compact RU phases/tips/zodiac (with ♈…♓); SVGs `public/calendar/moon-phase-*.svg`; `LunarGuide` below grid; Nest seed + admin preserve extras.  
**Impact**: `/calendar` shows how-to guide even without CMS; seed republish updates content_db.  
**Reason**: User asked for compact lunar howto + phase images + zodiac symbols.

## 2026-07-22 — Soft borders: theme opacity + dark (Frontend)

**Role**: Frontend  
**Change**: Tailwind theme colors use `color-mix` + `<alpha-value>` so `/opacity` works; dark `outline-variant` cooler; culture tags + chrome/chips use softer `dark:border-*`.  
**Impact**: Borders/tags no longer fall back to harsh `currentColor`; dark theme edges match glass-panel softness site-wide.  
**Reason**: `/15` etc. were ignored on CSS-var colors; culture tags and list cards looked high-contrast in dark.

## 2026-07-22 — SITE-CAL-2: moonlit header trial (Frontend)

**Role**: Frontend  
**Change**: Active `/calendar` header → `moon-calendar-header-moonlit.png`; previous garden kept as `moon-calendar-header-garden-saved.png`.  
**Impact**: New moon+garden look to compare; prior art preserved for swap-back.  
**Reason**: User liked previous image — save for next; try another similar theme.

## 2026-07-22 — Home news/guides: local previews (Frontend)

**Role**: Frontend  
**Change**: `HomeNewsUpdates` title → «Новости и обновления» (nav «Последнее» unchanged); `HomeLatest` uses `getGuidePreviewImage`; crop + journal thumbs → `public/previews/*.jpg` (no Unsplash).  
**Impact**: Home news and latest guides show real thumbnails even when CMS covers are null / remote CDNs fail.  
**Reason**: User asked to fix missing previews and restore news block title.

## 2026-07-22 — Item media gallery + lightbox (Frontend)

**Role**: Frontend  
**Change**: `ItemMediaGallery` — transparent dashed placeholder with icon when no cover; click opens full-size lightbox. Wired in `HomeLatest` (real cover only) and useful feed image/guide media.  
**Impact**: List thumbs no longer use solid empty boxes; covers expand without leaving the page.  
**Reason**: User asked for item gallery with placeholder icon and full view on click.

## 2026-07-22 — Soft borders site-wide (Frontend)

**Role**: Frontend  
**Change**: Tailwind theme colors via `color-mix` + `<alpha-value>` so `/opacity` works; cooler dark `outline-variant`; soft `dark:` borders on culture tags, home cards, header/chrome, chips, guides.  
**Impact**: Dark theme borders no longer fall back to harsh `currentColor`; culture tags and similar UI match softer panel edges.  
**Reason**: Opacity modifiers on CSS-var colors were ignored; user asked to adapt culture-tag softness site-wide.

## 2026-07-22 — SITE-HOME-NEWS-1: label «Последнее» (Frontend)

**Role**: Frontend  
**Change**: Nav + home news block title: «Новости и обновления» → «Последнее» (`site-nav`, `HomeNewsUpdates`).  
**Impact**: Header and home section share the shorter label again.  
**Reason**: User rename request.

## 2026-07-22 — SITE-1: `/app` placeholder (Frontend)

**Role**: Frontend  
**Change**: Added coming-soon page at `/app` (`app/app/page.tsx`) — glass card with Telegram and guides CTAs.  
**Impact**: Footer/home «Приложение — скоро» links resolve instead of 404.  
**Reason**: User asked for an `/app` placeholder while full app routing stays paused.

## 2026-07-22 — SITE-HOME-NEWS-1: news on home + nav (Frontend)

**Role**: Frontend  
**Change**: Home — `#news-updates` + «Последние гайды» stacked left; cultures sidebar right (`lg` 2-col). Nav «Новости и обновления» → `/#news-updates`.  
**Impact**: Menu lands on news; guides + cultures share one home grid.  
**Reason**: User asked for news & updates on main page; later for two-column split with cultures on the right.

## 2026-07-22 — SITE-CAL-2: moon header gradient polish (Frontend)

**Role**: Frontend  
**Change**: Replaced milky stacked beige overlays with mask dissolve + light title-zone veil.  
**Impact**: Garden stays clear; text still readable.  
**Reason**: User said previous gradient looked bad.

## 2026-07-22 — SITE-CAL-2: moon header full-bleed garden fade (Frontend)

**Role**: Frontend  
**Change**: `/calendar` header — new garden image full container under titles; vertical+horizontal page-bg gradients fade art beneath text; extra bottom padding to reveal shovel/plants.  
**Impact**: Softer branded header; text stays readable.  
**Reason**: User asked under-title full-bleed image with fade and more bottom show.

## 2026-07-22 — SITE-CAL-2: moon calendar header caricature (Frontend)

**Role**: Frontend  
**Change**: `/calendar` header — decorative caricature (plants + shovel + crescent) via `public/moon-calendar-plants-shovel.png`; flex layout with copy + art.  
**Impact**: Garden personality on moon calendar page without changing grid UX.  
**Reason**: User asked to add plants-with-shovel caricature for moon calendar.

## 2026-07-22 — SITE-CAL-2: seasons calendar UI disabled (Frontend)

**Role**: Frontend  
**Change**: `/calendar` — removed moon|seasons mode switch; page shows moon calendar only. Default intro/meta copy moon-only; seasons CMS parse kept in `lib/calendar-sections.ts`.  
**Impact**: No seasons tab or list on public calendar.  
**Reason**: User asked to disable season calendar on `/calendar`.

## 2026-07-22 — SITE-USEFUL-4: unified feed from prototype (Frontend)

**Role**: Frontend  
**Change**: `/useful` — left sticky filters (Все / Гайды / Фото / Таймлапс) + central social cards combining video, image, guide; right prototype rail omitted; removed separate TikTok/photo/guides sections.  
**Impact**: One readable community feed with type filters; demos when galleries empty.  
**Reason**: User asked to port `prototypes/useful-feed` center + left filters, cut right sidebar.

## 2026-07-22 — SITE-CAL-2: panel in-calendar + table expand (Frontend)

**Role**: Frontend  
**Change**: Grid day panel is `absolute` top-right inside calendar stage (not viewport-fixed). Table mode expands the clicked row for day info — no floating panel.  
**Impact**: Detail UX matches mode.  
**Reason**: User asked panel scoped to calendar; table uses expand, not float.

## 2026-07-22 — SITE-CAL-2: moon table + floating day panel (Frontend)

**Role**: Frontend  
**Change**: Moon «Таблица» — full-month rows (day, weekday, phase, lunar day, illumination, note); click toggles day panel. Day info moved to fixed top-right floating glass panel (theme tokens).  
**Impact**: List mode is data table; inspector no longer inline under grid.  
**Reason**: User asked table view + fixed top-right day block with collapse on re-click.

## 2026-07-22 — SITE-CAL-2: moon month grid from prototype (Frontend)

**Role**: Frontend  
**Change**: `/calendar` moon mode — month grid + Сетка/Список + day detail panel from `prototypes/moon-calendar` layout/styles; approximate phase icons via `lib/moon-phase.ts`; CMS entries overlay notes/phases. Skipped prototype app shell (top nav, fixed right inspector, bottom app nav).  
**Impact**: Public calendar matches prototype grid look inside site chrome.  
**Reason**: User asked to reuse calendar layout/styles, not app shell.

## 2026-07-22 — SITE-USEFUL-3: social «Полезное» (Frontend)

**Role**: Frontend  
**Change**: `/useful` restructured — TikTok-like infinite video feed, photo gallery with comments, guides with tag filters + likes/comments (card/list); guide article EngagementBar + CommentsList; hardcoded contract-shaped mocks in `lib/engagement.ts`. Drafted platform [`ARCH-ENGAGE-1`](../../memory/tasks/cards/ARCH-ENGAGE-1.md) / [`BK-ENGAGE-1`](../../memory/tasks/cards/BK-ENGAGE-1.md) (not hub WIP). Removed knowledge-section chips from useful page.  
**Impact**: Sociable useful chapter demoable; real API needs architect/backend confirm.  
**Reason**: User asked for social feed + comments/likes UI prepared for backend.

## 2026-07-22 — SITE-USEFUL-2: «Полезное» sections + nav (Frontend)

**Role**: Frontend  
**Change**: `/useful` — video + image galleries (`publishedUsefulGalleries`), tags chips with filter, guides «Полезное» with card/list toggle (`UsefulGuidesSection`); compact gallery cards; header + footer link «Полезное».  
**Impact**: Public chapter complete for site UI; galleries fill via admin + content env ids.  
**Reason**: Resume SITE-USEFUL-2 after calendar; user asked for galleries, tags, guides views, nav.

## 2026-07-22 — Calendar slice shipped (Frontend / Backend)

**Role**: Frontend / Backend  
**Change**: SITE-CAL-1 — `/calendar` with moon|seasons switch, CMS parse, header+footer. BK-CONTENT-CAL-1 — seed `SitePage` key `calendar` in `seed-site-content.ts`. FR-VUE-CAL-1 — admin-vue Content → Календарь editor. Cards closed for this slice.  
**Impact**: Public calendar live with CMS SoT; editors can publish copy + data without new GraphQL.  
**Reason**: Parallel implement per user; independent of app / future Smart Botanik Seasons.

## 2026-07-22 — Calendar track: SITE-CAL-1 focus (Lead / Architect)

**Role**: Lead / Architect  
**Change**: Drafted [`SITE-CAL-1`](./tasks/cards/SITE-CAL-1.md) (site `/calendar`, header+footer, CMS data); platform [`BK-CONTENT-CAL-1`](../../memory/tasks/cards/BK-CONTENT-CAL-1.md) (seed + sections contract) and [`FR-VUE-CAL-1`](../../memory/tasks/cards/FR-VUE-CAL-1.md) (Vue editor). SITE-CAL-1 → site active WIP; SITE-USEFUL-2 paused. Independent of app diary widgets; future merge = Smart Botanik Seasons.  
**Impact**: Clear calendar workstream with CMS SoT and cross-project handoffs.  
**Reason**: User chose calendar over galleries; CMS for data; nav in header+footer; keep independent of app.

## 2026-07-22 — `/useful` photo/video sections (Frontend)

**Role**: Frontend  
**Change**: `UsefulPageContent` — sections Видео / Фото / гайды; `fetchPublishedGallery` via BFF; env `SITE_USEFUL_*_GALLERY_ID`.  
**Impact**: SITE-USEFUL-2 layout live; empty states until galleries published.  
**Reason**: ADR-0019 implementation.

## 2026-07-22 — ARCH decided: useful galleries via content→media (Architect)

**Role**: Architect  
**Change**: [`SITE-USEFUL-2`](./tasks/cards/SITE-USEFUL-2.md) updated — one image + one video gallery **id**; site port → content hydrate from media; ARCH-MEDIA-TAX-1 / ADR-0019 locked. Stub sections still OK before BK-CONTENT-GALLERY-1.  
**Impact**: Clear contract for `/useful` media sections without edges on gallery load.  
**Reason**: ARCH talk close-out.

## 2026-07-22 — Полезное: tasks for media sections (Lead / Frontend)


**Role**: Lead / Frontend  
**Change**: Drafted [`SITE-USEFUL-2`](./tasks/cards/SITE-USEFUL-2.md) (site sections: video / photo / guides); platform cards [`ARCH-MEDIA-TAX-1`](../../memory/tasks/cards/ARCH-MEDIA-TAX-1.md) (Media + taxonomy + caption talk) and [`FR-VUE-MEDIA-1`](../../memory/tasks/cards/FR-VUE-MEDIA-1.md) (admin-vue upload). Linked from SITE-USEFUL-1 / ADMIN-VUE-1 Phase 3. Not enqueued to hub WIP.  
**Impact**: Clear handoff chain for richer `/useful` without blocking SITE-1.  
**Reason**: User asked for Полезное (video/photo/guides) and tasks across admin-vue + architecture + site.

## 2026-07-22 — Latest: keep glass, restore guide cards (Frontend)

**Role**: Frontend  
**Change**: `HomeLatest` keeps `glass-effect` shell; guide rows restored to previous card style (large thumb, crop pill, excerpt). Card: SITE-HOME-LATEST-1.  
**Impact**: Home Latest stays visually paired with Cultures panel; content cards read as before.  
**Reason**: User asked to keep card background but return prior card styles.

## 2026-07-22 — `/guides` tabs reuse culture LOGO PNG (Frontend)

**Role**: Frontend  
**Change**: `loadCulturePresentations` merges `publishedCultureOptions.icon`; `/guides` culture pills use `CultureThumbnail` `variant="inline"` (LOGO PNG → emoji).  
**Impact**: Same chip icons as home sidebar on the guides catalog tabs.  
**Reason**: Reuse published LOGO PNG instead of hardcoded DEFAULT_CULTURES emoji.

## 2026-07-22 — Knowledge sections off `/guides` (Frontend)

**Role**: Frontend  
**Change**: Planted SITE-GUIDES-TRIM-1 / SITE-USEFUL-1 / SITE-PRESERVE-1 / SITE-REPORTS-1. `/guides` shows only «Выращивание»; new pages `/useful`, `/preserving`, `/reports`; removed «Полезное» from header and home block; section chips + footer/home links updated.  
**Impact**: Clearer IA — growing catalog vs dedicated knowledge hubs.  
**Reason**: User request to move Закрутка / Репорты / Полезное out of `/guides` and make Полезное its own page off the main menu.

## 2026-07-22 — Latest section glass card + sidebar rows (Frontend)

**Role**: Frontend  
**Change**: `HomeLatest` wrapped in the same `glass-effect` card as `HomeSidebarCultures`; guide rows use thumb + title + culture/date chips + chevron. Card: SITE-HOME-LATEST-1.  
**Impact**: Home Latest and Cultures columns share one visual layout language.  
**Reason**: Requested matching sidebar card layout for Latest content.

## 2026-07-22 — Cucumber sidebar popular tags (Frontend)

**Role**: Frontend  
**Change**: `crop.cucumber` popular seeds → `crop.cucumber.gherkin` (Корнишоны), `crop.cucumber.chinese` (Китайские); was self_pollinated + parthenocarpic, then briefly gherkin + self_pollinated.  
**Impact**: Main sidebar cucumber chips show Корнишоны / Китайские.  
**Reason**: Requested tag swap for cucumber culture list.

## 2026-07-22 — `/guides` interactive culture + tomato filters (Frontend)

**Role**: Frontend  
**Change**: Culture select on `/guides` without redirect — `CulturePresentationBlock` (photos, lead/about, popular tags); tomato chips Подкормка/Уборка/Засев/Розовые/Детерминантные; filter bar shows culture + label; URL `?culture=&label=`.  
**Impact**: Instant culture presentation + client-side guide filtering; hub filters also show culture chip.  
**Reason**: Interactive catalog moments before (or instead of) full hub navigation.

## 2026-07-22 — Culture presentation TEXT tomato/cucumber (Frontend)

**Role**: Frontend  
**Change**: Extended `culture_tag` TEXT (`about_short` in contracts); admin CultureFacetEditor fields hub_title/lead/about/seo; seed copy for `crop.tomato` + `crop.cucumber`; site hub renders `aboutShort` + SEO metadata. Card: SITE-CULT-TXT-1.  
**Impact**: `/guides/kultury/tomat` and `/ogurec` can show richer presentation text after reseed/publish.  
**Reason**: Presentation pages via existing TagSurface TEXT facets, not a new page type.

## 2026-07-22 — Guide catalog card/list layouts (Frontend)

**Role**: Frontend  
**Change**: `/guides` — layout toggle Карточки / Список; `GuidePreviewCard` `layout="card"|"list"`; preference in `localStorage` (`site.guides.layout`). List = fixed 88px rows.  
**Impact**: Users can switch dense list vs card grid on knowledge sections.  
**Reason**: Requested card + list versions of guide previews.

## 2026-07-22 — Guide preview card sizes (Frontend)

**Role**: Frontend  
**Change**: `GuidePreviewCard` — size ladder `small` / `middle` / `big` (+ `auto`); `/guides` catalog uses `middle` with **fixed height** (168px) + overflow clip so all cards match.  
**Impact**: Uniform card row height on `/guides`; no growth from long excerpt/tags.  
**Reason**: Standardize preview cards; one height reads cleaner than content-driven sizes.

## 2026-07-22 — Pumpkin popular tags (Frontend)

**Role**: Frontend  
**Change**: `crop.pumpkin` → `crop.pumpkin.butternut`, `crop.pumpkin.muscat` (max 2).  
**Impact**: Тыква sidebar/hub chips show Баттернат / Мускатная; seed gap noted on SITE-1.  
**Reason**: Complete per-culture popular tag map.

## 2026-07-22 — Culture-specific popular tags, max 2 (Frontend)

**Role**: Frontend  
**Change**: Replaced shared environment popular tags with per-culture taxonomy chips (max 2): tomato/cucumber/pepper/cabbage/zucchini variants + potato `guides.spraying`/`guides.landing`. Wired sidebar + hub label filters.  
**Impact**: Culture list shows crop-specific labels; `crop.pumpkin` has none. Missing seed keys noted on SITE-1 → propose TAX-SEED-CULTURE-VAR-1.  
**Reason**: Explicit per-culture tag rules (max 2).

## 2026-07-22 — Taxonomy directory: edit label (Frontend)

**Role**: Frontend  
**Change**: В `admin-vue` справочник таксономии — правка тегов только по `label`; разделы (scopes) только create («Добавить раздел»), без update.  
**Impact**: `/entities/taxonomy` — кнопка «Изменить» в таблицах/графе; edge cases: key/namespace read-only, parent отдельно.  
**Reason**: Явный запрос на edit items; реализовано в owner-проекте admin-vue (не site UI).

## 2026-07-22 — Tomato PNG LOGO: site retest fail → CE-CHIP-PNG-1 (Frontend)

**Role**: Frontend  
**Change**: Checked `crop.tomato` PNG LOGO on public BFF; `publishedCultureOptions` has no MEDIA icon; `publishedContentFacets` 404 (no published profile). Persisted on SITE-1; owner card [`CE-CHIP-PNG-1`](../../services/content-edges/.memory/tasks/cards/CE-CHIP-PNG-1.md) in content-edges.  
**Impact**: Site consumer ready; blocked on edges publish/LOGO. User delegates to content-edges.  
**Reason**: Cross-project handoff — finder retest, owner card, no silent fix outside site.

## 2026-07-20 — Culture sidebar icons: LOGO → emoji, no preview (Frontend)

**Role**: Frontend  
**Change**: `CultureThumbnail` — только SVG/LOGO (`icon.MEDIA`), иначе chip emoji; `option.preview` (IMAGE_M/PREVIEW) больше не используется.  
**Impact**: Sidebar «Культуры» на главной показывает иконку/emoji, не фото-превью.  
**Reason**: Приоритет источников: svg icon → chip icon; preview не для списка культур.

## 2026-07-17 — Outbound handoff rule (Architect)

**Role**: Architect  
**Change**: Rule `site-cross-project-handoff.mdc` + AGENTS.md: on out-of-site fixes, create owner task cards, ask before hub WIP, delegate to another project/window.  
**Impact**: Cross-service blockers persist as cards, not chat-only.  
**Reason**: Site isolation — taxonomy/content/BFF changes owned elsewhere.

## 2026-07-17 — Culture list: popular taxonomy labels (Frontend)

**Role**: Frontend  
**Change**: Shared popular taxonomy labels (Грядка / Гроубокс / Теплица, max 3) reused on every culture; sidebar chips + hub filter merge; `crop.pumpkin` in contracts hub slugs + taxonomy seed.  
**Impact**: Culture list shows taxonomy labels; same popular tags on all cultures.  
**Reason**: Extend culture list beyond crop name; cross-cutting placement tags.

## 2026-07-17 — Культуры: 6 пунктов несмотря на CMS (Frontend)

**Role**: Frontend  
**Change**: `resolveCultureTagKeys` — CMS `cultureTagKeys` может reorder/extend, но не отрезает site defaults (Капуста, Тыква).  
**Impact**: Sidebar «Культуры» всегда ≥6 (полный `DEFAULT_CULTURES`).  
**Reason**: Published home держал только 4 ключа — список выглядел урезанным.

## 2026-07-17 — Культуры: Тыква в дефолтном наборе (Frontend)

**Role**: Frontend  
**Change**: В `DEFAULT_CULTURES` добавлена **Тыква** (`crop.pumpkin` / `tykva`); Капуста уже была.  
**Impact**: Sidebar «Культуры», каталог и hub slug gen включают тыкву.  
**Reason**: Расширение набора культур; иконки пока emoji-fallback (Перец = 🌶️).

## 2026-07-17 — Home nav: Последнее + Полезное (Frontend)

**Role**: Frontend  
**Change**: Header — убран «Репорты», добавлен «Последнее» → `/#latest`; на главной после «Последнее» — секция «Полезное» (тот же блок, что на `/guides`).  
**Impact**: Короче меню; быстрый переход к свежим материалам; полезные подборки на home.  
**Reason**: UX nav / home composition.

## 2026-07-11 — FR-SITE-HUB-1 wired: TagSurface hub (Frontend)

**Role**: Frontend · Backend  
**Change**: Hub pages consume `publishedTagSurface`; facets lead/preview; BK-CF-2 BFF gateway.  
**Impact**: Culture hubs не зависят от отдельных cropKind queries.  
**Reason**: FR-SITE-HUB-1 implementation slice.

## 2026-07-11 — FR-SITE-HUB-1: hub pages task (Architect)

**Role**: Architect  
**Change**: Card [`FR-SITE-HUB-1`](./tasks/cards/FR-SITE-HUB-1.md) — `/guides/kultury/[crop]` via `publishedTagSurface`; hub focus; depends on platform **BK-CF-2**.  
**Impact**: Явный следующий frontend slice после culture sidebar.  
**Reason**: ADR-0015 Phase 2; composed hub surface.

## 2026-07-11 — Memory pilot: site/.memory (Architect)

**Role**: Architect  
**Change**: Добавлен минимальный AI env: `hub`, `active`, `cards/SITE-1`, local `history`, content docs; todos = cards (без Obsidian kanban). Platform stubs указывают сюда.  
**Impact**: Сессии по site читают только `.memory/`; путь к выносу nested `growing-site`.  
**Reason**: Декомпозиция brain; экономия токенов.

## 2026-07-10 — Home + launch guides (Content · Frontend)

**Role**: Content · Frontend  
**Change**: Home hero/CTA/telegramBlock; guides A1/A2; culture sidebar via facets API.  
**Impact**: Pre-launch контент на сайте готов; next — TG smoke A1.  
**Reason**: CONTENT-LCH + FR-SITE-CF-1 (деталь в platform history при nested).
