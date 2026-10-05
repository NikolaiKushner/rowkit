import { colorPrimitives, semanticColor, shadow, textShadow } from '@rowkit/tokens'
import { addons } from 'storybook/manager-api'
import theme from './theme'

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
  },
})

/**
 * What Storybook's theme object cannot say: bevels, square corners, a white
 * tree pane, Windows 98 headings instead of uppercase micro-labels.
 *
 * The manager does not load rowkit's stylesheet, so the token custom
 * properties are declared here from the token package, and the rules below
 * reference them by name — the same names the components use.
 *
 * Storybook's own class names are hashed; the hooks used here are the stable
 * ids, classes and data attributes it ships for exactly this kind of theming.
 */
const variables = [
  ...Object.entries(colorPrimitives).map(([name, value]) => `--color-${name}: ${value};`),
  ...Object.entries(semanticColor).map(([name, value]) => `--color-${name}: ${value};`),
  ...Object.entries(shadow).map(([name, value]) => `--shadow-${name}: ${value};`),
  ...Object.entries(textShadow).map(([name, value]) => `--text-shadow-${name}: ${value};`),
].join('\n  ')

const rules = /* css */ `
:root {
  ${variables}
}

/* Windows 98 draws no rounded corners. Progress rings stay round. */
*:not([role='progressbar'], [role='progressbar'] *) {
  border-radius: 0 !important;
}

/* The onboarding checklist is Storybook's, not rowkit's. */
#storybook-checklist-widget,
:has(> #storybook-checklist-widget) {
  display: none !important;
}

/* Search: a white field in a sunken bevel. */
.search-field {
  border: 0 !important;
  background: var(--color-input) !important;
  box-shadow: var(--shadow-sunken) !important;
}
.search-field input,
#storybook-explorer-searchfield {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* The tree reads like Explorer's folder pane. */
.sidebar-subheading,
.sidebar-subheading * {
  text-transform: none !important;
  letter-spacing: 0 !important;
  color: var(--color-foreground) !important;
  font-weight: 700 !important;
}
.sidebar-item {
  border-radius: 0 !important;
}
.sidebar-item:not([data-selected='true']):hover {
  background: transparent !important;
}
.sidebar-item[data-selected='true'] {
  background: var(--color-surface-selected) !important;
  color: var(--color-on-selected) !important;
}
.sidebar-item svg {
  color: var(--color-foreground) !important;
}
.sidebar-item[data-selected='true'] svg {
  color: var(--color-on-selected) !important;
}

/* Toolbars: a thin raised strip; their buttons rise on hover. */
.sb-bar,
[data-testid='sb-preview-toolbar'] {
  background: var(--color-background) !important;
  box-shadow: var(--shadow-raised-thin) !important;
}
/* On a narrow screen the toolbar scrolls by swiping; a bar under it reads as a rule. */
.sb-bar,
.sb-bar *,
[data-testid='sb-preview-toolbar'],
[data-testid='sb-preview-toolbar'] * {
  scrollbar-width: none !important;
}
.sb-bar button:hover,
[data-testid='sb-preview-toolbar'] button:hover {
  background: transparent !important;
  box-shadow: var(--shadow-raised-thin) !important;
}

/* The «Run tests» card at the foot of the sidebar: a raised panel. */
:has(> #storybook-testing-module) {
  background: var(--color-card) !important;
  box-shadow: var(--shadow-raised) !important;
}

/* Section labels in the addon panel: capitalised, not shouted. */
.docblock-argstable-body td[colspan] * {
  text-transform: capitalize !important;
  letter-spacing: 0 !important;
}

/* Addon panel tabs. */
.tabbutton {
  border-radius: 0 !important;
}
.tabbutton-active {
  font-weight: 700 !important;
}
`

const style = document.createElement('style')
style.dataset.rowkit = 'manager-theme'
style.textContent = rules
document.head.append(style)
