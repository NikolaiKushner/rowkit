import type { Preview } from '@storybook/vue3-vite'
import theme from './theme'
import './preview.css'

/**
 * Dark mode is a class on the document, not a media query — see the
 * `@custom-variant` in the token stylesheet — so the toolbar toggle sets that
 * class rather than swapping a Storybook background.
 */
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { theme },
    options: {
      storySort: {
        order: ['Patterns', 'Foundations', 'Data', 'Overlay', '*'],
      },
    },
    a11y: {
      // Fail the story rather than reporting quietly in a panel. Definition of
      // done says zero violations, which only means something if it is a gate.
      test: 'error',
    },
  },
  globalTypes: {
    theme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', theme === 'dark')
      // Paint the iframe body too — otherwise dark screenshots show a white
      // page around a short story root and look broken.
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
