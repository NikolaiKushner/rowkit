# Loading states

Three rules, one component. Most of the work is deciding _whether_ to show a
loading state at all — a placeholder that flashes for 80ms is worse than no
placeholder, and an empty state shown during a slow request is a lie.

<script setup>
import PatternDelayedSkeleton from '../examples/patterns/PatternDelayedSkeleton.vue'
import PatternOptimistic from '../examples/patterns/PatternOptimistic.vue'
import PatternLongTask from '../examples/patterns/PatternLongTask.vue'
</script>

<DemoBox layout="stack">
  <PatternDelayedSkeleton />
</DemoBox>

<<< @/examples/patterns/PatternDelayedSkeleton.vue

Press **Fast response** and watch nothing happen: the request finishes before the
placeholder is allowed to appear. Press **Slow response** and the placeholder
arrives, in the real column layout, and the data lands without the page moving.

## The delay, in eleven lines

```ts
const pending = ref(false)
const showSkeleton = ref(false)

async function load() {
  pending.value = true
  const delay = setTimeout(() => {
    if (pending.value) showSkeleton.value = true
  }, 150)

  try {
    rows.value = await fetchRows()
  } finally {
    clearTimeout(delay)
    pending.value = false
    showSkeleton.value = false
  }
}
```

`pending` drives whatever must react immediately — disabling a re-submit,
tracking in-flight state. `showSkeleton` is the only thing the placeholder reads.

**150ms is the number.** Below roughly that, a person does not perceive the wait
as a wait; a placeholder appearing and vanishing inside it registers as a glitch,
not as feedback. Above it they have noticed, and silence starts to read as broken.

## Rules

**Match the shape of what is arriving.** A skeleton exists to reserve the layout
so nothing jumps when the data lands. If you do not know the shape — an unknown
number of rows, a response that might be an error — you want a spinner or
nothing, not a guess that will be wrong.

`DataTable`'s `loading` does this for you: placeholder rows in the real column
widths, with the header already correct.

**Empty and pending are different states.** A user who sees "No projects yet"
during a slow request will believe it, and some of them will go and create a
duplicate. Never fall through to the empty state until the request has actually
resolved:

```vue
<DataTable :rows="rows" :columns="columns" caption="Projects" :loading="showSkeleton">
  <template #empty>
    <!-- Only reached once loading is false. -->
    <EmptyState reason="no-data" title="No projects yet" />
  </template>
</DataTable>
```

**Announce once, not per placeholder.** `Skeleton` is `aria-hidden` and has no
say in it — a loading table renders dozens of them, and a screen reader user
should hear "Loading team members" once. That is what `loadingLabel` is for: one
live region standing for the whole region.

Reach for `Skeleton`'s own `label` prop only on the single element that
represents a region you are loading by itself.

**Do not re-render a spinner on top of content that is already there.** For a
refresh — a filter change over rows already on screen — leave the rows and set
`aria-busy` on the container instead. Replacing populated content with
placeholders makes a 200ms refetch feel like a page load.

## Optimistic updates

For a small change that almost always succeeds — a star, a toggle — show the
result at once and send the request behind it. If the server says no, put it
back and say so in words. The third project here always fails.

<DemoBox layout="stack">
  <PatternOptimistic />
</DemoBox>

<<< @/examples/patterns/PatternOptimistic.vue

## Long tasks: measure them

A task with a known size gets a progress bar and a count, not a placeholder —
and a Cancel. The words beside the bar say how far along it is; blocks alone
do not.

<DemoBox layout="stack">
  <PatternLongTask />
</DemoBox>

<<< @/examples/patterns/PatternLongTask.vue

## Composing skeletons

Away from the table, the primitives are a bar, a circle and a block, and you
arrange them into the layout that is arriving:

<DemoBox layout="stack">
  <div class="flex w-full max-w-md items-center gap-4">
    <Skeleton variant="circle" />
    <div class="flex-1"><Skeleton :lines="2" /></div>
  </div>
</DemoBox>

```vue
<div class="flex items-center gap-4">
  <Skeleton variant="circle" />
  <div class="flex-1">
    <Skeleton :lines="2" />
  </div>
</div>
```

The last bar in a stack is shortened, because real paragraphs do not end flush
with the margin and a stack of equal bars reads as a table.

## Motion

The skeleton's dither steps one pixel sideways every 400ms, behind
`motion-safe:`, so it is absent entirely for anyone who has asked for reduced
motion — the shapes stay, the step goes, and nothing else changes. That is the
right trade for an _ambient_ loop, which carries no information the still shape
does not.

`Button`'s loading state is a still hourglass, as Windows 98 drew it, so there
is nothing there to gate. `styles/motion.test.ts` keeps the rule honest: an
ungated looping animation fails the build unless it is exempted by name, with a
written reason.
