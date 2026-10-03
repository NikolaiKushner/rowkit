import type { Preview } from '@storybook/vue3-vite'
import theme from './theme'
import './preview.css'

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
  decorators: [
    (story) => {
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
