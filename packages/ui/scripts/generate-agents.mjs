/**
 * Generates `AGENTS.md` — the whole component API as plain structured text.
 *
 * Two destinations: `packages/ui/AGENTS.md`, which ships inside the npm package
 * so `node_modules/rowkit/AGENTS.md` is on disk for any coding agent working in
 * a consumer's project, and `docs/agents.md`, which renders it on the site.
 *
 * Generated rather than written for the obvious reason — a hand-maintained
 * summary of thirteen components' props, events and slots is wrong within one
 * release — and from the same extraction as the docs props tables, so the two
 * cannot disagree.
 *
 * Run `pnpm docs:agents`; `src/agents-doc.test.ts` fails if it has drifted.
 */
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'
import { buildComponentApi, packageRoot, repoRoot, summarise } from './component-api.mjs'

export const agentsPath = join(packageRoot, 'AGENTS.md')
export const docsPath = join(repoRoot, 'docs/agents.md')

/** Longer than a table cell allows, shorter than the full essay in the source. */
const describe = (text) => summarise(text, 240)

/**
 * The parts that are not derivable from a type: how to install the thing, and
 * the handful of rules that apply to every component at once.
 *
 * Written by hand deliberately. These are the mistakes that cost a consumer an
 * afternoon, and none of them is visible in a prop signature.
 */
const PREAMBLE = `## Setup

\`\`\`bash
pnpm add rowkit
\`\`\`

\`vue\` and \`tailwindcss\` are peer dependencies. rowkit uses the copies already in
the project; bundling either causes duplicate-instance bugs.

**Both of these lines are required**, in this order, in the application's
stylesheet:

\`\`\`css
@import 'tailwindcss';
@import 'rowkit/styles';
\`\`\`

Omitting the second line is the single most common failure. Tailwind does not
scan \`node_modules\`, so without it every rowkit component renders unstyled — with
no error in the console. \`rowkit/styles\` registers the shipped bundle as a
Tailwind source and carries the theme tokens.

Under Nuxt, wrap \`<Toaster />\` in \`<ClientOnly>\`. Nothing else needs special
handling.

## Rules that apply to every component

- **The consumer owns state.** Sort, selection, page, page size, search and
  filters are all \`v-model\`; no component holds them internally. A component
  reports what happened and the application decides what follows — changing page
  size does not move the page, clearing a filter resets nothing.
- **Every component accepts \`class\` and merges it** through \`tailwind-merge\`, so
  a utility passed in wins over the component's own without \`!important\`.
- **Sizes are \`sm | md | lg\`, \`md\` by default.** Some components offer a subset
  (\`Badge\` and \`DataTable\` stop at \`sm | md\`) but never rename the steps.
- **Variants are strings, never booleans.** \`variant="danger"\`, not \`danger\`.
- **Identity payloads are stable ids**, never array indices or object references.
- **No component ships an icon.** Icon slots take whatever the application uses.

## Also exported

- \`useToast()\` — the toast queue. Callable outside component context (a store
  action, an error handler). Render \`<Toaster />\` once at the app root.
- \`useClientSort(rows, sort, columns)\` — client-side sorting for \`DataTable\`,
  which never reorders its own rows. Deliberately not a prop on the component:
  a server-paged table that sorts locally reorders only the page on screen and
  looks correct.
- \`TooltipProvider\` — Reka's, re-exported. Only needed to share
  \`skipDelayDuration\` across a toolbar of tooltips.
- \`cn(...)\` — the class merger the components use.
- Types: \`SelectOption\`, \`FilterChip\`, \`DataTableColumn\`, \`DataTableSort\`,
  \`ToastOptions\`, and a \`*Props\` type per component.
`

/** One component's section. */
function renderComponent({ component, props, models, events, slots }) {
  const lines = [`### ${component}`, '', `\`import { ${component} } from 'rowkit'\``, '']

  lines.push('**Props**', '')
  for (const prop of props) {
    const suffix = prop.required
      ? ' _(required)_'
      : prop.default === undefined
        ? ''
        : ` — default \`${prop.default}\``
    lines.push(`- \`${prop.name}: ${prop.type}\`${suffix}. ${describe(prop.description)}`)
  }
  lines.push('')

  if (models.length > 0) {
    lines.push('**v-model**', '')
    for (const model of models) {
      const binding = model.name === 'modelValue' ? 'v-model' : `v-model:${model.name}`
      lines.push(`- \`${binding}\` — \`${model.type}\`. ${describe(model.description)}`)
    }
    lines.push('')
  }

  if (events.length > 0) {
    lines.push('**Events**', '')
    for (const event of events) {
      lines.push(`- \`@${event.name}\` — \`${event.payload}\`. ${describe(event.description)}`)
    }
    lines.push('')
  }

  if (slots.length > 0) {
    lines.push('**Slots**', '')
    for (const slot of slots) {
      const signature = slot.props === '' ? '' : ` \`(${slot.props})\``
      lines.push(`- \`#${slot.name}\`${signature} — ${describe(slot.description)}`)
    }
    lines.push('')
  }

  return lines.join('\n').trimEnd()
}

/** The whole document, minus the front matter that differs per destination. */
export async function buildAgentsBody() {
  const components = await buildComponentApi()
  const sections = [...components.values()].map(renderComponent)

  return [
    '<!-- Generated by scripts/generate-agents.mjs. Do not edit by hand. -->',
    '',
    '# rowkit for coding agents',
    '',
    'Vue 3 components for data-dense interfaces: tables, filters, and the states',
    'around them. Twelve components, built on Reka UI, styled with Tailwind v4.',
    '',
    'This file is generated from the source, so it describes the version installed',
    'rather than whatever was current when it was written.',
    '',
    PREAMBLE,
    '## Components',
    '',
    sections.join('\n\n'),
    '',
  ].join('\n')
}

/** The same body, with the front matter the docs site needs. */
export function toDocsPage(body) {
  return body.replace(
    '# rowkit for coding agents\n',
    [
      '# rowkit for coding agents',
      '',
      '::: tip',
      'This page ships inside the package too. After `pnpm add rowkit` it is on',
      'disk at `node_modules/rowkit/AGENTS.md`, so an agent working in your',
      'project can read the API of the exact version you installed without',
      'fetching anything.',
      ':::\n',
    ].join('\n')
  )
}

async function formatMarkdown(content, filepath) {
  const options = await resolveConfig(filepath)
  return format(content, { ...options, filepath })
}

/** Both files, formatted, keyed by path. */
export async function buildAgentsFiles() {
  const body = await buildAgentsBody()
  return new Map([
    [agentsPath, await formatMarkdown(body, agentsPath)],
    [docsPath, await formatMarkdown(toDocsPage(body), docsPath)],
  ])
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = await buildAgentsFiles()
  for (const [path, content] of files) await writeFile(path, content)
  console.log(
    `wrote ${[...files.keys()].map((path) => path.replace(repoRoot + '/', '')).join(', ')}`
  )
}
