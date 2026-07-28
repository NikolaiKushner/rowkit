import type { Preview } from '@storybook/vue3-vite'
import './preview.css'

/**
 * Dark mode is a class on the document, not a media query — see the
 * `@custom-variant` in the token stylesheet — so the toolbar toggle sets that
 * class rather than swapping a Storybook background.
 */
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
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
      return {
        components: { story },
        template: `<div class="bg-background text-text p-6"><story /></div>`,
      }
    },
  ],
}

export default preview
