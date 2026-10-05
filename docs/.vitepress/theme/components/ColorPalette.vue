<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCopyToken } from './useCopyToken'

/**
 * The colour primitives as Windows 98 Paint's colour box: the current colour
 * over white at the left, the swatches in two rows — each dark above its
 * light — and the chosen one's name, value and custom property. A click
 * chooses a swatch and copies its custom property.
 *
 * Rendered from the tokens package, so the palette cannot fall out of step
 * with it.
 */
const props = defineProps<{
  /** `tokens.color.vga` and `tokens.color.win98`. */
  vga: Record<string, string>
  win98: Record<string, string>
}>()

/* Paint's order: column by column, the dark colour over its light partner. */
const order = [
  ['vga', 'black'],
  ['vga', 'white'],
  ['vga', 'gray'],
  ['vga', 'silver'],
  ['vga', 'maroon'],
  ['vga', 'red'],
  ['vga', 'olive'],
  ['vga', 'yellow'],
  ['vga', 'green'],
  ['win98', 'light'],
  ['vga', 'teal'],
  ['win98', 'title-gray'],
  ['vga', 'navy'],
  ['vga', 'blue'],
  ['win98', 'dark-gray'],
  ['win98', 'info'],
  ['win98', 'title-blue'],
] as const

interface Swatch {
  /** The design's variable name: `vga/navy`. */
  name: string
  /** The custom property: `--color-vga-navy`. */
  property: string
  value: string
}

const swatches = computed<Swatch[]>(() => {
  const families = { vga: props.vga, win98: props.win98 }
  const listed = order.flatMap(([family, step]) => {
    const value = families[family][step]
    return value === undefined ? [] : [{ family, step, value }]
  })
  // A primitive added to the package later still shows, after the known ones.
  const rest = (['vga', 'win98'] as const).flatMap((family) =>
    Object.entries(families[family])
      .filter(([step]) => !order.some(([f, s]) => f === family && s === step))
      .map(([step, value]) => ({ family, step, value }))
  )
  return [...listed, ...rest].map(({ family, step, value }) => ({
    name: `${family}/${step}`,
    property: `--color-${family}-${step}`,
    value,
  }))
})

const chosen = ref('vga/navy')
const current = computed(
  () => swatches.value.find((swatch) => swatch.name === chosen.value) ?? swatches.value[0]
)

const { copied, copy } = useCopyToken(2000)

function choose(swatch: Swatch): void {
  chosen.value = swatch.name
  void copy(swatch.property)
}
</script>

<template>
  <div class="mt-4 flex flex-wrap items-start gap-2 bg-card p-2 shadow-window">
    <!-- The current colour, over white: Paint's foreground over background. -->
    <span aria-hidden="true" class="relative size-[46px] shrink-0 bg-card shadow-sunken">
      <span class="absolute top-5 left-5 size-5 bg-vga-white shadow-raised" />
      <span
        class="absolute top-1.5 left-1.5 size-5 shadow-raised"
        :style="{ background: current?.value }"
      />
    </span>

    <ul
      aria-label="Colour primitives"
      class="m-0! grid shrink-0 list-none grid-flow-col grid-rows-2 p-0!"
    >
      <li v-for="swatch in swatches" :key="swatch.name" class="m-0!">
        <button
          type="button"
          class="relative block size-6 cursor-default border-0 bg-card p-0.5 shadow-sunken outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-dotted focus-visible:outline-ring"
          :aria-label="`${swatch.name} ${swatch.value} — copy ${swatch.property}`"
          :aria-pressed="swatch.name === chosen"
          @click="choose(swatch)"
        >
          <span
            class="block size-5"
            :class="swatch.name === chosen && 'border border-dashed border-ring'"
            :style="{ background: swatch.value }"
          />
        </button>
      </li>
    </ul>

    <p
      v-if="current"
      class="m-0! flex flex-col gap-0.5 text-ui! whitespace-nowrap"
      aria-live="polite"
    >
      <span class="font-bold text-foreground">{{ current.name }}</span>
      <span class="text-text-subtle">
        {{ current.value }} · var({{ current.property }}){{
          copied === current.property ? ' — copied' : ''
        }}
      </span>
    </p>
  </div>
</template>
