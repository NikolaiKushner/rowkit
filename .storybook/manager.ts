import { addons } from 'storybook/manager-api'
import { forScheme } from './theme'

addons.setConfig({
  theme: forScheme(),
  sidebar: {
    showRoots: true,
  },
})

/* The onboarding checklist is Storybook's, not rowkit's. */
const style = document.createElement('style')
style.dataset.rowkit = 'manager-theme'
style.textContent = `
#storybook-checklist-widget,
:has(> #storybook-checklist-widget) {
  display: none !important;
}
`
document.head.append(style)
