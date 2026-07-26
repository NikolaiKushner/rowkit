# rowkit

A Vue 3 component library for data-dense interfaces — tables, filters, and the states around them.

> **Status: early development.** The package name is reserved on npm, but nothing is published yet. Not usable in production. Follow [ROADMAP.md](./ROADMAP.md) for progress.

## Why another component library

Most Vue component libraries are general-purpose: buttons, cards, inputs. They handle the easy 80% well and leave you to build the hard part yourself — the sortable table with row selection that stays fast at ten thousand rows, the filter bar that shows applied state clearly, the empty and loading states that make a dashboard feel finished rather than broken.

rowkit focuses on that hard part. It ships a small set of foundations plus the data components that SaaS dashboards actually need.

## Planned

- **Token-first architecture** — every color, space, and radius comes from a documented token. No hardcoded values.
- **Built on [Reka UI](https://reka-ui.com)** — accessible primitives, WAI-ARIA compliant, real keyboard support.
- **Tailwind CSS v4** — theming via CSS custom properties.
- **TypeScript throughout** — generic components where it matters (`DataTable<T>` gives you autocomplete on column keys).
- **Tested** — stories double as browser-based component tests via Vitest.
- **Documented** — every component page covers anatomy, when to use it, and when not to.

## Install

```bash
# not yet — coming with v0.1.0
npm i rowkit
```

## Development

```bash
pnpm install
pnpm dev          # playground app
pnpm storybook    # component workshop
pnpm test         # unit + component tests
pnpm build        # build the library
pnpm docs:dev     # documentation site
```

## License

MIT © Nikolai Kushner
