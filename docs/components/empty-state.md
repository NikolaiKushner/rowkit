# EmptyState

**Stage:** 🟢 Stable

The screen a table shows when it has nothing to show. A title, an explanation,
and a way forward — the last of which is the part usually missing.

<script setup>
import EmptyStateBasic from '../examples/empty-state/EmptyStateBasic.vue'
import EmptyStateReasons from '../examples/empty-state/EmptyStateReasons.vue'
import EmptyStateSizes from '../examples/empty-state/EmptyStateSizes.vue'
import EmptyStateCustom from '../examples/empty-state/EmptyStateCustom.vue'
import EmptyStateWindow from '../examples/empty-state/EmptyStateWindow.vue'
</script>

<DemoBox layout="stack">
  <EmptyStateBasic />
</DemoBox>

<<< @/examples/empty-state/EmptyStateBasic.vue

Every example here passes a `level` that fits this page's outline: the page
title is the `h1` and the examples sit under `h3`s. Getting it wrong is not
theoretical — axe caught a block at `level="3"` under an `h1`, which skips a
level and breaks heading navigation for anyone moving through the page by
structure.

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Three reasons, three next steps

`no-data`, `no-results` and `error` share a layout and mean completely
different things: the icon, the default description and the action change with
the reason. `announce` reads the change out when a filter or a retry caused
it.

<DemoBox layout="stack">
  <EmptyStateReasons />
</DemoBox>

<<< @/examples/empty-state/EmptyStateReasons.vue

### Sizes

`md` fills a page or a window; `sm` fits a side panel, a card or a small
table — pair it with `size="sm"` buttons.

<DemoBox>
  <EmptyStateSizes />
</DemoBox>

<<< @/examples/empty-state/EmptyStateSizes.vue

### Your own icon and description

The `icon` slot takes any 32px icon, decorative; the `description` slot takes
markup, such as a link to help.

<DemoBox>
  <EmptyStateCustom />
</DemoBox>

<<< @/examples/empty-state/EmptyStateCustom.vue

### Inside a window

An empty list in an application window: the empty state sits in the white
well until there is something to show.

<DemoBox>
  <EmptyStateWindow />
</DemoBox>

<<< @/examples/empty-state/EmptyStateWindow.vue

## Look

A Windows 98 system message, as drawn in the Figma file: the 32px icon on the
left, then a bold title, the explanation and the buttons stacked beside it. At
`sm` it fits inside a table body (12px padding, a 13px title, `size="sm"`
buttons); `md` and `lg` fill a panel (24px padding, a 13px or 14px title).
Each size caps the line length at the width drawn in Figma — 280, 360 and
440px. It sits on whatever holds it: the white body of a table, or a panel.

## Anatomy

| Part        | Purpose                                                   |
| ----------- | --------------------------------------------------------- |
| Icon        | 32px, picked by `reason`; `#icon` replaces it. Decorative |
| Title       | A real heading, at a level you choose                     |
| Description | One sentence on what to do next, in the UI face           |
| Actions     | One primary action, optionally one secondary              |

## The three empties

They look similar and mean completely different things. Getting this wrong is
the most common failure — so it is a prop, not just advice.

`reason` picks the 32px icon from the Figma set — an empty folder for
`no-data`, a magnifier for `no-results`, the red error mark for `error` — and
supplies the explanation where that copy is generic. `#icon` replaces the icon
when your domain has a better one; keep it 32×32.

`no-data` supplies **no** default description, because what to do when nothing
exists yet depends entirely on your domain — a library guessing at it would
write worse copy than silence. `no-results` and `error` do supply one, and an
explicit `description` always wins.

Nothing turns red for an `error`: the red error mark already says it, and red
text would make the sentence that says what to do harder to read.

