<script setup lang="ts">
import { computed, h, ref, type FunctionalComponent } from 'vue'
import { defineTheme, type ThemeValues } from 'rowkit/theme'
import {
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  Field,
  GroupBox,
  Input,
  ProgressBar,
  Radio,
} from 'rowkit'

/**
 * A theme of your own, built live: pick a base, an accent, corners, density
 * and a typeface, and the preview is drawn in a theme `defineTheme` writes —
 * the same function, the same CSS an app would ship. The CSS is shown under
 * the preview, ready to copy.
 */
type Base = 'modern' | 'win98'
type Density = 'compact' | 'regular' | 'roomy'
type Face = 'system' | 'serif' | 'rounded' | 'mono'

const base = ref<Base>('modern')
const scheme = ref<'light' | 'dark'>('light')
const accent = ref('#5b3df5')
const radius = ref(8)
const density = ref<Density>('regular')
const face = ref<Face>('system')
const copied = ref(false)

const NAME = 'my-theme'

const FACES: Record<Face, string> = {
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  rounded: 'ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
}

/** Control heights and table rows per density, xs / sm / md / lg / row-sm / row-md. */
const DENSITY: Record<Exclude<Density, 'regular'>, number[]> = {
  compact: [20, 24, 28, 32, 24, 28],
  roomy: [28, 32, 40, 48, 36, 44],
}

const vars = computed<ThemeValues>(() => {
  const a = accent.value
  const toward = (other: string, share: number) =>
    `color-mix(in srgb, ${a} ${String(share)}%, ${other})`
  const r = radius.value
  const out: ThemeValues = {
    '--color-control-primary': a,
    '--color-control-primary-hover': toward('black', 90),
    '--color-control-primary-active': toward('black', 78),
    '--color-surface-selected': a,
    '--color-checked': a,
    '--color-on-checked': '#ffffff',
    '--color-progress': a,
    '--color-primary-solid': a,
    '--color-primary-solid-hover': toward('black', 85),
    '--color-ring': a,
    '--color-focus-ring': `color-mix(in srgb, ${a} 80%, transparent)`,
    '--color-link': toward('black', 85),
    '--radius-xs': `${String(Math.round(r * 0.5))}px`,
    '--radius-sm': `${String(Math.round(r * 0.7))}px`,
    '--radius-md': `${String(r)}px`,
    '--radius-lg': `${String(Math.round(r * 1.4))}px`,
    '--radius-xl': `${String(Math.round(r * 1.7))}px`,
    '--font-sans': FACES[face.value],
  }
  if (base.value === 'win98') {
    // Windows 98's default button is the silver face with black text; with an
    // accent it takes the accent and white text, and the title bar follows.
    out['--color-control-primary-foreground'] = '#ffffff'
    out['--color-titlebar-from'] = a
    out['--color-titlebar-to'] = toward('white', 60)
  }
  if (density.value !== 'regular') {
    const [xs, sm, md, lg, rowSm, rowMd] = DENSITY[density.value].map((n) => `${String(n)}px`)
    Object.assign(out, {
      '--spacing-control-xs': xs,
      '--spacing-control-sm': sm,
      '--spacing-control-md': md,
      '--spacing-control-lg': lg,
      '--spacing-icon-xs': xs,
      '--spacing-icon-sm': sm,
      '--spacing-icon-md': md,
      '--spacing-icon-lg': lg,
      '--spacing-row-sm': rowSm,
      '--spacing-row-md': rowMd,
    })
  }
  return out
})

const css = computed(() =>
  defineTheme({
    name: NAME,
    extends: base.value,
    light: vars.value,
    // The accent carries into the dark scheme; the base supplies the rest of it.
    dark: base.value === 'win98' ? false : vars.value,
  })
)

/**
 * What a reader copies: the call, not the 200 lines it expands to — and the
 * same call the preview makes, so the dark scheme keeps the accent too.
 */
const source = computed(() => {
  const lines = Object.entries(vars.value).map(([k, v]) => `  '${k}': '${String(v)}',`)
  return [
    "import { defineTheme } from 'rowkit/theme'",
    '',
    'const values = {',
    ...lines,
    '}',
    '',
    'export const css = defineTheme({',
    `  name: '${NAME}',`,
    `  extends: '${base.value}',`,
    '  light: values,',
    base.value === 'win98'
      ? '  dark: false,'
      : '  dark: values, // the accent carries into the dark scheme',
    '})',
  ].join('\n')
})

