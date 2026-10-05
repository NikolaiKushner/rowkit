<script setup lang="ts">
import { useCopyToken } from './useCopyToken'

/**
 * A token scale as a DataTable, the way Figma draws the z-index table: the
 * custom property, its value right-aligned in the mono face, and a third
 * column — a live preview from the `preview` slot, or a note per token from
 * `notes` («Used by»). A click on a name copies it.
 *
 * Generic over the scale because spacing, layers and motion differ only in
 * that third column — one component, rather than several that drift apart.
 */
const props = defineProps<{
  /** The scale, keyed by token name. */
  tokens: Record<string, string>
  /** Custom property prefix: `--spacing` gives `--spacing-4`. */
  prefix: string
  /** A note per token, shown under «Used by». */
  notes?: Record<string, string>
}>()

const slots = defineSlots<{
  /**
   * The visual for one token. Receives its name and its raw value.
   *
   * The name is passed as `token`, not `name`. On a `<slot>` element `name` is
   * the attribute that picks which slot to render, so binding `:name` as a slot
   * prop makes the outlet dynamic: it looks for a slot called `background`,
   * finds nothing, and renders empty — silently, in SSR and on the client
   * alike.
   */
  preview?: (props: { token: string; value: string }) => unknown
}>()

const third = slots.preview ? 'Preview' : props.notes ? 'Used by' : undefined

const { copied, copy } = useCopyToken()
</script>

<template>
  <div class="rk-table">
    <table class="max-w-[640px]">
      <thead>
        <tr>
          <th>Token</th>
          <th class="w-[70px] text-right!">Value</th>
          <th v-if="third">{{ third }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, name) in tokens" :key="name">
          <td>
            <button
              type="button"
              class="cursor-default border-0 bg-transparent p-0 text-left text-ui whitespace-nowrap text-foreground outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted focus-visible:outline-ring"
              :aria-label="`Copy ${prefix}-${name}`"
              @click="copy(`${prefix}-${name}`)"
            >
              {{ copied === `${prefix}-${name}` ? 'copied' : `${prefix}-${name}` }}
            </button>
          </td>
          <td class="text-right! font-mono text-mono! whitespace-nowrap">
            {{ value }}
          </td>
          <td v-if="slots.preview">
            <slot name="preview" :token="String(name)" :value="value" />
          </td>
          <td v-else-if="notes">{{ notes[name] ?? '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
