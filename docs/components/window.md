# Window

**Stage:** 🟡 New

A Windows 98 window: the title bar with its caption buttons, a body, and a
status bar if it needs one. For a panel of the page that should read as its
own window — a tool, a preview, an "About" box. It is not modal; for that, use
`Dialog`.

<script setup>
import WindowBasic from '../examples/window/WindowBasic.vue'
import WindowActive from '../examples/window/WindowActive.vue'
import WindowApp from '../examples/window/WindowApp.vue'
import WindowStates from '../examples/window/WindowStates.vue'
import WindowProperties from '../examples/window/WindowProperties.vue'
</script>

<DemoBox>
  <WindowBasic />
</DemoBox>

<<< @/examples/window/WindowBasic.vue

## Examples

Each example below is the whole component: copy it into a `.vue` file and it
runs. The code is the file the demo is built from, so the two cannot differ.

### Active and inactive

`active` draws the blue title bar on the window in use; the others turn grey,
as Windows 98 does behind a dialog or beside the window with focus. Click
either window.

<DemoBox>
  <WindowActive />
</DemoBox>

<<< @/examples/window/WindowActive.vue

### A small application

Title bar, a toolbar, a `DataTable` filling the body, and a status bar that
counts. `WindowBody` is the part that grows and scrolls.

<DemoBox layout="stack">
  <WindowApp />
</DemoBox>

<<< @/examples/window/WindowApp.vue

### Minimize, maximize, restore

The caption buttons do what they say. Maximized, the middle button becomes
Restore; minimized, the window leaves a button behind to bring it back. A
caption button that does nothing here is disabled, never left to fail
silently.

<DemoBox layout="stack">
  <WindowStates />
</DemoBox>

<<< @/examples/window/WindowStates.vue

### A properties sheet

Groups of settings and the Windows 98 OK · Cancel · Apply row: Apply saves and
stays, Cancel puts the fields back.

<DemoBox>
  <WindowProperties />
</DemoBox>

<<< @/examples/window/WindowProperties.vue

## Look

As drawn in the Figma file: the silver face in the window bevel, 2px of frame.
The title bar is 18px of navy-to-blue gradient — the grey gradient with black
text when `active` is off — holding an optional 16px icon, the bold title cut
off with an ellipsis, and the 16×14 caption buttons: minimize and maximize
together, close 2px apart. A disabled caption button shows an embossed grey
glyph.

## Anatomy

| Part             | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `Window`         | The frame. `active` turns the title bar grey when off        |
| `WindowTitleBar` | Title (names the window), `#icon`, `#controls`               |
| `WindowButton`   | A caption button: `minimize`, `maximize`, `restore`, `close` |
| `WindowBody`     | The content between the title bar and a status bar           |
| `StatusBar`      | Optional, last — the same component used anywhere else       |

## When to use

- A self-contained tool or preview on a page that should read as a window.
- The "About" box, a properties panel, a demo frame.

## When not to use

- **For a modal task.** `Dialog` traps focus and blocks the page; a `Window`
  does neither.
- **For every panel.** A page of windows is a desktop; most content wants a
  `GroupBox` or nothing at all.
- **With buttons that do nothing.** Show only the caption buttons the window
  can honour — a maximize that does not maximize is worse than none.

## Props

### Window

<!-- @props WindowProps -->

| Prop     | Type      | Default | Description                                              |
| -------- | --------- | ------- | -------------------------------------------------------- |
| `active` | `boolean` | `true`  | Whether this is the window in use.                       |
| `class`  | `string`  | —       | Additional classes, merged so a consumer's utility wins. |

<!-- /@props -->

### WindowTitleBar

<!-- @props WindowTitleBarProps -->

| Prop    | Type     | Default | Description                                                         |
| ------- | -------- | ------- | ------------------------------------------------------------------- |
| `title` | `string` | —       | The window's title. Names the window. The default slot replaces it. |
| `class` | `string` | —       | Additional classes, merged so a consumer's utility wins.            |

<!-- /@props -->

### WindowButton

<!-- @props WindowButtonProps -->

| Prop       | Type                                               | Default      | Description                                                       |
| ---------- | -------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| `glyph`    | `'minimize' \| 'maximize' \| 'restore' \| 'close'` | **required** | Which caption button: the glyph it shows.                         |
| `label`    | `string`                                           | **required** | Accessible name. The glyph alone says nothing to a screen reader. |
| `disabled` | `boolean`                                          | `false`      | Disables the button: a grey, embossed glyph.                      |
| `class`    | `string`                                           | —            | Additional classes, merged so a consumer's utility wins.          |

<!-- /@props -->

### WindowBody

<!-- @props WindowBodyProps -->

| Prop    | Type     | Default | Description                                                                   |
| ------- | -------- | ------- | ----------------------------------------------------------------------------- |
| `class` | `string` | —       | Additional classes — padding, a layout — merged so a consumer's utility wins. |

<!-- /@props -->

## Keyboard

Caption buttons are native buttons: <kbd>Tab</kbd> reaches them,
<kbd>Enter</kbd> or <kbd>Space</kbd> fires them. What they do — closing,
minimizing — is yours; `WindowButton` only reports the click.

## Accessibility

- The window is a `section` named by its title, so it is a region a screen
  reader can find by name.
- Every caption button needs `label`: a glyph says nothing to a screen reader.
