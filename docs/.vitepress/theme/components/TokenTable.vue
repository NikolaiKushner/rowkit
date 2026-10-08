<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input, Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'
import { tokenReference, type TokenGroup } from '@rowkit/tokens/reference'
import { useCopyToken } from './useCopyToken'

/**
 * Every token a theme sets, from `@rowkit/tokens/reference`: the variable,
 * what it is for — the comment beside its value in the source — and its value
 * in Windows 98 and the modern theme's two schemes. Nothing here is written
 * by hand, so it cannot go stale.
 *
 * With `searchable`, a search box and filters by kind and by component, for
 * the Tokens page; with `group`, one kind alone, as the Themes page lists its
 * style switches. A click on a name copies it.
 */
const props = defineProps<{
  /** One kind of token only, without the filters. */
  group?: TokenGroup
  /** A search box and the kind and component filters. */
  searchable?: boolean
}>()

const GROUPS: [TokenGroup | 'all', string][] = [
  ['all', 'Every kind'],
  ['color', 'Colours'],
  ['size', 'Sizes'],
  ['shadow', 'Shadows'],
  ['radius', 'Corners'],
  ['font', 'Type'],
  ['style', 'Style switches'],
]

const components = [...new Set(tokenReference.flatMap((t) => t.components))].sort()

const query = ref('')
const kind = ref<TokenGroup | 'all'>('all')
const component = ref('all')

const rows = computed(() => {
  const term = query.value.trim().toLowerCase()
  return tokenReference.filter((t) => {
    if (props.group && t.group !== props.group) return false
    if (kind.value !== 'all' && t.group !== kind.value) return false
    if (component.value !== 'all' && !t.components.includes(component.value)) return false
    if (!term) return true
    return t.name.includes(term) || t.description.toLowerCase().includes(term)
  })
})

const LOOKS = ['win98', 'modernLight', 'modernDark'] as const
const LOOK_NAMES = { win98: 'Windows 98', modernLight: 'Modern light', modernDark: 'Modern dark' }

/** `var(--color-vga-silver)` reads as `vga-silver`: the primitive it points at. */
const short = (value: string) => value.replace(/^var\(--color-(.+)\)$/, '$1')

const { copied, copy } = useCopyToken()
</script>

<template>
  <div class="mt-4 flex flex-col gap-3">
    <!-- `rk-demo` keeps the page's text styles off the controls. -->
    <div v-if="searchable" class="rk-demo flex flex-wrap items-center gap-2">
      <Input
        v-model="query"
        type="search"
        aria-label="Search tokens"
        placeholder="Search a name or what it does"
        class="w-[260px]"
      />
      <Select v-model="kind">
        <SelectTrigger aria-label="Kind of token" class="w-[160px]" />
        <SelectContent>
          <SelectItem v-for="[value, label] in GROUPS" :key="value" :value="value" :label="label" />
        </SelectContent>
      </Select>
      <Select v-model="component">
        <SelectTrigger aria-label="Component" class="w-[160px]" />
        <SelectContent>
          <SelectItem value="all" label="Every component" />
          <SelectItem v-for="name in components" :key="name" :value="name" :label="name" />
        </SelectContent>
      </Select>
      <span class="text-ui text-muted-foreground" aria-live="polite">{{ rows.length }} tokens</span>
    </div>

    <div class="rk-table">
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>What it is for</th>
            <th>Windows 98 · modern light · dark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in rows" :key="t.name">
            <td>
              <button
                type="button"
                class="cursor-default border-0 bg-transparent p-0 text-left font-mono text-mono! whitespace-nowrap text-foreground outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted focus-visible:outline-ring"
                :aria-label="`Copy ${t.name}`"
                @click="copy(t.name)"
              >
                {{ copied === t.name ? 'copied' : t.name }}
              </button>
            </td>
            <td>{{ t.description }}</td>
            <!-- One value per look, one under the other, so the table fits beside «On this page». -->
            <td class="w-[200px] font-mono text-mono!">
              <span
                v-for="look in LOOKS"
                :key="look"
                class="flex max-w-[200px] items-center gap-1.5"
                :title="`${LOOK_NAMES[look]}: ${t.values[look]}`"
              >
                <span
                  v-if="t.group === 'color'"
                  aria-hidden="true"
                  class="size-3 shrink-0 rounded-[3px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]"
                  :style="{ background: t.values[look] }"
                />
                <span class="sr-only">{{ LOOK_NAMES[look] }}:</span>
                <span class="truncate">{{ short(t.values[look]) }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
