# FilterBar

**Stage:** 🟢 Stable

A toolbar above a table: a search box, whatever filter controls the table needs,
and a chip for every filter currently applied.

```vue
<FilterBar
  v-model:search="search"
  :filters="applied"
  :result-count="results.length"
  @remove="unset"
  @clear="reset"
>
  <template #controls>
    <Field label="Role" label-sr-only>
      <Select v-model="role" :options="roles" placeholder="Role" />
    </Field>
  </template>
</FilterBar>
```

A control in the `controls` slot still needs a name. A placeholder is not one —
it disappears the moment a value is chosen, which is exactly when a screen
reader user asks what the control is. `labelSrOnly` keeps the toolbar visually
uncluttered without taking the name away.

<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const role = ref()

const roles = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
]

const people = [
  { name: 'Ada Lovelace', role: 'owner' },
  { name: 'Grace Hopper', role: 'admin' },
  { name: 'Alan Turing', role: 'member' },
  { name: 'Katherine Johnson', role: 'member' },
]

const applied = computed(() => [
  ...(search.value ? [{ id: 'search', label: 'Search', value: search.value }] : []),
  ...(role.value ? [{ id: 'role', label: 'Role', value: roles.find((r) => r.value === role.value).label }] : []),
])

const results = computed(() =>
  people.filter(
    (person) =>
      person.name.toLowerCase().includes(search.value.toLowerCase()) &&
      (!role.value || person.role === role.value)
  )
)

function unset(id) {
  if (id === 'search') search.value = ''
  if (id === 'role') role.value = undefined
}

function reset() {
  search.value = ''
  role.value = undefined
}
</script>

<DemoBox layout="stack">
  <FilterBar
    v-model:search="search"
    :filters="applied"
    :result-count="results.length"
    label="Example filters"
    searchable
    search-placeholder="Search people"
    @remove="unset"
    @clear="reset"
  >
    <template #controls>
      <Field label="Role" label-sr-only>
        <Select v-model="role" :options="roles" placeholder="Role" class="min-w-40" />
      </Field>
    </template>
  </FilterBar>
  <ul class="!my-0 !pl-5 text-sm text-muted-foreground">
    <li v-for="person in results" :key="person.name">{{ person.name }}</li>
  </ul>
</DemoBox>

Type a name or pick a role. A chip appears for each applied filter, "Clear all"
appears only once something is applied, and the result count updates in a live
region — which is the only feedback a screen reader user gets that the filter
did anything at all.

Remove a chip with the keyboard and watch where focus lands: the next chip, or
the bar itself when the last one goes. Focus never falls back to the top of the
document, which is the usual outcome when the focused element is destroyed.

## Anatomy

| Part         | Purpose                                            |
| ------------ | -------------------------------------------------- |
| Search box   | Free-text search, `v-model:search`                 |
| Controls     | Your filter controls, in the `controls` slot       |
| Chips        | One per applied filter, each with a remove control |
| Clear all    | Appears only while something is applied            |
| Result count | A live region, so filtering announces its effect   |

## It displays state, it does not own it

`filters` is a prop, not a model. The bar shows what is applied and emits
`remove` with the chip's `id`; deciding what clearing "Role" means is the
application's job, because only it knows whether that resets a `Select`, drops a
query parameter, or refetches.

This is why `id` should identify the _filter_ rather than its value — `'role'`,
not `'role-admin'`. The value changes; the identity should not.

## When to use

- Above a table where more than one thing can be filtered at once.
- Any filter set complex enough that the user can lose track of what is applied.

## When not to use

- **For a single filter.** One `Select` above a table needs no chips, no clear
  control, and no landmark. This component starts paying off at two or three.
- **For sorting.** Sorting is not a filter — it changes order, not membership,
  and a "Sorted by name" chip implies you could remove it and see more rows.
  That belongs in `DataTable`'s column headers.
- **As a form.** Filters apply immediately. If the user has to press "Apply",
  you have a form, and it should say so.
- **For navigation.** Tabs that switch between "All / Active / Archived" are
  navigation. Chips imply a set you compose freely.

## Props

<!-- @props FilterBarProps -->

