# EmptyState

**Stage:** 🟢 Stable

The screen a table shows when it has nothing to show. A title, an explanation,
and a way forward — the last of which is the part usually missing.

```vue
<EmptyState title="No projects yet" description="Projects group your work.">
  <template #actions>
    <Button>Create a project</Button>
  </template>
</EmptyState>
```

## Anatomy

| Part        | Purpose                                                         |
| ----------- | --------------------------------------------------------------- |
| Icon        | Optional illustration. Decorative, muted so it does not compete |
| Title       | A real heading, at a level you choose                           |
| Description | One sentence on what to do next. Width-capped for readability   |
| Actions     | One primary action, optionally one secondary                    |

## The three empties

They look similar and mean completely different things. Getting this wrong is
the most common failure, and no prop will save you from it — it is a copy
decision.

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

| Prop          | Type                         | Default | Description                                               |
| ------------- | ---------------------------- | ------- | --------------------------------------------------------- |
| `title`       | `string`                     | —       | Required. What is empty, in a few words                   |
| `description` | `string`                     | —       | One sentence on what to do next                           |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`  | Scales every part together. `sm` fits inside a table body |
| `level`       | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2`     | Heading level for the title                               |
| `announce`    | `boolean`                    | `false` | Announces the state when it replaces existing content     |
| `class`       | `string`                     | —       | Merged so your utility wins over the component's          |
| `as`          | `string \| Component`        | `'div'` | Element to render                                         |
| `asChild`     | `boolean`                    | `false` | Merge props onto the child instead of wrapping            |

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

## Dark mode

Nothing special — text uses `text` and `text-muted`, the icon `text-subtle`, and
all three flip with the theme. The component paints no background of its own, so
it sits on whatever surface contains it.
