# Badge

**Stage:** 🟢 Stable

A short, non-interactive status label. Built for the status column of a table,
where the same handful of values repeat down the page.

```vue
<Badge variant="success" dot>Active</Badge>
```

<DemoBox>
  <Badge variant="success" dot>Active</Badge>
  <Badge variant="warning" dot>Invited</Badge>
  <Badge variant="danger" dot>Suspended</Badge>
  <Badge variant="neutral">Archived</Badge>
  <Badge variant="primary" appearance="solid">Beta</Badge>
  <Badge variant="neutral" appearance="outline" size="sm">v0.4</Badge>
</DemoBox>

The first three are the shape a status column takes. Note that they stay
readable with the colour removed — the word carries the meaning, and the dot is
there to give the eye something to lock onto down a repeating column.

## Anatomy

| Part      | Purpose                                                                      |
| --------- | ---------------------------------------------------------------------------- |
| Container | Carries the colour from `variant` × `appearance`                             |
| Dot       | Optional leading shape, `aria-hidden` — repeats colour the badge already has |
| Label     | The text. One or two words                                                   |

## When to use

- Communicating the state of a row: active, invited, failed, archived.
- Categorising a record with a fixed, small vocabulary.
- Counting, when the count is the whole point (`<Badge>12</Badge>`).

## When not to use

- **As a button.** A badge is not interactive and has no focus, hover, or
  pressed state. If clicking it does something, use `Button` or a link.
- **For free-form text.** It truncates. If the content can be a sentence, it is
  not a badge.
- **As the only signal for a status.** Colour alone fails for colour-blind
  users and in print. The label carries the meaning; the colour reinforces it.
  Turn on `dot` when a column repeats the same few statuses and the eye needs a
  shape to lock onto.
- **For more than about five distinct values.** Past that the colours stop
  being distinguishable and the badge stops being a signal. Use plain text.
- **A whole column of `appearance="solid"`.** It reads as a wall of colour and
  communicates nothing. `subtle` is the default for this reason.

## Props

<!-- @props BadgeProps -->

| Prop         | Type                                                           | Default     | Description                                                                                                |
| ------------ | -------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `variant`    | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Status family. `neutral` is the "no particular status" default rather than an absence of styling.          |
| `appearance` | `'subtle' \| 'solid' \| 'outline'`                             | `'subtle'`  | How much visual weight the badge carries.                                                                  |
| `size`       | `'sm' \| 'md'`                                                 | `'md'`      | Badge size. `sm` is intended for dense table rows.                                                         |
| `dot`        | `boolean`                                                      | `false`     | Shows a filled dot before the label, inheriting the text colour.                                           |
| `class`      | `string`                                                       | —           | Additional classes, merged with the variant classes so a consumer's utility wins over the component's own. |
| `as`         | `string \| Component`                                          | `'span'`    | Element or component to render as.                                                                         |
| `asChild`    | `boolean`                                                      | `false`     | Merge props onto the single child element instead of rendering a wrapper.                                  |

<!-- /@props -->

### Slots

| Slot      | Description |
| --------- | ----------- |
| `default` | The label   |

## Keyboard

None. A badge is not interactive and is not in the tab order. If you find
yourself wanting keyboard support here, you want a different component.

## Accessibility

- The dot is `aria-hidden`: it repeats information the label already carries,
  and announcing it before every status would be noise.
- Every `variant` × `appearance` pair meets WCAG AA for text contrast in both
  light and dark mode. This is asserted in `@rowkit/tokens`, not assumed.
- A badge announces as plain text. If its appearance is the _result_ of an
  action the user just took, put it in a container with `aria-live`, not on
  the badge itself.
