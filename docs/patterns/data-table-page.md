# A data table page

Filter bar, table, pagination, and the empty states — wired the way a
server-backed page actually works. This is the pattern rowkit exists for; every
component below is doing one job, and the composition is where the decisions
live.

<script setup>
import PatternUsersPage from '../examples/patterns/PatternUsersPage.vue'
import PatternServerPage from '../examples/patterns/PatternServerPage.vue'
import PatternBulkActions from '../examples/patterns/PatternBulkActions.vue'
import PatternDetailPanel from '../examples/patterns/PatternDetailPanel.vue'
</script>

<DemoBox layout="stack">
  <PatternUsersPage />
</DemoBox>

Search for a name, narrow by role, sort a column, page through. Then filter down
to nothing and watch the empty state — it says the filter matched nothing, not
that you have no users.

## The code

The whole page, exactly as the demo above runs it. `people` is any array of
rows with a stable `id` — here the sample set from the DataTable examples.

<<< @/examples/patterns/PatternUsersPage.vue

## Why it is wired this way

**The page resets the page number, not the components.** `Pagination` never
moves the page on its own — not when the page size changes, not when the filters
narrow. That watcher is four lines and it belongs to you, because the right
answer differs: a filter change should land on page 1, while a page-size change
in a long audit log might reasonably keep the user near the row they were
reading. A component cannot know which you meant, so it reports and you decide.

Without the watcher the failure is quiet and nasty: filter 137 users down to 3
while sitting on page 9, and the table renders empty with pagination insisting
there are nine pages.

**Sorting happens outside the table.** `DataTable` renders what it is handed and
reports what was clicked; it never reorders its own rows. That is not a
limitation, it is the only correct default for a paged table — sorting inside the
table would reorder the ten rows on screen and present them as if they were the
top ten of 137. Swap `sorted` for a server call and nothing else on the page
changes.

**`sortValue` exists for statuses.** Sorted alphabetically, `invited` falls
between `active` and `suspended`, which is meaningless. Mapping the three to
`0 | 1 | 2` sorts them by severity, which is what someone clicking that header
wants.

**The empty state knows why it is empty.** `reason="no-results"` changes the copy
and the action — clear the filters, rather than create your first user. Offering
"create a user" to an admin with 137 of them and a bad filter is the failure the
prop exists to prevent. `announce` is on because the table had rows a moment ago
and a screen reader user gets no other signal that the filter did anything.

**Chip ids name the filter, not its value.** `'role'`, never `'role-admin'`. The
value changes as the user picks a different one; the identity must not, because
`@remove` hands that id back and the handler switches on it.

**Every filter control has a label.** `labelSrOnly` keeps the toolbar visually
clean without taking the name away. A placeholder is not a label — it disappears
the moment a value is chosen, which is exactly when someone asks what the control
is.

## Making it server-backed

Replace the three computeds with a request and change nothing else:

```ts
const { data } = await useFetch('/api/users', {
  query: computed(() => ({
    q: search.value,
    role: role.value,
    status: status.value,
    sort: sort.value?.key,
    direction: sort.value?.direction,
    page: page.value,
    pageSize: pageSize.value,
  })),
})

const pageRows = computed(() => data.value?.rows ?? [])
const total = computed(() => data.value?.total ?? 0)
```

That substitution being this small is the point of every "the consumer owns
state" decision in [the conventions](/conventions). The components never knew
where the rows came from.

Add `:loading="pending"` to the table and it renders placeholder rows in the real
column layout while the request is in flight — see
[loading states](/patterns/loading-states) for when that helps and when it makes
things worse.

### A working version

The same page against a slow «server»: typing waits for a 300ms pause, sort and
page fetch at once, and an answer that arrives after a newer request is
dropped. Placeholders appear only on the first load, and only once it has taken
150ms; a refresh keeps the rows on screen and marks the region `aria-busy`.

<DemoBox layout="stack">
  <PatternServerPage />
</DemoBox>

<<< @/examples/patterns/PatternServerPage.vue

## Acting on a selection

The toolbar above the table talks about the selection — how many, and what can
be done to them. A destructive action asks first, with the safe choice as the
default, and then offers Undo, because a confirmation is not a substitute for a
way back.

<DemoBox layout="stack">
  <PatternBulkActions />
</DemoBox>

<<< @/examples/patterns/PatternBulkActions.vue

## Details beside the list

A list and the record it points at, side by side — stacked on a phone. A click
or Enter opens a row; the radio column shows which one is open and works from
the keyboard, so the row click is an extra, not the only way in.

<DemoBox layout="stack">
  <PatternDetailPanel />
</DemoBox>

<<< @/examples/patterns/PatternDetailPanel.vue
