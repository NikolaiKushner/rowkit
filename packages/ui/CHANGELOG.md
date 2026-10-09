# rowkit

## 1.0.0-beta.2

### Minor Changes

- 4aa7b3d: **The modern theme's icons draw a lighter line**, as the design now has them: about 1.2px at 16px instead of 1.5px (stroke 1.75 on the 24 grid, was 2.25), the caption and check glyphs 2.5 (was 3), the 32px icons 1.25 (was 1.5). The shapes are unchanged; Windows 98's pixel icons are untouched.

### Patch Changes

- @rowkit/tokens@1.0.0-beta.2

## 1.0.0-beta.1

### Minor Changes

- 2202238: **The modern theme now follows its finished design.** Badges, fields, dialogs, empty states, filter chips, the pager, status bars, toasts, tables, group boxes and selects take the designer's sizes and colours; each difference is a token, so Windows 98 is unchanged.

  - **`ProgressBar` without a `value` is indeterminate.** Leave `value` out, or pass `null`, while the amount of work is unknown: a segment travels along the track (`--rk-animate-progress`, `--spacing-progress-segment`). In Windows 98 it is four blocks stepping one block every 100ms, starting again at the left; with reduced motion it stands still in the middle of the track, in every theme. `aria-valuenow` is left off, as ARIA asks.
  - **Select options show a check mark** beside the selected one, in every theme, as the design draws it. The read-only value is no longer highlighted while the list is open, and the drop button stays pressed in until it closes.
  - **Pagination keeps the rows-per-page control beside the page buttons**, at the end of the row, as the design places it. Its label is now `Rows per page:`, with the colon both designs draw.
  - **A `ProgressBar`'s blocks sit centred in the track**, 3px from the top in Windows 98, as the Figma file draws them (they were 1px higher).
  - **A link button in the modern theme is underlined under the pointer and on focus**, and plain at rest; Windows 98 underlines it always. Its focus ring hugs the text rather than the full button height.
  - **A searchable Select is searched in a box at the top of its list**, as the design draws it in both themes, rather than by typing into the control. The box takes focus as the list opens; the arrows, Enter, Escape and Tab work from it, and closing brings focus back to the control. A letter typed on the closed control opens the list and starts the search. The control is now always read-only. `SelectContent` takes `searchLabel` (default `Search`) to name the box. The magnifier in a search field is the subtle text colour in the modern theme.
  - **Select's dropped list says what it is doing:** «Loading…» carries Windows 98's hourglass or the modern spinner, and an empty search says «No results found» (the new default `emptyText`). In Windows 98 the options sit 1px inside the list's border, as the design draws them; the modern list is ringed by its shadow alone (`--rk-popover-border-width`).
  - **Buttons inside fields take the design's height in both themes**: 17, 19 and 23px at `sm`, `md` and `lg`, centred, for a number field's spin buttons, a date field's drop button and a select's arrows (`--spacing-field-button-h-sm`, `-h`, `-h-lg`). In Windows 98 they no longer fill the well. In the modern theme they sit 4px from the right edge, a select's arrows 6px (`--spacing-field-button-pr`, `--spacing-select-pr`).
  - **Number and date fields, modern:** 9px spin arrows in the muted colour, and a calendar glyph on a date field (`--spacing-field-drop-icon`).
  - **Pagination takes the design's measurements in both themes:** the rows-per-page select is the small one at every size, 56px wide, 6px from its label, which is centred on it; the arrows are their own size (8px pixel triangles in Windows 98, which were drawn at double size, 10px chevrons in modern); the ellipsis is just the character; the dotted focus ring hugs a page label (`--spacing-pager-arrow`, `--spacing-pager-focus-px`); a small page button in Windows 98 hugs its number (`--spacing-pager-min-sm`). A disabled pager draws the current page like the others and greys the ellipsis.
  - **Option buttons and check boxes, modern:** the label sits 8px from the box, as drawn (`--spacing-check-gap`, `--spacing-check-label-px`); a held option button fills with the pressed control colour (blue when checked); a disabled check box keeps its edge.
  - **New tokens:** colours `loading-foreground`, `select-search`, `table-row-hover`, `field-caret`, `field-highlight`, `on-field-highlight`, `control-primary-latched`, `filter-bar`, `chip`, `chip-border`, `chip-foreground`, `chip-remove`, `pager`, `pager-hover`, `pager-active`, `toast-close`, `toast-close-foreground`; shadows `latched-ghost`, `field-button-pressed`, `pager`, `pager-focus`, `pager-pressed`, `toast-close`, `checked-selected`; sizes for badges, dialogs, empty states, fields, filter bars, pagers, status bars, tables, toasts and select options; style switches `--rk-empty-direction`, `--rk-empty-align`, `--rk-footer-direction`, `--rk-invalid-width`, `--rk-field-error-align`, `--rk-link-decoration`, `--rk-legend-weight`, `--rk-titlebar-icon`, `--rk-animate-progress`.
  - **An `EmptyState` at `lg` keeps the heading size of `md`** (16px in Windows 98). It was a pixel smaller, a slip from the move to Large Fonts; the design is corrected too.
  - **Modern, dark:** destructive text is brighter (`#ffa0a4`, 4.7:1 on a control).
  - **The modern theme's icons are its designer's own**, exported from the Figma file. A loading button turns a spinner in the modern theme (`--rk-animate-busy`; Windows 98's hourglass stands still), and a select shows up and down arrows there.
  - **A new brand.** The package READMEs show the new mark and hero picture, light or dark by the reader's scheme, and the npm badge in the brand's vermilion.
  - **`@rowkit/tokens/reference`: every token a theme sets, described.** `tokenReference` lists each CSS variable with what it is for, the components that read it and its value in Windows 98 and the modern theme's light and dark schemes. The descriptions are the comments beside the values, so they cannot drift; a separate entry point, so importing the tokens does not ship them.

- d1f5412: **`rowkit/theme`: make a theme of your own with nothing else to install.** `import { defineTheme } from 'rowkit/theme'` gives you `defineTheme()`, `themeRule()` and the themes' values from the tokens rowkit itself depends on, so the theme always matches the components you render. A pnpm project could not import `@rowkit/tokens` without adding it to its own dependencies, at a version that could drift from rowkit's; it no longer needs to. `@rowkit/tokens` keeps the same functions for projects that use the tokens without the components.

  - **Theme values are typed by token name.** `defineTheme()` takes `ThemeValues`: every variable a theme may set, by name (`ThemeTokenName`), so an editor completes them and a typo such as `'--color-brnad'` fails the type check, not only the run. Values built at run time as a plain record are still accepted, and an unknown name still throws.

- 2c99177: **A second theme: modern, in light and dark.** Put `data-theme="modern"` on `<html>` (or any element) and rowkit draws the look of a current desktop operating system — white and grey surfaces, a blue accent, rounded corners, soft shadows, a ring around the focused control, short transitions and outline icons. It follows the system's dark setting; `data-color-scheme="light"` or `"dark"` fixes it. This is where dark comes back after beta.0 removed it: as a scheme of the modern theme, still with no `.dark` class and no `dark:` variant. Without an attribute, Windows 98 is still the default, with its one light scheme.

  - **Every component now reads its look from tokens.** New role colours (`control`, `control-primary`, `checked`, `popover`, `table-header`, `track`, `caption-*` and more), size tokens in the spacing namespace (`h-control-md`, `size-check`, `h-row-md`), a `pill` radius, a `strong` font weight, and `--rk-*` style switches for how a theme draws a state. Themes nest: a `data-theme="win98"` region inside a modern page is Windows 98.
  - **Shadow tokens are now variables a theme can set.** `--shadow-*` in `@theme` points at `--rk-shadow-*`, which holds the value. If you override a shadow, override `--rk-shadow-<name>`.
  - **New utilities in `rowkit/styles`:** `focus-label`, `focus-ring`, `focus-outer`, `bg-loading`, and `scrollbar-themed` (`scrollbar-win98` still works).
  - **Icons carry `data-icon`**, and the stylesheet includes the modern theme's outline glyphs, applied by CSS only inside that theme.
  - **Make a theme of your own with `defineTheme()`** from `@rowkit/tokens`: start from `modern` or `win98`, set the values you change, get the whole stylesheet — both schemes included. It refuses a token that does not exist. `themeRule()` writes a single rule.
  - **`@rowkit/tokens` exports the themes as data:** `tokens.themes.win98`, `tokens.themes.modern.light` and `.dark`, plus `size`, `style` and the modern palette.
  - **Fixed: `ScrollArea` assumed 16px arrow buttons** when sizing its thumb; it reads the theme's.

### Patch Changes

- Updated dependencies [2202238]
- Updated dependencies [d1f5412]
- Updated dependencies [2c99177]
  - @rowkit/tokens@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- fa23264: **rowkit 1.0 beta: the Windows 98 redesign.** Every component, the tokens and the documentation are redrawn in the style of Windows 98, and rowkit runs on its own behaviour layer. The entries below list each breaking change. This is the first 1.0 prerelease, published under the `beta` npm tag: install it with `pnpm add rowkit@beta`. The API may still change between betas; 1.0.0 is cut when it settles.

### Minor Changes

- aa2c23a: **Badge is now a flat Windows 98 label**, as drawn in the Figma file: square corners, a 1px border, no bevel, the UI face at its regular weight, 15px (`sm`) or 17px (`md`) tall. `subtle` is a white face with coloured text and border, `solid` fills with the colour, `outline` keeps black text and puts the colour in the border. The dot is now a 5×5 square in the variant's colour (outlined on yellow) instead of a circle in the text colour.
- 007ff76: **New: `Separator`**, the Windows 98 etched line from the Figma file: 1px of shadow beside 1px of highlight, horizontal or vertical (vertical stretches to its row). It is `role="separator"`, or `decorative` to hide it from assistive technology. Use it between toolbar groups, menu groups and dialog sections.

  **ButtonGroup is now a Windows 98 toolbar group.** Buttons sit edge to edge and keep their own bevels; ghost buttons give the flat toolbar look. Nested groups sit 4px apart, with a vertical `Separator` between them to draw the etched line.

  Breaking, on 0.x so marked minor: buttons in a group no longer merge their edges (no shared border, no overlap), and nested groups are 4px apart instead of 12px.

- 03f3d5c: **Button is now the Windows 98 command button**, as drawn in the Figma file.

  - **Breaking: `variant="outline"` is removed.** Use `secondary`, the plain raised button. `default` is now the black-framed default button of a form or dialog, `ghost` a flat toolbar button with a thin bevel on hover, `destructive` a raised button with a maroon label, and `link` blue underlined text.
  - **Sizes are Windows 98's own:** `xs` 17px, `sm` 21px, `default` 23px (minimum width 75px), `lg` 27px; icon sizes 20, 22, 24 and 28px.
  - **States are bevels.** Pressed sinks the bevel and moves the label 1px right and down without changing the button's size; focus is a dotted ring around the label (plus the black frame on `secondary` and `destructive`); disabled greys and embosses the label instead of fading the button. Nothing animates.
  - **Loading shows the hourglass** in place of the spinner.
  - **New `pressed` prop** makes a toggle: it sets `aria-pressed`, and on is drawn pressed in over the dither. The dither is a new `bg-dither` utility in `rowkit/styles`.
  - **Fixed: `as-child` put the button's classes on its own inner label `<span>`** instead of on your element.
  - **Fixed: `text-ui` and the other token font sizes were dropped by class merging** whenever a text colour sat next to them, so components rendered at the inherited size.

- 14237e0: **New: `Checkbox` and `Radio`**, the Windows 98 check box and option button from the Figma file. Both are native inputs inside a `<label>`: they submit with a form, `Radio`s sharing a `name` move with the arrow keys, and the label names them.

  - `Checkbox`: a 13×13 sunken box with a 7×7 check; `indeterminate` draws the 7×2 bar and is announced as mixed. `v-model` is a boolean.
  - `Radio`: the 12×12 round well with a 4×4 dot. `v-model` is the group's chosen value; bind the same ref on every option.

  Held down or disabled, the box or well turns silver. Disabled labels are grey and embossed. Focus is the dotted ring round the label.

- 025ff1e: **New `DataTable` prop: `scrollbars`.** `native` (the default) keeps the browser's scroll bar, restyled as Windows 98. `drawn` puts the body in a `ScrollArea`, so the bars look the same in every browser, Firefox included. The sticky header and pinned columns work with either, and the bars never cover a cell.
- 7416079: **DataTable keeps its header still while it reloads.** Switching `loading` on after rows were shown holds every column at the width it had, so a sort, a page change or a filter no longer resizes the columns to the placeholders and back. On a first load, give columns a `width` for the same effect.

  `loadingRows` now defaults to 6, as in the Figma table (was 5).

- 5d379ef: **DataTable scrolls like a Windows 98 list view.**

  - **Cells no longer wrap**, and the table no longer squeezes its columns to fit the frame. Every column keeps its `width`, every row keeps its 18px or 22px, and columns that do not fit scroll sideways. A table narrower than the frame still fills it. Behaviour change: long text that used to wrap now stays on one line and widens its column.
  - **Several pinned columns stack** side by side in column order instead of all sitting at the start edge on top of each other. Only the last one draws the edge shadow.
  - **The selection column pins** with them when the table has a pinned column, so the check boxes stay beside their rows while the table scrolls sideways.
  - The sticky header stays over all of it while the body scrolls both ways.

- dab852c: **New `DataTable` prop: `summary`**, a totals row after the last row, as in the Figma "Numbers and a total" example. Keyed like the columns, drawn in bold under an etched line, and held at the bottom while the body scrolls. A `#summary:<key>` slot replaces a cell that needs markup.
- 150457d: **DataTable is now a Windows 98 list view**, as drawn in the Figma file.

  - **A white well in a sunken bevel**, with a visible caption (`captionVisible`) above it on the window face. Rows are 18px (`sm`) or 22px (`md`) with no grid lines; a selected row is navy with white text and stays navy when the table loses focus; a focused row gets the dotted rectangle.
  - **Column headers are raised buttons.** A sortable header sinks while held and moves its label; the sorted column shows a ▲ or ▼ after its label. Focus is a dotted ring around the label. No hover anywhere: `hoverable` no longer has a visible effect, and `dataTableRowActionClass` no longer hides row actions until hover.
  - **Win98 check boxes and option buttons** for selection: a 13×13 sunken box with a pixel check (a bar when partly checked), and the 12×12 round option button. Both stay native underneath.
  - **New `numeric` column option**: the mono face for figures, aligned to the end unless `align` says otherwise.
  - **Breaking: `class` now goes on the root**, which holds the caption and the frame, instead of on the scroll container. A height such as `max-h-96` still bounds the table and makes the body scroll.

  **Skeleton is a dithered plate** instead of a grey pulse: text bars are 9px to sit on the 13px line, corners are square except the circle, and `animated` steps the checker 1px every 400ms (two frames, no easing) behind `motion-safe:`.

- a4a83c0: **Dialog is now a Windows 98 dialog window**, as drawn in the Figma file: a silver face in the window bevel with 2px of frame, an 18px navy-to-blue title bar holding the title in bold white, and the 16×14 ✕ caption button at its right end. Description, body and footer sit 12px in from the frame and 12px apart; footer buttons are right-aligned 6px apart, the default button first. It opens and closes instantly.

  Breaking, on 0.x so marked minor:

  - **The title moves into the title bar.** `DialogTitle` stays where you place it in `DialogHeader` but is drawn over the bar and cut off with an ellipsis before the ✕. Anything else in the header starts below the bar. The bar and the ✕ are drawn by `DialogContent`, so they are there whatever the header holds.
  - **No backdrop.** The 50% scrim is gone: nothing is drawn behind the window. Clicking outside still closes it (unless `preventClose`), and page scroll is still locked.
  - **Fixed widths.** `size` is now 320 (`sm`), 440 (`md`) or 600px (`lg`), narrowed to fit small screens, instead of `max-w-sm` / `max-w-lg` / `max-w-2xl` from the `sm` breakpoint up. A `class` that set `sm:max-w-*` on `DialogContent` should set `max-w-*` instead.
  - **No enter or exit animation.** The `animate-overlay-*`, `animate-dialog-*`, `animate-toast-*` and `animate-tooltip-*` utilities are removed from `rowkit/styles`; no component used them any more.

  Focus now opens on the first control after the title bar — the first field, or the default button that leads the footer — instead of the close button. A dialog opened from a dialog turns the one underneath inactive (grey title bar) until it closes.

  `preventClose` still leaves the ✕ working (the Figma file draws it disabled): a dialog never traps the user.

- f4b1653: **Breaking: dark mode is removed.** rowkit now has a single theme, the first step of the Windows 98 redesign. This is a breaking change released as a `minor` while rowkit is on 0.x.

  - The token stylesheet no longer emits a `.dark` block or redefines Tailwind's `dark:` variant. Setting `class="dark"` on `<html>` now does nothing; remove any theme toggle that relied on it. `dark:` utilities in your own code fall back to Tailwind's default `prefers-color-scheme` behaviour.
  - `semanticColorDark` and the `whiteAlpha` primitives (`--color-white-alpha-*`) are removed from `@rowkit/tokens`.
  - `semanticColorLight` is renamed to `semanticColor`, and `tokens.color.semantic` is now that map directly rather than `{ light, dark }`. Replace `tokens.color.semantic.light` with `tokens.color.semantic`.

- f4b1653: **Typeface: PT Sans replaces Geist.** `--font-sans` now leads with PT Sans, the closest open match to Tahoma, then Tahoma, Microsoft Sans Serif and Verdana. rowkit does not ship the font: add `@fontsource/pt-sans` and import its `400.css` and `700.css`. PT Sans covers Latin and Cyrillic. `--font-mono` now leads with Lucida Console, then Courier New. If you load `@fontsource-variable/geist` only for rowkit, you can drop it; to keep Geist, override `--font-sans` and `--font-mono`.
- 348e3e8: **rowkit no longer depends on Reka UI.** Every component now runs on rowkit's own primitives. Installing rowkit no longer pulls in `reka-ui`, `@floating-ui/*`, `@vueuse/*`, `aria-hidden` or `defu`, and the full library is about 22 kB brotli including dependencies, down from about 50 kB. If your app imported anything from `reka-ui` only because rowkit brought it in, add it to your own dependencies.
- 9e7351e: **EmptyState is now a Windows 98 system message**, as drawn in the Figma file: the 32px icon on the left, then a bold title, the explanation and the buttons stacked beside it. `sm` fits a table body (12px padding, 13px title); `md` and `lg` fill a panel (24px padding, 13px or 14px title), each capped at the width drawn in Figma (280, 360, 440px).

  **`reason` now picks the icon** from the Figma set: an empty folder for `no-data`, a magnifier for `no-results`, the red error mark for `error`. `#icon` still replaces it.

  DataTable centres its empty state in the table body, 16px from the header, as in the Figma table.

  Breaking, on 0.x so marked minor: the layout is horizontal and left-aligned instead of a centred column; the explanation is black for every reason (an `error` no longer turns it red, the icon says it); the title uses the 13/16 and 14/18 UI headings instead of `text-sm` / `text-base` / `text-lg`; the description loses its `max-w-*` cap in favour of the root's width.

- bc0a27b: **Field is restyled to the Windows 98 design** from the Figma file: the label in the regular UI face (no longer medium weight) with a maroon asterisk when required, the hint in subtle grey, and the error as the 16px error icon followed by the message in maroon. The gaps follow the control size: 4, 6 or 8px. Disabled, the label is grey and embossed instead of faded to 50%.

  **New: `layout="left"`**, the Windows 98 property-dialog arrangement. The label sits beside the control with its text level with the control's text, and the hint or error goes under the control. Set `--rk-field-label-width` on a container to line up a column of labels.

  The error message now has an icon in front of it, and `fieldErrorVariants`, `fieldHintVariants` and `fieldLabelVariants` drop their `size` variant, since the text is the same 11px UI face at every size.

- 01bd7ae: **FilterBar is now the Windows 98 toolbar from the Figma file**: one row on the silver face with 4px of padding and gaps, wrapping when the chips run out of room — search field (200px), your controls, the chips, the result count, then «Clear filters» as a command button. Chips are flat: white, a 1px grey border, 19px (`sm`) or 21px (`md`) tall, with a flat 13px ✕ that shows a dotted focus ring. **Backspace or Delete on a chip's ✕ now removes that chip.**

  Breaking, on 0.x so marked minor:

  - The search box, controls, chips, count and clear button share one wrapping row instead of a controls row above a chips row. `filterBarControlsVariants` and `filterBarChipsVariants` are now layout-transparent (`contents`).
  - The `clearLabel` default changes from "Clear all" to "Clear filters", and the button is a raised command button instead of a ghost one.
  - `filterBarChipRemoveVariants` and `filterBarSummaryVariants` drop their `size` variant.

- ed3a584: **rowkit now exports its icons**: the Windows 98 pixel set from the Figma file, 42 in all — 8px glyphs for controls and title bars (`TriangleDownIcon`, `CloseGlyphIcon`, `MaximizeGlyphIcon`, …), 16px icons for buttons and lists (`PlusIcon`, `CopyIcon`, `TrashIcon`, `FilterIcon`, `EditIcon`, `FolderIcon`, `DocumentIcon`, `UserIcon`, `CalendarIcon`, `QuestionIcon`, …) and 32px icons for system messages (`Error32Icon`, `Info32Icon`, `Warning32Icon`, `Folder32Icon`, `Book32Icon`, …). Each is the exact Figma pixel art, `aria-hidden`; single-colour glyphs are drawn in `currentColor` so they grey out with a disabled control. Show them at their own size or a whole multiple — never scaled in between. Icon slots still take your own icons.
- 73f3417: **Input is now the Windows 98 edit box**, as drawn in the Figma file.

  - **A white well in a sunken bevel**, 21, 23 or 27px tall (`sm`, `md`, `lg`) to line up with Button. Read-only and disabled fields turn silver; disabled text is grey and embossed. The placeholder is `text-subtle` (#404040).
  - **Invalid is quiet.** The red border and ring are gone: an invalid field shows the error mark at its end, sets `aria-invalid`, and leaves the message to Field.
  - **Types bring their own furniture.** `search` shows the magnifier and clears on Escape (without letting the key close a dialog when there was something to clear). `number` has spin buttons that step the value and repeat while held. `date` has a drop button that opens the browser's date picker. The browsers' own spinners, picker icon and clear button are hidden.
  - **Focus is a dotted ring inside the field.**
  - **Breaking: `class` now goes on the frame**, the box with the bevel, instead of on the `<input>`. A width such as `w-56` keeps working; a class that styled the text itself now needs a descendant selector. Other attributes still go to the `<input>`.

- 0b3e59a: **Controls are sized for 13px text, as Windows 98's Large Fonts sized them.** Heights that hold a line of text grow by 16/13, the same step the text took; bevels, icons, check boxes and radio buttons keep their pixel sizes.

  | part                                                     | was               | now               |
  | -------------------------------------------------------- | ----------------- | ----------------- |
  | `Button` `xs` / `sm` / `default` / `lg`                  | 17 / 21 / 23 / 27 | 21 / 26 / 28 / 33 |
  | `Button` icon sizes                                      | 20 / 22 / 24 / 28 | 25 / 27 / 30 / 34 |
  | `Button` minimum width, `default` / `lg`                 | 75 / 88           | 92 / 108          |
  | `Input`, `Select` `sm` / `md` / `lg`                     | 21 / 23 / 27      | 26 / 28 / 33      |
  | `Select` list items (eight show before the list scrolls) | 16                | 22                |
  | `FilterBar` chips `sm` / `md`                            | 19 / 21           | 23 / 26           |
  | `Pagination` buttons `sm` / `md`                         | 17 / 21           | 21 / 26           |
  | `DataTable` rows `sm` / `md`                             | 18 / 22           | 22 / 27           |
  | `Window` and `Dialog` title bars                         | 18                | 22                |
  | Caption buttons (✕, minimise, maximise)                  | 16×14             | 20×18             |
  | `StatusBar`                                              | 22                | 27                |
  | `Skeleton` text line                                     | 9                 | 11                |

- 2611965: **Text is set in Windows 98's "Large Fonts" sizes.** At 96 DPI the system's 8pt is 11px, which was readable on a 1998 monitor's large pixels and is too small on today's screens; Windows 98 offered the 120 DPI "Large Fonts" mode for the same reason. The whole ladder moves with it:

  | token           | was   | now                                                    |
  | --------------- | ----- | ------------------------------------------------------ |
  | `text-ui`       | 11/13 | 13/16                                                  |
  | `text-heading`  | 13/16 | 16/20                                                  |
  | `text-mono`     | 16/16 | 16/16 — VT323 at 16px now matches 13px PT Sans exactly |
  | `text-doc`      | 15/24 | 16/26                                                  |
  | `text-doc-mono` | —     | 20/20, new: code beside documentation text             |
  | `text-doc-h1`   | 24/28 | 26/30                                                  |
  | `text-doc-h2`   | 18/22 | 19/24                                                  |
  | `text-doc-h3`   | 14/18 | 15/20                                                  |

  Bevels, borders and icons keep their pixel sizes, as they did in Windows 98.

- a6c52a7: **`Pagination` fits a phone.** Below 640px, «Back» and «Next» are drawn as arrows alone, so a row such as `◀ 1 … 39 40 41 … 100 ▶` no longer runs off a narrow screen. The words stay as the buttons' accessible names, and the switch is CSS, so nothing shifts as the page loads. The new `compact` prop sets it: `'auto'` (the default) below 640px, `true` always — for a narrow side panel on a wide screen — and `false` never, which keeps the previous look everywhere.
- c859888: **Pagination is now drawn as in the Figma Home template's status bar.** Page numbers and the «◀ Back» / «Next ▶» buttons are Windows 98 command buttons 2px apart: 17px tall at `sm`, 21px at `md`, page numbers square at their narrowest. The current page is pressed in. Back and Next go grey and embossed on the first and last page. The rows-per-page control uses `Field` with `layout="left"`.

  **`Button` draws `aria-current="page"` pressed in** (no dither), so a page button or a pager built from `Button` gets the current-page look from the attribute alone.

  Breaking, on 0.x so marked minor: `previousLabel` and `nextLabel` are now the visible labels of the Back and Next buttons, and their accessible names, instead of hidden `aria-label`s. Their defaults change from "Previous page" / "Next page" to "Back" / "Next".

- 2662d19: **New: `ScrollArea`**, a region with Windows 98 scroll bars that rowkit draws itself, so they look the same in every browser, Firefox included. Raised arrows scroll a line and repeat while held, the track pages toward the pointer, and the thumb drags; its length is the share of the content in view. The content still scrolls natively, and the bars sit beside it rather than over it.

  ```vue
  <ScrollArea label="Event log" class="h-64 w-80">…</ScrollArea>
  ```

  `scrollbars="always"` keeps both bars on screen, greyed when there is nothing to scroll. The component exposes `viewport`, the element that scrolls.

- 9aaf5a6: **New: the Windows 98 scroll bar**, as drawn in the Figma file: 16px thick, raised arrow buttons, a dithered track and a raised thumb. It is a utility, `scrollbar-win98`, in `rowkit/styles`: put it on any element that scrolls.

  The `DataTable` body, `DialogBody`, the `Select` list and `WindowBody` now carry it, so their scroll bars change from the browser's default to the Windows 98 one with nothing to do on your side.

  It restyles the browser's own scroll bar, so scrolling behaves exactly as before. Chromium and Safari draw every part; Firefox can only colour a scroll bar and shows a silver thumb on a white track. Setting `scrollbar-color` or `scrollbar-width` on the same element brings back the native bar in Chromium.

- ed7fcf0: **`Select` is rebuilt on the WAI-ARIA combobox pattern, without Reka UI.** Released as a `minor` while rowkit is on 0.x, because the markup changes.

  - Same parts and props (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`), same `v-model`, `searchTerm`, `searchable`, `manualFilter`.
  - **Type-ahead:** in a non-searchable select, typing the start of a label opens the list and highlights the match.
  - **Above dialogs:** the list paints at `z-popover`, so a select inside a `Dialog` no longer opens underneath it.
  - **Positioning:** the list opens below the control, or above it when there is no room below.
  - `aria-activedescendant` exists only while the list is open, natively — no workaround.
  - Search matching ignores case and accents in the user's locale.
  - The width custom property is now `--rk-select-trigger-width` (was `--reka-combobox-trigger-width`).

- 0019ab5: **Select is now a Windows 98 drop-down list.** The control is Input's white well in a sunken bevel (21, 23 or 27px tall) with the raised 16px drop button and its triangle at the end; with focus and a value, the value shows in navy with white text. The list hangs directly under the control, as wide as it: white, in a 1px black frame, 16px rows, eight before it scrolls, the highlighted option navy, disabled options grey and embossed. It appears instantly.

  **A mouse press now opens the list**, and dragging onto an option and releasing chooses it, as in Windows 98. Touch and pen still open it on a tap.

  Breaking, on 0.x so marked minor:

  - The selected option no longer shows a check mark; the highlight opens on it instead.
  - Invalid is quiet: the error mark appears in the control, and the red border and ring are gone. The `invalid` variant is removed from `selectTriggerVariants`.
  - The list sits flush under the control (no 4px gap) and is exactly as wide as it, with no 160px minimum.

- ff55ca7: **New primitives from the Figma file:**

  - **`StatusBar` and `StatusBarSection`**: the strip along the bottom of a Windows 98 window. Sunken 18px cells on a 22px silver strip; the first cell fills the width the others leave.
  - **`GroupBox`**: the etched frame with its legend on the top line. A `fieldset` with a `legend` by default, so form sections are named for assistive technology; `as="section"` or `as="div"` for a labelled group that is not a form.
  - **`ProgressBar`**: the block progress bar. Navy 8×12 blocks in a sunken track, rounded down to whole blocks, with `role="progressbar"` and its value range.

- 7e62e51: **Toast and Tooltip now follow the Windows 98 design** from the Figma file.

  - **A toast is a small window**: the silver face in a window bevel, the same for every variant, with a 16px icon that says which (information, success, warning, error). An action is a small raised button under the text; the close button is a 16×14 caption button with the ✕ glyph. Toasts appear and go instantly; nothing slides.
  - **New `title` option** on `toast()` and its shortcuts: a bold first line above the message.
  - **A danger toast now stays until it is closed** unless you pass a `duration`. Other variants still dismiss after 5 seconds.
  - **A tooltip is the pale yellow info box** with a 1px black border, 11px text, up to 240px wide. No arrow, shadow, rounding or animation.
  - **Tooltips open after 500ms** by default, both for a standalone `Tooltip` (was 300ms) and under a `TooltipProvider` (was 700ms).

- fe3a592: **`Toaster` moves off Reka UI, with three deliberate behaviour changes.** Released as a `minor` while rowkit is on 0.x.

  - **Escape closes only the toast that holds focus.** Previously any Escape on the page — including the one that closed a dialog — dismissed every toast.
  - **Toasts render newest first in the DOM**, so Tab and screen-reader order start at the toast that just arrived. The visual stacking per `position` is unchanged. Tests that query toasts by index may need updating.
  - **Announcements go through one persistent `role="status"` region** instead of an element inserted per toast, which screen readers often missed.

  Also: the swipe offset custom property is now `--rk-toast-swipe-x` (was `--reka-toast-swipe-move-x`); the toast region no longer renders `aria-hidden` focusable guards, so axe's `aria-hidden-focus` rule passes and is re-enabled; and clicking a toast while a `Dialog` is open no longer counts as a click outside it.

- 0b409b8: **`Tooltip` and `TooltipProvider` move off Reka UI.** Released as a `minor` while rowkit is on 0.x, because the markup changes.

  - The bubble is now the `role="tooltip"` element that `aria-describedby` points at. The visually hidden copy of the text that Reka rendered inside it is gone, so the description exists once. Tests that looked for the inner span should query the bubble.
  - `TooltipProvider` is rowkit's own, with the same props (`delayDuration`, `skipDelayDuration`, `disableHoverableContent`, `disableClosingTrigger`, `disabled`, `ignoreNonKeyboardFocus`) and defaults as before.
  - Positioning is rowkit's own: preferred side with a 4px gap, flipped to the opposite side when it does not fit, slid along the edge to stay on screen. `data-side` still reports the side used.

- ea9f9ff: **New: `Window`**, the Windows 98 window from the Figma file, in parts: `Window` (the frame, with `active` for the grey inactive title bar), `WindowTitleBar` (the 18px gradient bar with the bold title, an `#icon` and `#controls`), `WindowButton` (the 16×14 caption button with the `minimize`, `maximize`, `restore` or `close` glyph) and `WindowBody`. A `StatusBar` goes last. The window is a `section` named by its title; caption buttons are native buttons that report the click and leave what it means to you.
- c82f79f: **The tokens are now the Windows 98 design.** Every value comes from the Figma file's variables and styles.

  - **Colour.** The primitives are the VGA palette and Windows 98's system colours as exact hex: `--color-vga-*` (`silver`, `gray`, `navy`, `teal`, …) and `--color-win98-*` (`light`, `dark-gray`, `title-blue`, `title-gray`, `info`). The OKLCH ramps (`neutral`, `primary`, `success`, `warning`, `danger`, `gray`, `red`, `green`, `amber`) and `colorSteps` are removed; `tokens.color.vga` and `tokens.color.win98` replace them. Semantic names are kept, and the design adds new ones: `desktop`, `tooltip-bg`, `text-disabled-emboss`, `on-selected`, `link`, `bevel-highlight` / `-light` / `-shadow` / `-dark`, and the `titlebar-*` gradient. `input` is now the white inside of a field, not a border colour.
  - **Bevels instead of elevation.** `shadow-raised`, `window`, `raised-default`, `pressed`, `sunken`, `status`, `etched` and `raised-thin` replace `shadow-xs` … `shadow-xl`. A new `text-shadow-disabled` draws the embossed disabled text.
  - **Square corners.** `--radius` defaults to `0rem`, so every `rounded-*` step is 0 until you set it; `rounded-full` is unchanged.
  - **Type.** Sizes are named after the design's text styles: `text-ui` (11/13), `text-heading`, `text-mono`, `text-doc`, `text-doc-h1` / `-h2` / `-h3`. The `xs` … `3xl` sizes, the `medium` and `semibold` weights and the `tight` and `wide` tracking are removed (Tailwind's defaults still answer to those names). `--font-mono` now leads with VT323; load `@fontsource/vt323` next to `@fontsource/pt-sans`.
  - **No backdrop blur.** The `blur` scale is removed, and the dialog backdrop no longer blurs.

  In rowkit, a selected DataTable row now has white text on navy, and an outline Badge has black text, as in the design. The rest of the components move to the new look in the next releases.

### Patch Changes

- e59a5b5: **`DataTable`'s selection column uses the public `Checkbox`.** Each row's check box and the select-all are now native `<input type="checkbox">`s — the same control as `Checkbox`, with `indeterminate` for a partly selected page — instead of an internal `<button role="checkbox">`. They still answer Space, still read «Select all rows» and each row's label, and a click still selects the rest when the select-all is partly checked. A test that looked for `[role="checkbox"]` or read `aria-checked` should query `input[type="checkbox"]` or use `toBeChecked()` / `toBePartiallyChecked()`. `dataTableCheckboxVariants` stays exported but is deprecated; nothing in rowkit uses it.

  `Checkbox` now colours its mark through the foreground variable, so a check box inside a selected DataTable row keeps a black mark on its white box while its label turns white.

- a975310: rowkit's behaviour layer is now entirely original code. The primitives that had been ported from Reka UI — focus scope, dismissable layer, presence, body scroll lock, hide-others, `as` / `as-child`, the tri-state checkbox, the page range — and the toast and tooltip behaviour are rewritten from scratch against the same tests, so `THIRD_PARTY_NOTICES.md` is no longer shipped. Public APIs and rendered output are unchanged.

  A few edge cases behave slightly differently:

  - A pointer pressed outside stacked layers closes every layer it is outside of, from the top down, stopping at a modal layer. Hovering a tooltip inside a dialog and then clicking the page now closes both, not just the tooltip. Escape still closes one layer at a time.
  - An endless animation on an overlay's surface (a spinner on the dialog itself, say) no longer keeps the overlay mounted after it closes.
  - A dismissed toast now plays the `data-state="closed"` exit animation its styles always declared, instead of vanishing at once. It leaves the queue immediately, so the next toast moves up without waiting, and it is `inert` while it fades.
  - A `Tooltip` inside a `TooltipProvider` now waits the provider's `delayDuration`, as documented, rather than its own `delay`. On its own, `delay` still sets the timing.
  - An open tooltip closes when the page scrolls, instead of drifting away from its trigger.

- 0352fc4: rowkit is moving off Reka UI onto its own behaviour layer, one component at a time. Public APIs and rendered output stay the same.

  - `Button`, `Badge`, `Skeleton` and `EmptyState` render through rowkit's own `Primitive`; `as` and `as-child` behave exactly as before, pinned against Reka's output in the test suite.
  - `Field` renders a native `<label>`, keeping the guard that stops a double-click from selecting the label text.
  - `DataTable`'s row and select-all checkboxes use rowkit's own tri-state checkbox: same roles, `aria-checked` and `data-state` as before, Space toggles, Enter does not.
  - `Pagination` renders its own `<nav>` and buttons with the same labels, `aria-current` and disabled states; the page-range calculation is ported from Reka and checked against it for every input.
  - `Dialog` runs on rowkit's own focus scope, dismissable layer, presence, scroll lock and hide-others primitives, ported from Reka. Focus moves in on open and back to the trigger on close, Tab stays inside, Escape and an outside click close it (or not, with `preventClose`), the page behind is hidden from assistive technology and does not scroll. A `Select` open inside a `Dialog` now closes on its own Escape without closing the dialog.

- Updated dependencies [f4b1653]
- Updated dependencies [f4b1653]
- Updated dependencies [2611965]
- Updated dependencies [fa23264]
- Updated dependencies [c82f79f]
  - @rowkit/tokens@1.0.0-beta.0

## 0.4.0

### Minor Changes

- ddefab7: **Breaking (Dialog).** `Dialog` is now a set of parts. `title`, `description`, `size`, `preventClose`, and `closeLabel` are no longer props of `Dialog`, and the `header`, `footer`, and default slots are gone.

  Place `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, and `DialogFooter` yourself. `size`, `preventClose`, `closeLabel`, and `class` move to `DialogContent`. The accessible name comes from `DialogTitle`. The portal, the scrim, and the close button stay inside `DialogContent`. `v-model:open` is unchanged and is now optional: with no model, the trigger still toggles.

- ddefab7: **Breaking (Select).** `Select` is now a set of parts. The `options` prop is gone, and so are the `option`, `value`, and `empty` slots on `Select`.

  Place `SelectTrigger`, `SelectContent`, and a `SelectItem` for each choice. `placeholder`, `size`, `id`, and `class` move to `SelectTrigger`. `emptyText`, `loading`, and `loadingText` move to `SelectContent`. `searchable`, `manualFilter`, `disabled`, `invalid`, `required`, and `name` stay on `Select`. `v-model` and `v-model:searchTerm` are unchanged. `label` on `SelectItem` is what the closed trigger shows.

- ddefab7: **Breaking (Tooltip).** `Tooltip` is now a set of parts. The `content` prop and the default slot are gone, and `placement` moves to `TooltipContent`.

  Place `TooltipTrigger` and `TooltipContent` yourself. The label is the content slot, and it is text. `delay` and `disabled` stay on `Tooltip`. A lone tooltip still supplies its own provider; `TooltipProvider` is unchanged, including `skipDelayDuration`.

### Patch Changes

- ddefab7: **Components.** Every component root, and the named parts inside Dialog and Field, now expose a `data-slot`. Style and tests can target `data-slot="dialog-title"` instead of a class string, which stays an implementation detail.
- Updated dependencies [ddefab7]
  - @rowkit/tokens@0.4.0

## 0.3.0

### Minor Changes

- aef7717: **Breaking (Button).** Variants are now `default` | `outline` | `secondary` | `ghost` | `destructive` | `link` — soft-ink solid is the default (omit `variant` or pass `default`). `primary` and `danger` are removed; soft `destructive` replaces solid danger. Size scale is `default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`; the `icon` boolean prop is gone. Former bordered `secondary` is now `outline`; `secondary` is a muted fill (`surface-active`). Soft ink solid lightened to `oklch(0.26…)`. Link focus stays typographic (ring only). Dialog Cancel convention is `ghost` so soft Delete wins hierarchy.

  **ButtonGroup.** New `ButtonGroup` joins related buttons with shared edges (`orientation` horizontal | vertical). Nested groups use a clear gap.

  **Tokens.** Default primary is warm espresso graphite (`oklch(0.31 0.038 48)` / `#402a1f`), not near-black. Soft destructive wash in dark mirrors light (coloured label on a quiet red tint). Link focus is underline-only.

### Patch Changes

- aef7717: **Consistency.** Select invalid focus uses `has-[:focus-visible]` (focus is on the inner input). FilterBar chip-remove focus uses the solid ring recipe. FilterBar Clear maps Button size to the bar (`default` at `md`, `sm` at `sm`). Field `size` inherits to nested Input/Select when they omit their own. DataTable gains `emptyReason` for the built-in empty state.
- 60fbcfd: **Docs.** New homepage composition: espresso mark/logo, branded hero, and a live Users FilterBar + DataTable + Pagination preview. README screenshots refreshed (`home.png`, `datatable-page.png`); outdated “twelve components” copy removed.
- 36bfac3: **Docs cascade fix.** Every heading on every docs content page was rendering at body size and weight. Wrapping VitePress's CSS in `@layer vp-theme` left the layer order to first-appearance, and the wrapped CSS lands at the top of the bundle — so `vp-theme` sorted _below_ Tailwind's `base`, and preflight's `h1`–`h6` reset (`font-size: inherit`) beat every VitePress heading rule, since a layer beats specificity. The order statement now rides on the wrapped CSS itself (`@layer theme, base, vp-theme, components, utilities`), which puts `vp-theme` above `base` so headings survive and below `utilities` so live demos still win. `docs-styles.test.ts` now asserts both bounds instead of only the lower one.

  **Docs homepage.** The bulk-actions bar moved below the table. Above it, every checkbox tick inserted or removed a band and shoved the table under the cursor — the row you were aiming at moved because you selected the one before it. The demo roster grew to 80 people so the money shot pages through real data — ten rows a page across seven pages, instead of a single page of six — and narrowing a filter now returns to page 1.

  **`NEXT.md` is now `ROADMAP.md`**, rewritten as a plan of record: current state, what 1.0 actually requires, and what stays out of scope. The docs page moves from `/next` to `/roadmap`.

- 60fbcfd: **Safari / docs demos.** VitePress theme CSS is wrapped in `@layer vp-theme` so Tailwind utilities beat its form/table reset without `all: revert-layer` (broken in Safari). DemoBox isolates markdown-table chrome on `.rk-demo`. DataTable keeps `h-*` on cells (`min-height` is ignored for `table-cell`). Input/Select use `leading-normal` for Safari text centering.
- aef7717: Select shows a trailing checkmark on the selected option (shadcn-style) instead of a left indicator with a selected fill. Secondary buttons use a quiet `border-input` outline on a card surface. Dialog footers keep a hairline divider with Cancel as secondary. Resting control borders (`input`) are quieter. Focus is soft silver (`ring` → `gray-708` light / soft white dark) — border + translucent outer ring, not an ink halo.
- Updated dependencies [aef7717]
- Updated dependencies [a46fe24]
- Updated dependencies [aef7717]
  - @rowkit/tokens@0.3.0

## 0.2.0

### Minor Changes

- 164ca88: Restyle rowkit on a shadcn/ui-derived language, then tune it for data-dense SaaS — cool chrome, indigo primary, one control geometry.

  **Tokens (breaking if you override theme variables or write rowkit utility classes by hand).** Seven core semantics rename to shadcn’s names: `surface` → `card`, `surface-subtle` → `muted`, `surface-hover` → `accent`, `text` → `foreground`, `text-muted` → `muted-foreground`, `border-control` → `input`, `focus-ring` → `ring`. The greys start from shadcn’s zero-chroma ramp, then pick up rowkit identity: cooler, lighter decorative borders, a cool off-white page, brand indigo primary with a matching focus ring (not near-black), and selected rows on a quiet primary wash. Corners derive from a single `--radius`. New: overlay blur, sticky-header inset shadow, stronger sticky-column scroll shadow. Status families keep the solid/subtle/outline axis Badge and Button already expose.

  **Components.** The shared focus recipe (border + translucent ring) lands on every control. Button, Input and Select share height, radius, padding and `text-sm` from `sm` up; Button adds `xs` and `icon`. Secondary is a muted fill so it never reads as another field; fields stay the outlined hollow shell. Chromatic Badge `subtle` is a soft tinted chip. Tooltip inverts foreground/background instead of painting as a primary bubble. DataTable: opaque sticky header with an inset edge that travels while scrolling, unified loaded/loading row heights, quieter hover vs selection. Dialog: blurred scrim, denser padding, footer rule, close matches an icon button. FilterBar, Field, Toast, EmptyState and Pagination follow the same chrome. Docs demos stop inheriting VitePress’s unlayered table grid and zebra over DataTable.

  **API (0.x breaking).** `TablePagination` is now `Pagination` — same props, events and slots; docs move to `/components/pagination`. Marked `minor` on purpose: on a 0.x line changesets would turn a `major` into `1.0.0`, and 1.0 should wait for real apps, not a rename.

### Patch Changes

- Updated dependencies [164ca88]
  - @rowkit/tokens@0.2.0

## 0.1.1

### Patch Changes

- a4280d4: Fix types failing to resolve under `moduleResolution: node16` and `nodenext`.

  The emitted declarations carried extensionless relative specifiers — `from
'./components/Badge'`, `from './Badge.variants'` — and a directory import cannot
  be resolved by Node's ESM resolver. Anyone on `bundler` (Vite, Nuxt) was
  unaffected; everyone else saw the package as untyped.

  The build now rewrites those specifiers to end in `.js`. No API change, and the
  JavaScript output is untouched.

- 60f2021: Add a README to each package.

  Both npm pages were blank. npm publishes the README that sits beside
  `package.json`, not the one at the root of a monorepo — so the repository README
  was never reaching the surface that matters most for a package nobody has heard
  of yet.

  Each package now has its own, aimed at someone deciding whether to install it:
  the setup step people miss, a typed `DataTable` example, and what the library
  deliberately is not.

- Updated dependencies [a4280d4]
- Updated dependencies [60f2021]
  - @rowkit/tokens@0.1.1

## 0.1.0

### Minor Changes

- 7d401a0: Add `Badge` — a non-interactive status label whose colour is the product of `variant` and `appearance`, defaulting to `subtle` because a column of solid badges reads as a wall of colour and stops communicating. An optional `dot` gives the eye a shape to lock onto when the same few statuses repeat down a page, and is `aria-hidden` since it only restates the colour already present.

  _Recorded retroactively — this work predates Changesets being installed._

- 7d401a0: Add `Button` — four variants, three sizes, and a loading state that keeps `aria-busy` rather than `disabled`, so focus survives a request and a screen reader user is not thrown out of the form by their own submit. Clicks are swallowed in the capture phase while loading, and a non-native element takes `aria-disabled` instead, since `disabled` means nothing on an anchor.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `DataTable` — column definitions constrained to the row type so a mistyped field is a compile error, per-column cell slots, sticky header, pinned columns with a scroll shadow, single-column sorting, and row selection with a tri-state select-all. Rows carry their own `id` rather than the table taking a `rowKey`, and sorting names a field of the row, so a sort referring to a column that does not exist also fails to compile.
- 25475b8: Add `Dialog`, built on Reka UI's primitive — focus trap, focus restore, scroll lock and background inerting come from there; rowkit supplies the API and the token styling. `title` is a required prop rather than only a slot, so `aria-labelledby` is always wired and replacing `#header` cannot break the accessible name.

  `preventClose` blocks Escape and the scrim for flows where accidental dismissal loses work, but never removes the close button — a dialog with no exit is hostile. Only the body scrolls, so footer actions cannot be pushed off-screen, and the enter/exit animations are gated behind `motion-safe:`.

- ffc7b1b: Add `EmptyState` — a zero-row state with a real heading at a caller-chosen level, so it can be reached by heading navigation and continues the page outline rather than restarting it. `reason` distinguishes the three empties that look alike and mean different things — nothing created, nothing matched, request failed — driving tone and, where the copy is genuinely generic, the description itself.
- 7d401a0: Add `Field` and `Input`. `Field` owns the label, hint, error and required state, generates the control id and wires `aria-describedby` with the hint before the error; `Input` inherits those flags from a surrounding `Field` by OR rather than fallback, so a field can turn them on and a control cannot turn them back off — which also sidesteps Vue casting an absent boolean prop to `false` rather than `undefined`.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `FilterBar` — a search landmark holding your filter controls and a removable chip per applied filter, with a live result count so filtering announces its effect to someone who cannot see the table shrink. Focus moves to the chip that took the removed one's place rather than being dropped to the top of the document, so clearing several by keyboard does not cost a round of tabbing each time.
- 8771038: Export a props type for every component — `ButtonProps`, `SelectProps<T>`, `DataTableProps<TRow>` and the rest — so a consumer can annotate a wrapper without restating the surface by hand. Each lives in the component's `types.ts`, since `<script setup>` cannot export a type, and `defineProps` now references it rather than an inline literal.
- 7d401a0: Add `Select` — generic over its value type, with optional search, async options and full keyboard support, built on Reka UI's Combobox with the input as the focusable anchor rather than the trigger, which Reka gives `tabindex="-1"` and labels "Show popup". Includes a workaround for an upstream Reka issue that leaves `aria-activedescendant` pointing at an unmounted list item after the panel closes.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `Skeleton` — loading placeholders in three geometries, composable into the shape of the content being waited for. The pulse is `motion-safe:` only so it never renders for anyone who has asked for reduced motion, and every variant carries a default height, since a placeholder that collapses to zero still produces the layout jump it exists to prevent.
- 7d401a0: Add the `cn` class-merge utility and the `rowkit/styles` entry point. `cn` extends `tailwind-merge` with rowkit's own scales read from the token package, so a new token cannot fall out of sync with the merge rules; `rowkit/styles` declares the theme and registers the bundle as a Tailwind source without importing Tailwind itself, which would emit a second preflight over the consumer's.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `TablePagination` — a range summary, a rows-per-page select and numbered pages, built on Reka's Pagination primitive with `showEdges` defaulted on so a user on page 12 of 25 can see how far the table runs and reach the end. It never moves the page itself: changing the page size emits `update:pageSize` and nothing else, because only the application knows whether a page change also means a refetch.
- c366abc: Add `Toast` — `useToast()` for calling one from anywhere including outside a component, a module-level queue, and a `<Toaster />` mounted once to render it. Built on Reka UI's Toast, which supplies the countdown, hover-pause, swipe-to-dismiss and an F8 shortcut that moves focus into the notification region; rowkit owns the queue rules on top.

  Five queue rules, each tested: at most `max` visible with the overflow waiting FIFO and no countdown until it appears, hover pausing only the hovered toast, `duration: 0` never auto-dismissing or blocking the queue, and a duplicate message inside 300ms coalescing rather than stacking. Everything announces politely — **danger toasts never become `role="alert"`**, because interrupting a screen reader mid-sentence costs more than hearing the error a moment later.

- e98677c: Add `Tooltip`, built on Reka UI's primitive. It opens on hover **and** on keyboard focus, dismisses with Escape without moving focus, and stays open while the pointer travels onto it — the two halves of WCAG 1.4.13. The trigger is rendered `as-child`, so your element becomes the trigger rather than being wrapped.

  `content` is typed as a `string` with no slot alternative, deliberately: a tooltip never holds focus, so an interactive element inside one is unreachable by keyboard by construction, and the type closes that failure class at the API boundary. Also re-exports Reka's `TooltipProvider` for the shared grace period that lets a pointer sweep a toolbar without re-paying the delay; a lone `Tooltip` supplies its own provider and defers to a real one when present.

- 55a9a03: Add the `useClientSort` composable and remove `DataTable`'s `sortMode` prop. The table no longer sorts its own rows under any setting — it reports the sort and renders what it is handed, so a server-paged table cannot silently reorder just the page on screen and look sorted while being wrong. Local sorting now lives outside the component, where it is testable without mounting.

  Add `row:click`, which puts rows in the tab order and activates them on Enter and Space; a click on a control inside the row does not fire it. Add a `#loading` slot alongside `#empty`.

### Patch Changes

- 5798f9f: Ship `AGENTS.md` inside the package.

  After installing, `node_modules/rowkit/AGENTS.md` describes every component's
  props, `v-model`s, events and slots — including `DataTable`'s per-column
  `#cell:<key>` slot and the full shape of its slot props — plus the setup steps
  that are not visible in a type, such as the `rowkit/styles` import without which
  everything renders unstyled.

  It is generated from the source, so it describes the version installed rather
  than whatever was current when it was written. A coding agent working in your
  project can read it without fetching anything.

- d40baf6: Fix a `sticky` column losing its own header in `DataTable`.

  Every header cell sat on the same `z-sticky` layer, so at equal z-index the
  later cells in the DOM painted over the pinned one. Scrolling right slid the
  neighbouring header straight across the pinned column's heading, while the
  pinned body cells below stayed put — the column kept its data and lost its name.

  The header row now establishes one stacking context and the pinned cell is
  ordered inside it. No API change.

  If your application places rowkit under a **fixed header of its own**, note that
  `--z-index-sticky` is `100`: a table's sticky header will paint over any chrome
  below that. Raise your header above it.

- 4f32275: Fix `Tooltip` rendering nothing when it is inside a `TooltipProvider`.

  A `<Tooltip>` with a provider above it — the arrangement the docs recommend for
  a toolbar, so `skipDelayDuration` lets the pointer sweep across a row of icon
  buttons — rendered no tooltip **and no trigger**. The button simply was not on
  the page, with no error and no warning.

  The internal pass-through wrapper was Vue's `Fragment`, which `<component :is>`
  hands a slots object where it expects an array of vnodes. If you worked around
  this by dropping the provider, you can put it back; a tooltip without one is
  unaffected and always worked.

- 6d7b4e4: Fix the exported `version` constant reporting `0.0.0` on a released build.

  Both packages exported a hand-written literal that a test pinned against
  `package.json`. Changesets bumps the manifest and nothing updated the literal,
  so the first release failed its own test — and had it passed, `version` would
  have reported `0.0.0` from a `0.1.0` package.

  It is now read from `package.json` directly, so the two cannot disagree. Rollup
  tree-shakes the import down to the single string; nothing else from the manifest
  ships.

- Updated dependencies [7d401a0]
- Updated dependencies [6d7b4e4]
  - @rowkit/tokens@0.1.0