| Situation               | Title names…            | The action is…            | `announce` |
| ----------------------- | ----------------------- | ------------------------- | ---------- |
| Nothing created yet     | the thing missing       | create the first one      | off        |
| Filters matched nothing | the filter, not the app | clear or widen the filter | **on**     |
| The request failed      | the failure             | retry                     | **on**     |

The filtered case is the one libraries get wrong. Offering "Create a project"
to someone who has fifty projects and a bad filter is worse than saying nothing.

## When to use

- A list, table or search result with zero rows.
- A first-run state where the product needs to explain itself once.
- A permission or scope boundary — "no projects shared with you".

## When not to use

- **While loading.** Empty and pending are different states. A user who sees
  "No projects yet" during a slow request will believe it. Use `Skeleton` until
  the data arrives, then decide.
- **For an error.** The default reads as "this worked and there is nothing
  here", which is a lie when the request failed. If you use it for errors,
  change the copy to name the failure and offer a retry.
- **As a full-page 404.** This is a component for a region inside a page, not a
  route-level error screen.
- **With more than two actions.** An empty state offering four choices is a
  menu. Pick the one thing you want the user to do.
- **Where the title restates the obvious.** "No results found" tells the user
  what they can already see. Name the thing: "No users match those filters".

## Props

<!-- @props EmptyStateProps -->

| Prop          | Type                                   | Default      | Description                                                                                                                              |
| ------------- | -------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                               | **required** | What is empty, in a few words.                                                                                                           |
| `description` | `string`                               | —            | One sentence on what to do next. This is the part that turns a dead end into a starting point, and the part most empty states leave out. |
| `reason`      | `'no-data' \| 'no-results' \| 'error'` | `'no-data'`  | Why the view is empty.                                                                                                                   |
| `size`        | `'sm' \| 'md' \| 'lg'`                 | `'md'`       | Scales every part together. `sm` fits inside a table body; `md` and `lg` fill a panel. Pair `sm` with `size="sm"` buttons.               |
| `level`       | `1 \| 2 \| 3 \| 4 \| 5 \| 6`           | `2`          | Heading level for the title.                                                                                                             |
| `announce`    | `boolean`                              | `false`      | Announces the empty state when it appears.                                                                                               |
| `class`       | `string`                               | —            | Additional classes, merged so a consumer's utility wins.                                                                                 |
| `as`          | `string \| Component`                  | `'div'`      | Element or component to render as.                                                                                                       |
| `asChild`     | `boolean`                              | `false`      | Merge props onto the single child element instead of rendering a wrapper.                                                                |

<!-- /@props -->

### Slots

| Slot          | Description                                              |
| ------------- | -------------------------------------------------------- |
| `icon`        | Illustration above the title. Mark it `aria-hidden`      |
| `description` | Replaces the `description` prop, for text needing markup |
| `actions`     | Buttons                                                  |

There is no `default` slot. The layout is the component's job; if you need a
different arrangement you want a plain `div`, not this.

## Keyboard

Nothing of its own. The buttons in `actions` are ordinary focusable controls and
follow document order. The empty state is not itself focusable or in the tab
order.

## Accessibility

**The title is a real heading**, and `level` exists because heading order is
navigation. Screen reader users jump between headings to understand a page; an
empty state nested under an `h1`-and-`h2` page that renders its own `h2` reads
as a new top-level section. Inside a table, `level: 3` is usually right. Pick
the level that continues the outline rather than the one that looks correct.

**`announce` is off by default and that is deliberate.** A first-run empty state
is simply what the page says when it loads — announcing it is redundant with
reading the page. But when a filter narrows a table to nothing, the content
_changed_, and a sighted user sees that instantly while a screen reader user
gets nothing. Turn it on for that case. It renders `role="status"`, which is
polite: it waits for a pause rather than cutting off whatever is being read.

**The icon is decorative.** Mark whatever you pass `aria-hidden="true"`. It
repeats what the title already says, and an unlabelled graphic in the middle of
an explanation is noise. If the icon genuinely carries meaning the title does
not, the title is wrong.
