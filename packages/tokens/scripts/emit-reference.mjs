// Writes dist/reference.html — every token with a live swatch and a
// light/dark toggle.
//
// This is the Phase 1 verification artifact: it is the only way to *look* at
// the scales and confirm dark mode actually flips. It deliberately does not
// load dist/tokens.css, because that file wraps its declarations in Tailwind's
// `@theme` at-rule, which a plain browser ignores — the custom properties would
// never reach `:root`. Instead it emits its own `:root`/`.dark` blocks from the
// same token objects, so the two cannot disagree.
//
// Phase 5 replaces this with the real VitePress foundations page.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tokens } from '../dist/index.js'

const { color, spacing, font, radius, shadow, zIndex, motion } = tokens

const decl = (entries, prefix) =>
  Object.entries(entries)
    .map(([k, v]) => `      --${prefix}${k}: ${v};`)
    .join('\n')

const rootVars = [
  decl(color.primitives, 'color-'),
  decl(color.semantic.light, 'color-'),
  decl(spacing, 'spacing-'),
  decl(radius, 'radius-'),
  decl(shadow, 'shadow-'),
  decl(motion.duration, 'transition-duration-'),
  decl(motion.easing, 'ease-'),
  decl(zIndex, 'z-index-'),
  decl(font.family, 'font-'),
  // Font sizes are a paired scale, so they cannot go through decl().
  Object.entries(font.size)
    .map(
      ([k, v]) => `      --text-${k}: ${v.size};\n      --text-${k}--line-height: ${v.lineHeight};`
    )
    .join('\n'),
  decl(font.weight, 'font-weight-'),
  decl(font.letterSpacing, 'tracking-'),
  decl(font.lineHeight, 'leading-'),
].join('\n')

const darkVars = decl(color.semantic.dark, 'color-')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function scaleRow(name, scale) {
  const cells = Object.entries(scale)
    .map(
      ([step, value]) => `
        <div class="swatch">
          <div class="chip" style="background: ${value}"></div>
          <code class="step">${name}-${step}</code>
          <code class="val">${esc(value)}</code>
        </div>`
    )
    .join('')
  return `<section><h3>${name}</h3><div class="scale">${cells}</div></section>`
}

function semanticRows() {
  return Object.keys(color.semantic.light)
    .map(
      (token) => `
      <tr>
        <td><code>--color-${token}</code></td>
        <td><span class="dot" style="background: var(--color-${token})"></span></td>
        <td><code class="ref">${esc(color.semantic.light[token])}</code></td>
        <td><code class="ref">${esc(color.semantic.dark[token])}</code></td>
      </tr>`
    )
    .join('')
}

