<script setup lang="ts">
import { useCopyToken } from './useCopyToken'

/**
 * A list of tokens with a live preview of each one.
 *
 * Generic over the scale because spacing, radii, shadows and semantic colours
 * differ only in how a value is best shown — one component with a `preview`
 * slot, rather than four that share a layout and drift apart.
 */
defineProps<{
  /** The scale, keyed by token name. */
  tokens: Record<string, string>
  /** Custom property prefix: `--spacing` gives `--spacing-4`. */
  prefix: string
}>()

defineSlots<{
  /**
   * The visual for one token. Receives its name and its raw value.
   *
   * The name is passed as `token`, not `name`. On a `<slot>` element `name` is
   * the attribute that picks which slot to render, so binding `:name` as a slot
   * prop makes the outlet dynamic: it looks for a slot called `background`,
   * finds nothing, and renders empty — silently, in SSR and on the client
   * alike.
   */
  preview: (props: { token: string; value: string }) => unknown
}>()

const { copied, copy } = useCopyToken()
</script>

<template>
  <table class="!my-4 !block w-full overflow-x-auto">
    <thead>
      <tr>
        <th class="text-left">Token</th>
        <th class="text-left">Value</th>
        <th class="text-left">Preview</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, name) in tokens" :key="name">
        <td>
          <button
            type="button"
            class="cursor-pointer border-none bg-transparent p-0 font-mono text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            :aria-label="`Copy ${prefix}-${name}`"
            @click="copy(`${prefix}-${name}`)"
          >
            {{ copied === `${prefix}-${name}` ? 'copied' : `${prefix}-${name}` }}
          </button>
        </td>
        <td class="font-mono text-sm text-text-muted">{{ value }}</td>
        <td><slot name="preview" :token="String(name)" :value="value" /></td>
      </tr>
    </tbody>
  </table>
</template>
