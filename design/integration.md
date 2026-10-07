# Интеграция дизайна из Figma — план и чеклист

7 октября 2026. Файл: [rowkit × Windows 98](https://www.figma.com/design/hmDfFpjrDP6WtEary6U6SE/rowkit-%C3%97-Windows-98). В скобках — id узла в Figma: ссылка вида `…?node-id=115-588`.

Правило одно: **код соответствует Figma**. Где код и макет расходятся, правим код. Если править код нельзя (доступность, ограничение браузера), пишем это здесь и согласуем с дизайнером. Windows 98 при этом не меняется ни на пиксель: после каждого шага прогоняем pixel-diff по 208 историям.

## Что в файле (инвентаризация)

| Страница                                | Что там                                                                                                            | Статус в коде |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| Foundations (3:36)                      | палитра, «Themes» (114:587), **«Theme decisions» (115:588)** — ответы на бриф и handoff                            | см. шаги 1–2  |
| New tokens (115:742)                    | 4 новых токена                                                                                                     | шаг 1         |
| Icons (3:37)                            | pixel-набор + **Modern icons (117:36516)**: 43 глифа + 6 иконок сайта (142:744)                                    | шаг 3         |
| Brand (165:587)                         | знак, wordmark, logo, иконки, key visual, README/OG-экспорты, гайд «Brand — rowkit» (173:35331)                    | шаг 6         |
| Primitives (3:39)                       | Checkbox, Radio, Scrollbar, TitleBarButton, TitleBar, Separator, ProgressBar, StatusBar, GroupBox — win98 + modern | шаг 4         |
| Button … Tooltip (13 страниц)           | у каждого компонента `theme=win98` и `theme=modern`, плюс «Modern showcase» light/dark                             | шаг 4         |
| Screens (3:57)                          | Users (data/loading/no-results), Form, Overlays — modern light/dark, 1440 и 390                                    | шаг 5         |
| Site — Modern (142:609)                 | 20 компонентов сайта и 26 экранов (light/dark, 1280 и 390)                                                         | шаг 5         |
| Site (3:58)                             | Windows 98-сайт, как сейчас                                                                                        | без изменений |
| Cover, Archive, Brand — pixel (archive) | обложка и архив, в код не идут                                                                                     | —             |

Переменные: `semantic` (117, режимы Windows 98 / Modern Light / Modern Dark), `size` (52), `radius` (8), `type` (13), `brand` (8), эффекты `win98/*`, `modern-light/*`, `modern-dark/*`.

**Сверка переменных уже сделана:** все цвета, размеры, радиусы и шрифтовые размеры совпадают с `packages/tokens`, кроме пунктов шага 1. Тени (эффекты) ещё не сверены.

## Шаг 1. Токены

- [x] `modern/red-text-dark`: `#ff8a8f` → `#ffa0a4` (контраст 4.0 → 4.7:1).
- [x] новый цвет `table-row-hover`. Win98 — `vga-white` (ховера нет), light — `ink-4`, dark — `light-4`.
- [x] новые размеры `badge-px-sm` / `badge-px-md`. Win98 — 4 / 6 (как сейчас `px-1` / `px-1.5`), modern — 7 / 8.
- [x] стиль-переключатель для EmptyState. Одним значением CSS не переключить и раскладку, и выравнивание, поэтому их два: `--rk-empty-direction` (`row` / `column`) и `--rk-empty-align` (`start` / `center`).
- [x] стиль-переключатель порядка кнопок в подвале. Реализован как `--rk-footer-direction`: `row` в Win98, `row-reverse` в modern. Кнопки пишутся основной первой, modern переворачивает их на экране.
- [x] сверены 19 эффектов × 3 режима с `shadow.ts` / `modernLightShadow` / `modernDarkShadow` — совпадают (в Figma слои просто идут в обратном порядке). Popover blur — это `--rk-popover-backdrop`.
- [x] шрифт mono: в Figma стоит Roboto Mono как замена SF Mono. В коде оставляем системный стек — это не расхождение.
- [x] тесты: в `contrast.test.ts` добавлены пары «строка под указателем» и «красная надпись на кнопке».

Токены, которых не было в списке дизайнера, но которые понадобились, чтобы совпало с макетом (в Win98 у всех значение «как было»):

| Токен                                                                 | Win98            | Modern           | Откуда в макете                           |
| --------------------------------------------------------------------- | ---------------- | ---------------- | ----------------------------------------- |
| `size/badge-dot`                                                      | 5px              | 6px              | точка в Badge                             |
| `size/empty-p-sm/md/lg`, `size/empty-gap`                             | 12 / 24 / 24, 16 | 16 / 32 / 48, 12 | отступы EmptyState                        |
| `size/dialog-px`, `dialog-pt`, `dialog-footer-pt`, `dialog-footer-pb` | 12, 12, 8, 12    | 20, 16, 14, 20   | отступы тела и подвала диалога            |
| `style/invalid-width`                                                 | 0                | 1px              | красная рамка поля                        |
| `style/link-decoration`                                               | `underline`      | `none`           | кнопка-ссылка                             |
| `color/field-caret`                                                   | чёрный           | `blue`           | каретка в фокусе поля                     |
| `color/control-primary-latched`                                       | silver           | `blue-active`    | защёлкнутая primary-кнопка                |
| `shadow/latched-ghost`                                                | вдавленная фаска | нет              | ghost-кнопка «on» — только серая подложка |

Вопрос к дизайнеру: в Windows 98-макете кнопка-ссылка тоже без подчёркивания, а в коде Win98 она подчёркнута с первой интеграции. Win98 я не трогаю, пока дизайнер не подтвердит.

## Шаг 2. Handoff — где дизайн отличается от modern.ts (115:588)

|     | Что меняем                                                                                                                                                    | Где в коде                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [x] | Input / Select invalid: рамка 1px `danger-solid` внутри поля плюс иконка (Win98 — только иконка)                                                              | `Input.variants.ts`, `Select`                  |
| [x] | Input readonly: `bg-muted` вместо `bg-card` (в Win98 цвет тот же)                                                                                             | `Input.variants.ts`                            |
| [ ] | ProgressBar: новое значение `indeterminate` — сегмент 30%, едет за 1.2 с; при reduced motion — неподвижная полоса 40%. Для Win98 нужен дизайн (бегущие блоки) | `ProgressBar.vue` — новый API, нужна changeset |
| [ ] | Toast, кнопка закрытия: серый круг 18px (`control-ghost-hover`) с приглушённым ×, а не светофор                                                               | `Toaster`                                      |
| [ ] | FilterChip: капсула `primary-subtle`, рамка `primary-border`, текст `primary-on-subtle` (Win98 — белый чип, серая рамка)                                      | `FilterBar.variants.ts`                        |
| [ ] | Pagination: плоские кнопки, текущая страница на `control-latched`, радиус md                                                                                  | `Pagination`                                   |
| [ ] | Window: без иконки, светофор слева, заголовок по центру, у неактивного окна светофор серый (`caption-inactive`)                                               | `Window`, `captionButton.variants.ts`          |
| [ ] | ButtonGroup: 1px-разделитель между невыбранными сегментами, рядом с выбранным его нет                                                                         | `ButtonGroup`                                  |
| [x] | Button: защёлкнутая primary-кнопка → `control-primary-active`                                                                                                 | `Button.variants.ts`                           |
| [ ] | ScrollArea: ползунок 10px виден всегда, под указателем темнее                                                                                                 | `ScrollArea`                                   |
| [ ] | StatusBar: без линий, секции через 16px                                                                                                                       | `StatusBar`                                    |
| [ ] | DataTable: ховер строки (`table-row-hover`), выбранная строка — сплошной синий на всю ширину                                                                  | `DataTable`                                    |
| [x] | EmptyState: иконка над текстом, текст по центру, описание `muted-foreground`                                                                                  | `EmptyState`                                   |
| [x] | Dialog: порядок кнопок по `--rk-footer-direction`, отступы 20/16/20, фон модалки — чёрный 15% (уже был)                                                       | `DialogFooter` / `Dialog`                      |
| [x] | Badge: отступы по `badge-px-*`, точка 6px                                                                                                                     | `Badge.variants.ts`                            |

Не в этой волне (так решил дизайнер): Switch — волна 2; alert-раскладка диалога — позже, отдельным стиль-переключателем.

## Шаг 3. Иконки

- [ ] Экспортировать 43 глифа (117:36516) как SVG в `packages/ui/src/icons/modern/` под теми же именами. В их числе новый `spinner`: заменить им спиннер в Button loading.
- [ ] Толщина линий по макету: 2.25 для 16px, 1.5 для `-32`, 3 для глифов в контролах. Сейчас в `modern-icons.mjs` стоят 1.75 / 1.5 / 3. Если SVG экспортируются уже с правильной толщиной, `strokeWidth()` убрать.
- [ ] Иконки сайта: sun, moon, auto, menu, sidebar, external (142:744) — в `docs/public/icons` или в компоненты сайта.
- [ ] Lucide больше не нужен: убрать из `THIRD_PARTY_NOTICES.md` и LICENSE в `icons/modern`, если все глифы свои.
- [ ] Тон статусных иконок и папок: свериться с макетом.

## Шаг 4. Компоненты — визуальная сверка один к одному

Для каждого компонента: скриншот Figma (modern light и dark, все варианты) рядом со Storybook в той же теме, на одной сетке, 2×. Расхождения — в список, потом в код.

- [ ] Button (8:2845, showcase 124:1764) — 232 варианта на тему
- [ ] ButtonGroup (33:110, 126:1268)
- [ ] Input (10:1097, 127:38200) — text/search/number/date/password × sm/md/lg × 6 состояний
- [ ] Field (33:2827, 127:38741)
- [ ] Select — Item/Trigger/Content (34:37, 34:176, 34:2553, 128:38328)
- [ ] Badge (34:2690, 129:755)
- [ ] Checkbox, Radio, Scrollbar, TitleBarButton, TitleBar, Separator, ProgressBar, StatusBar, GroupBox (Primitives, showcase 132:38467)
- [ ] DataTable — HeaderCell, Cell, таблица (36:215, 36:439, 37:1254, 138:45595)
- [ ] Pagination (39:47, 39:108, 40:505, 132:39722)
- [ ] FilterBar (41:65, 41:356, 133:1302)
- [ ] EmptyState (35:261, 134:41067)
- [ ] Skeleton (35:530, 134:41164)
- [ ] Dialog (46:657, 136:1851, 137:40604)
- [ ] Toast (49:173, 135:40002)
- [ ] Tooltip (50:27). Modern showcase нет — сверяем по вариантам.

Инструмент: скрипт выгружает PNG вариантов из Figma (`get_screenshot` / экспорт) и склеивает с кадрами Storybook (`.shoot` / `.sheet`). Попиксельно не сравнить: шрифт SF Pro в Figma против системного у нас. Поэтому сравниваем глазами по листу, а размеры проверяем числами — через метаданные Figma и `getBoundingClientRect` в тестах.

## Шаг 5. Сайт и экраны

**Site — Modern (142:609):**

- [ ] Сверить то, что уже есть: MenuBar и MenuBarItem, ThemeSwitcher (6 вариантов), меню rowkit / Components / Data / Scheme, Dock и DockTile (11), Window/Finder, Sidebar, SidebarItem, SearchField, Window/About, Window/LiveDemo, Wallpaper.
- [ ] Сделать новое:
  - Spotlight — поиск в трёх состояниях: пустой, результаты, ничего не найдено. Сейчас поиск — окно Find.
  - Alert/NotFound — 404.
  - Content/ThemesPage — страница тем по макету.
  - Экран «Theme switch».
  - Tokens page.
- [ ] Мобильные 390: Home и Component page.
- [ ] Цвета кода `site/code-*` и обои `site/wallpaper-a/b/c`: сверить с `syntax.ts` и `modern.css`.

**Screens (3:57):**

- [ ] Users (data / loading / no-results), Form New user, Overlays stack — modern light/dark, 1440 и 390. Сверить со страницами Patterns и с play-тестами Storybook.

## Шаг 6. Бренд (165:587, гайд 173:35331)

- [ ] Экспорт по таблице «Files — docs/public». Имена и размеры те же, поэтому код сайта и Storybook почти не меняется:
  - `mark.svg`, `mark-light.svg`, `mark-48.svg`, `mark-16.svg`, `mark-16-mono.svg`, `mark-32-mono.svg`;
  - `wordmark.svg`, `wordmark-light.svg`, `logo.svg`, `logo-light.svg`;
  - `favicon.ico` и `favicon-16/32/48.png`, `apple-touch-icon.png`;
  - `og-image.png`, `readme/github-social-preview.png`, `readme/hero.png` и `hero-dark.png` (через `<picture>`), `readme/datatable.png`, `components.png`, `docs.png`.
- [ ] Логотип Storybook (`brand/logo-storybook`, высота 24).
- [ ] `theme-color`: `#FAFAF8` для light и `#111114` для dark через media — вместо `#000080` в `config.ts`.
- [ ] Знак внутри тем сайта, как app-иконка:
  - Win98 — пиксельные `brand/reading/win98-32` и `-16` на рабочий стол и в «Пуск»;
  - Modern — `modern-tile` и Dock-иконка 1024.
- [ ] Полоса в меню «Пуск» (`wordmark alone`): заменить старый `start-strip`.
- [ ] README: hero с `<picture>` light/dark и новые картинки. Экспорты `datatable` / `components` / `docs` — это рамки под настоящие скриншоты: снимаем их со сторибука и сайта.
- [ ] Onest (OFL) — только для бренд-графики. В UI-темы он не идёт.

## Шаг 7. Документация и выпуск

- [ ] Changeset: новые токены, `ProgressBar indeterminate`, изменения modern. `@rowkit/tokens` — minor, `rowkit` — minor.
- [ ] Страница Themes и Tokens на сайте — новые токены. AGENTS.md — новые стиль-переключатели.
- [ ] README GIF тем — переснять после шагов 2–5.
- [ ] Отметить в Figma (обложка или Theme decisions), что handoff принят.

## Проверки после каждого шага

- Windows 98: pixel-diff 208/208 против `shots-base`. Сайт Win98 — без изменений.
- `pnpm test`, `test:a11y`, `test:a11y:modern`, lint, typecheck, size-limit.
- Modern: лист «Figma | код» по затронутым компонентам, light и dark.

## Порядок и объём

Шаги 1 → 2 → 3 → 4 идут друг за другом: токены нужны компонентам, иконки нужны сверке. Шаги 5 и 6 независимы. Один шаг — один коммит или серия коммитов. Ветку предлагаю отдельную от `feat/themes`, например `feat/design-handoff`: так PR тем можно открыть уже сейчас, а интеграция пойдёт следующим PR.