| Prop                | Type           | Default                    | Description                                                                                 |
| ------------------- | -------------- | -------------------------- | ------------------------------------------------------------------------------------------- |
| `filters`           | `FilterChip[]` | `() => []`                 | The filters currently applied, shown as chips.                                              |
| `resultCount`       | `number`       | —                          | Number of matching rows.                                                                    |
| `searchable`        | `boolean`      | `true`                     | Shows the search box.                                                                       |
| `searchPlaceholder` | `string`       | `'Search…'`                | Placeholder for the search box.                                                             |
| `searchLabel`       | `string`       | `'Search'`                 | Accessible name for the search box. Visually hidden.                                        |
| `clearLabel`        | `string`       | `'Clear all'`              | Label for the clear-all control.                                                            |
| `removeLabel`       | `string`       | `'Remove {filter} filter'` | Accessible name for the chip's remove control. `{filter}` is replaced with the chip's text. |
| `label`             | `string`       | `'Filters'`                | Accessible name for the region.                                                             |
| `size`              | `'sm' \| 'md'` | `'md'`                     | Control height and text size.                                                               |
| `disabled`          | `boolean`      | `false`                    | Disables every control.                                                                     |
| `class`             | `string`       | —                          | Additional classes, merged so a consumer's utility wins.                                    |

<!-- /@props -->

### FilterChip

| Field       | Type      | Description                                                   |
| ----------- | --------- | ------------------------------------------------------------- |
| `id`        | `string`  | Stable identity, returned by `remove`                         |
| `label`     | `string`  | The field — "Role", "Status"                                  |
| `value`     | `string`  | The applied value. Omit and the chip shows the label alone    |
| `removable` | `boolean` | Defaults to `true`. `false` for a scope the user cannot clear |

### v-model, events and slots

| Name             | Kind  | Description                                    |
| ---------------- | ----- | ---------------------------------------------- |
| `v-model:search` | model | The search term                                |
| `@remove`        | event | Payload is the chip's `id`                     |
| `@clear`         | event | Clear-all was activated                        |
| `#controls`      | slot  | Your filter controls                           |
| `#actions`       | slot  | Trailing actions, pushed to the end of the row |
| `#chip`          | slot  | Replaces a chip's text. Scoped: `{ chip }`     |
| `#summary`       | slot  | Replaces the result count. Scoped: `{ count }` |

## Behaviour worth knowing

**Focus survives removing a chip.** Dismissing a chip destroys the element that
had focus. Left alone, the browser drops focus to the top of the document —
mid-task, silently, and every further removal then costs a fresh round of
tabbing. Focus instead moves to the chip that took the removed one's place, or
the last chip if it was the final one, so a keyboard user can clear several in a
row. With no chips left it falls back to the search box, and failing that to the
region itself.

This only applies to removals the user asked for. A filter that disappears for
another reason did not take focus with it, and is left alone.

**The result count is a live region.** Filtering is the one interaction where a
sighted user gets instant feedback — the table visibly shrinks — and a screen
reader user gets nothing. `resultCount` closes that gap. It is silent on first
render, because live regions announce changes rather than initial content.

## Keyboard

| Key                                 | Action                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| <kbd>Tab</kbd>                      | Moves through search, controls, each chip's remove, clear all |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused control                                 |

There is no roving tabstop across the chips. Each remove control is a button in
document order, so <kbd>Tab</kbd> reaches every one of them — the same reasoning
as `Pagination`'s page numbers.

## Accessibility

**The bar is a `search` landmark**, so it can be reached by landmark navigation
rather than only by tabbing. **Give concurrent instances distinct `label`s** —
two landmarks sharing a name is an axe `landmark-unique` violation and leaves a
screen reader user with two identical entries they cannot tell apart.

**Every remove control names its filter**: "Remove Role: Admin filter", not
"Remove". Three buttons all called "Remove" are useless read out of context, and
a list of them is exactly what a screen reader user gets.

**The search box has a real label**, visually hidden via `Field`'s
`labelSrOnly`. A placeholder is not a label — it disappears on the first
keystroke and is not reliably announced.

## Dark mode

Chips use `surface-subtle` with a `border` hairline, both of which flip with the
theme. They are deliberately quieter than `Badge`: a chip states a condition the
user set, not a status that needs to catch the eye, and a row of coloured chips
above a table competes with the data.