async function copy(): Promise<void> {
  await navigator.clipboard.writeText(source.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

/** A <style> element: templates may not hold one, a render function may. */
const ThemeStyle: FunctionalComponent<{ css: string }> = (props) => h('style', props.css)

const options = <T extends string>(values: readonly (readonly [T, string])[]) => values
const BASES = options<Base>([
  ['modern', 'Modern'],
  ['win98', 'Windows 98'],
])
const SCHEMES = options<'light' | 'dark'>([
  ['light', 'Light'],
  ['dark', 'Dark'],
])
const DENSITIES = options<Density>([
  ['compact', 'Compact'],
  ['regular', 'Regular'],
  ['roomy', 'Roomy'],
])
const FACE_LABELS = options<Face>([
  ['system', 'System'],
  ['serif', 'Serif'],
  ['rounded', 'Rounded'],
  ['mono', 'Mono'],
])

const plan = ref<'team' | 'business'>('team')
const updates = ref(true)
</script>

<template>
  <div class="rk-demo flex flex-col gap-4">
    <ThemeStyle :css="css" />

    <div class="grid gap-x-6 gap-y-3 text-ui sm:grid-cols-2">
      <div class="flex flex-col gap-1">
        <span id="tb-base" class="font-strong">Start from</span>
        <ButtonGroup aria-labelledby="tb-base">
          <Button
            v-for="[value, label] in BASES"
            :key="value"
            size="sm"
            variant="secondary"
            :pressed="base === value"
            @click="base = value"
            >{{ label }}</Button
          >
        </ButtonGroup>
      </div>
      <div v-if="base === 'modern'" class="flex flex-col gap-1">
        <span id="tb-scheme" class="font-strong">Scheme</span>
        <ButtonGroup aria-labelledby="tb-scheme">
          <Button
            v-for="[value, label] in SCHEMES"
            :key="value"
            size="sm"
            variant="secondary"
            :pressed="scheme === value"
            @click="scheme = value"
            >{{ label }}</Button
          >
        </ButtonGroup>
      </div>
      <label class="flex flex-col gap-1">
        <span class="font-strong">Accent</span>
        <span class="flex items-center gap-2">
          <input v-model="accent" type="color" class="h-7 w-12 cursor-pointer" />
          <code>{{ accent }}</code>
        </span>
      </label>
      <label class="flex flex-col gap-1">
        <span class="font-strong">Corners: {{ radius }}px</span>
        <input v-model.number="radius" type="range" min="0" max="16" step="1" class="w-full" />
      </label>
      <div class="flex flex-col gap-1">
        <span id="tb-density" class="font-strong">Density</span>
        <ButtonGroup aria-labelledby="tb-density">
          <Button
            v-for="[value, label] in DENSITIES"
            :key="value"
            size="sm"
            variant="secondary"
            :pressed="density === value"
            @click="density = value"
            >{{ label }}</Button
          >
        </ButtonGroup>
      </div>
      <div class="flex flex-col gap-1">
        <span id="tb-face" class="font-strong">Typeface</span>
        <ButtonGroup aria-labelledby="tb-face">
          <Button
            v-for="[value, label] in FACE_LABELS"
            :key="value"
            size="sm"
            variant="secondary"
            :pressed="face === value"
            @click="face = value"
            >{{ label }}</Button
          >
        </ButtonGroup>
      </div>
    </div>

    <!-- The preview, drawn in the theme above. -->
    <div
      :data-theme="NAME"
      :data-color-scheme="base === 'modern' ? scheme : undefined"
      class="flex flex-col gap-4 rounded-lg bg-background p-4 font-sans text-ui text-foreground"
    >
      <GroupBox legend="Workspace">
        <Field label="Workspace name"><Input placeholder="Acme Inc." /></Field>
        <div class="flex flex-wrap gap-4">
          <Radio v-model="plan" value="team" label="Team" />
          <Radio v-model="plan" value="business" label="Business" />
          <Checkbox v-model="updates" label="Product updates" />
        </div>
        <ProgressBar :value="62" aria-label="Storage used" />
      </GroupBox>
      <div class="flex flex-wrap items-center gap-2">
        <Button>Save changes</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="ghost">Preview</Button>
        <Badge variant="primary">Beta</Badge>
        <Badge variant="success" appearance="solid">Active</Badge>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-2">
        <span class="font-strong text-ui">Your theme, as code</span>
        <Button size="sm" variant="secondary" @click="copy">{{
          copied ? 'Copied' : 'Copy'
        }}</Button>
      </div>
      <pre
        class="scrollbar-themed m-0 max-h-72 overflow-auto rounded-md bg-input p-3 font-mono text-mono shadow-table"
      ><code>{{ source }}</code></pre>
    </div>
  </div>
</template>