function tokenTable(title, scale, prefix, render) {
  const rows = Object.entries(scale)
    .map(
      ([k, v]) => `
      <tr>
        <td><code>--${prefix}${k}</code></td>
        <td><code class="ref">${esc(typeof v === 'object' ? `${v.size} / ${v.lineHeight}` : v)}</code></td>
        <td>${render ? render(k, v) : ''}</td>
      </tr>`
    )
    .join('')
  return `<section><h3>${title}</h3><table><thead><tr><th>token</th><th>value</th><th>preview</th></tr></thead><tbody>${rows}</tbody></table></section>`
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>rowkit design tokens</title>
    <style>
      :root {
${rootVars}
      }
      .dark {
${darkVars}
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: var(--spacing-8);
        font-family: var(--font-sans);
        font-size: var(--text-sm, 0.875rem);
        background: var(--color-background);
        color: var(--color-text);
        transition: background var(--transition-duration-normal) var(--ease-standard);
      }
      header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-8); }
      h1 { font-size: 1.5rem; font-weight: var(--font-weight-bold); margin: 0; }
      h2 { font-size: 1.125rem; font-weight: var(--font-weight-semibold); margin: var(--spacing-12) 0 var(--spacing-4); padding-bottom: var(--spacing-2); border-bottom: 1px solid var(--color-border); }
      h3 { font-size: 0.875rem; font-weight: var(--font-weight-medium); color: var(--color-text-muted); margin: var(--spacing-6) 0 var(--spacing-3); text-transform: uppercase; letter-spacing: var(--tracking-wide); }
      code { font-family: var(--font-mono); font-size: 0.75rem; }
      button {
        font: inherit; font-weight: var(--font-weight-medium); cursor: pointer;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border-control);
        background: var(--color-surface); color: var(--color-text);
      }
      button:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
      .scale { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--spacing-2); }
      .swatch { display: flex; flex-direction: column; gap: var(--spacing-1); }
      .chip { height: 56px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
      .step { font-weight: var(--font-weight-medium); }
      .val, .ref { color: var(--color-text-muted); }
      table { width: 100%; border-collapse: collapse; }
      th { text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: var(--tracking-wide); color: var(--color-text-muted); font-weight: var(--font-weight-medium); padding: var(--spacing-2); border-bottom: 1px solid var(--color-border); }
      td { padding: var(--spacing-2); border-bottom: 1px solid var(--color-border-subtle); vertical-align: middle; }
      tbody tr:hover { background: var(--color-surface-hover); }
      .dot { display: inline-block; width: 28px; height: 20px; border-radius: var(--radius-xs); border: 1px solid var(--color-border); }
      .demo-box { background: var(--color-surface); border: 1px solid var(--color-border); }
      .status-row { display: flex; flex-wrap: wrap; gap: var(--spacing-3); }
      .solid { padding: var(--spacing-2) var(--spacing-4); border-radius: var(--radius-sm); font-weight: var(--font-weight-medium); }
      .subtle { padding: var(--spacing-1) var(--spacing-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: var(--font-weight-medium); border: 1px solid; }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>rowkit design tokens</h1>
        <p style="color: var(--color-text-muted); margin: var(--spacing-1) 0 0">
          Generated from <code>@rowkit/tokens</code>. Every value below comes from the same
          source the components consume.
        </p>
      </div>
      <button id="toggle" type="button" aria-pressed="false">Toggle dark mode</button>
    </header>

    <h2>Status colours in context</h2>
    <div class="status-row">
      ${['primary', 'success', 'warning', 'danger']
        .map(
          (f) =>
            `<span class="solid" style="background: var(--color-${f}-solid); color: var(--color-${f}-on-solid)">${f} solid</span>`
        )
        .join('')}
    </div>
    <div class="status-row" style="margin-top: var(--spacing-3)">
      ${['primary', 'success', 'warning', 'danger']
        .map(
          (f) =>
            `<span class="subtle" style="background: var(--color-${f}-subtle); color: var(--color-${f}-on-subtle); border-color: var(--color-${f}-border)">${f} subtle</span>`
        )
        .join('')}
    </div>

    <h2>Semantic colours</h2>
    <p style="color: var(--color-text-muted)">
      Semantic tokens never hold a literal colour — each points at a primitive, which is what
      lets the theme flip without any value being redefined.
    </p>
    <table>
      <thead><tr><th>token</th><th>current</th><th>light &rarr;</th><th>dark &rarr;</th></tr></thead>
      <tbody>${semanticRows()}</tbody>
    </table>

    <h2>Colour primitives</h2>
    ${['neutral', 'primary', 'success', 'warning', 'danger'].map((n) => scaleRow(n, color[n])).join('')}

    <h2>Spacing</h2>
    ${tokenTable('spacing', spacing, 'spacing-', (_k, v) => `<div style="height: 12px; width: ${v}; background: var(--color-primary-solid); border-radius: 2px"></div>`)}

    <h2>Typography</h2>
    ${tokenTable('font size', font.size, 'text-', (_k, v) => `<span style="font-size: ${v.size}; line-height: ${v.lineHeight}">Rows 1&ndash;50 of 2,481</span>`)}
    ${tokenTable('font weight', font.weight, 'font-weight-', (_k, v) => `<span style="font-weight: ${v}">Rows 1&ndash;50 of 2,481</span>`)}
    ${tokenTable('letter spacing', font.letterSpacing, 'tracking-', (_k, v) => `<span style="letter-spacing: ${v}">STATUS</span>`)}
    ${tokenTable('line height', font.lineHeight, 'leading-')}
    ${tokenTable('font family', font.family, 'font-', (_k, v) => `<span style="font-family: ${v}">Rows 1&ndash;50</span>`)}

    <h2>Radii</h2>
    ${tokenTable('radius', radius, 'radius-', (_k, v) => `<div class="demo-box" style="width: 56px; height: 32px; border-radius: ${v}"></div>`)}

    <h2>Shadows</h2>
    ${tokenTable('shadow', shadow, 'shadow-', (_k, v) => `<div class="demo-box" style="width: 72px; height: 40px; border-radius: var(--radius-md); box-shadow: ${v}"></div>`)}

    <h2>Motion</h2>
    ${tokenTable('duration', motion.duration, 'transition-duration-')}
    ${tokenTable('easing', motion.easing, 'ease-')}

    <h2>Stacking layers</h2>
    ${tokenTable('z-index', zIndex, 'z-index-')}

    <script>
      const toggle = document.getElementById('toggle')
      toggle.addEventListener('click', () => {
        const on = document.documentElement.classList.toggle('dark')
        toggle.setAttribute('aria-pressed', String(on))
      })
    </script>
  </body>
</html>
`

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
await mkdir(distDir, { recursive: true })
const target = join(distDir, 'reference.html')
await writeFile(target, html, 'utf8')
console.log(`reference.html written to ${target}`)
