import type { Preview } from '@storybook/vue3-vite'
import { forScheme } from './theme'
// The Windows 98 faces, loaded the way an app is told to load them.
import '@fontsource/pt-sans/400.css'
import '@fontsource/pt-sans/700.css'
import '@fontsource/vt323/400.css'
import './preview.css'

type Theme = 'win98' | 'modern'
type Scheme = 'system' | 'light' | 'dark'

/**
 * The theme the stories open in. People browsing the workshop start in modern,
 * as rowkit.dev does. The browser tests (Vitest, mode `test`) and their a11y
 * gate start in Windows 98 — rowkit's own default, without an attribute — and
 * `VITE_RK_THEME` picks either explicitly (`test:a11y:modern`).
 */
const requested = import.meta.env.VITE_RK_THEME
const initialTheme: Theme =
  requested === 'modern' || requested === 'win98'
    ? requested
    : import.meta.env.MODE === 'test'
      ? 'win98'
      : 'modern'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'rowkit theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'win98', title: 'Windows 98' },
          { value: 'modern', title: 'Modern' },
        ],
        dynamicTitle: true,
      },
    },
    scheme: {
      description: 'Colour scheme, for themes that have a dark one',
      toolbar: {
        title: 'Scheme',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: initialTheme, scheme: 'system' },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { theme: forScheme() },
    options: {
      storySort: {
        order: ['Welcome', 'Patterns', 'Foundations', 'Data', 'Overlay', '*'],
      },
    },
    a11y: {
      // Fail the story rather than reporting quietly in a panel. Definition of
      // done says zero violations, which only means something if it is a gate.
      test: 'error',
    },
  },
  decorators: [
    (story, context) => {
      // The theme goes on <html>, as an app sets it, so overlays teleported to
      // <body> are themed too.
      const root = document.documentElement
      root.dataset.theme = (context.globals.theme as Theme | undefined) ?? initialTheme
      const scheme = (context.globals.scheme as Scheme | undefined) ?? 'system'
      if (scheme === 'system') delete root.dataset.colorScheme
      else root.dataset.colorScheme = scheme
      // Paint the iframe body too — otherwise screenshots show a bare page
      // around a short story root and look broken.
      document.body.style.background = 'var(--color-background)'
      document.body.style.margin = '0'
      document.body.style.minHeight = '100vh'
      return {
        components: { story },
        template: `<div class="min-h-[100vh] bg-background font-sans text-foreground p-6"><story /></div>`,
      }
    },
  ],
}

export default preview
