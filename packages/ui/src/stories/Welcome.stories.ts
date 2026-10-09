import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from '../components/Badge/Badge.vue'
import Button from '../components/Button/Button.vue'
import Separator from '../components/Separator/Separator.vue'

/**
 * The first page of the workshop: the brand, what rowkit is, and how to use
 * the toolbar. Drawn with rowkit's own components, so it reads in whichever
 * theme the toolbar picks; only the logo — the brand, which belongs to no
 * theme — swaps to its light letters on a dark scheme.
 */
const meta: Meta = {
  title: 'Welcome',
  // A page to read, not a component to poke: no addon panel under it.
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    options: { showPanel: false },
  },
}
export default meta

type Story = StoryObj

const tips = [
  ['Theme', 'in the toolbar draws every story in Windows 98 or the modern theme.'],
  ['Scheme', 'picks light or dark for a theme that has a dark scheme.'],
  ['Accessibility', 'runs axe on the story — the same check gates every pull request.'],
  ['Interactions', 'replays a story’s play function step by step.'],
] as const

/** Dark letters unless the modern theme is drawn dark, by choice or by the system. */
function darkScheme(theme: unknown, scheme: unknown): boolean {
  if (theme !== 'modern') return false
  if (scheme === 'dark') return true
  if (scheme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const Default: Story = {
  render: (_args, { globals }) => ({
    components: { Badge, Button, Separator },
    setup: () => ({
      logo: darkScheme(globals.theme, globals.scheme) ? '/logo-light.svg' : '/logo.svg',
      tips,
    }),
    template: `
      <main class="mx-auto flex max-w-[640px] flex-col gap-5 py-6">
        <div class="flex items-center gap-3">
          <img :src="logo" alt="rowkit" width="167" height="32" />
          <Badge variant="primary">1.0 beta</Badge>
        </div>
        <p class="m-0 text-doc text-foreground">
          A professional Vue 3 toolkit — the components a product interface is built from.
          This is its workshop: every component in every variant and state.
        </p>
        <Separator />
        <h1 class="m-0 text-heading font-strong text-foreground">How to use it</h1>
        <ul class="m-0 flex list-none flex-col gap-2 p-0 text-doc text-foreground">
          <li v-for="[name, text] in tips" :key="name">
            <strong class="font-strong">{{ name }}</strong> {{ text }}
          </li>
        </ul>
        <div class="flex flex-wrap gap-2">
          <Button as="a" href="https://rowkit.dev">Documentation</Button>
          <Button as="a" variant="secondary" href="https://github.com/NikolaiKushner/rowkit">GitHub</Button>
          <Button as="a" variant="secondary" href="https://www.npmjs.com/package/rowkit">npm</Button>
        </div>
      </main>
    `,
  }),
}
