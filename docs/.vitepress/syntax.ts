import { tokens } from '@rowkit/tokens'
import type { UserConfig } from 'vitepress'

type ShikiTheme = Exclude<NonNullable<NonNullable<UserConfig['markdown']>['theme']>, string>

const { vga } = tokens.color

/**
 * Every colour is a variable, so the code follows the site's theme: the
 * Windows 98 IDE's colours, or the modern theme's light and dark ones. The
 * values live in `theme/modern.css`; the Windows 98 ones fall back to VGA.
 */
const code = (role: string, fallback: string) => `var(--rk-code-${role}, ${fallback})`

/**
 * Code colours as a Windows 98 IDE drew them — Visual C++ 6 and Visual Basic 6:
 * keywords blue, comments green, everything else black, plus maroon strings,
 * teal numbers and navy tags so a Vue template reads at a glance.
 *
 * Restraint is the point. Operators, punctuation, names and calls stay black;
 * a block where every token has its own colour reads as noise, not structure.
 *
 * The colours are the VGA palette from `@rowkit/tokens`, and each clears 4.5:1
 * on the white code well: blue 8.6, green 5.1, maroon 11.4, teal 4.8, navy 16.
 * Yellow, olive, grey and red do not, which is why none of them is here.
 */
export const win98Code: ShikiTheme = {
  name: 'rowkit-win98',
  type: 'light',
  fg: code('fg', vga.black),
  bg: code('bg', vga.white),
  settings: [
    { settings: { foreground: code('fg', vga.black), background: code('bg', vga.white) } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: code('comment', vga.green) },
    },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'storage.modifier',
        'variable.language',
        'constant.language',
      ],
      settings: { foreground: code('keyword', vga.blue) },
    },
    // `=`, `=>`, `+`: keywords by grammar, punctuation to a reader.
    { scope: ['keyword.operator'], settings: { foreground: code('fg', vga.black) } },
    {
      scope: ['keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.typeof'],
      settings: { foreground: code('keyword', vga.blue) },
    },
    {
      scope: ['string', 'punctuation.definition.string'],
      settings: { foreground: code('string', vga.maroon) },
    },
    { scope: ['constant.numeric'], settings: { foreground: code('number', vga.teal) } },
    {
      scope: ['entity.name.tag', 'punctuation.definition.tag', 'support.class.component'],
      settings: { foreground: code('tag', vga.navy) },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: code('attribute', vga.teal) },
    },
  ],
}
