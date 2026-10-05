import { tokens } from '@rowkit/tokens'
import type { UserConfig } from 'vitepress'

type ShikiTheme = Exclude<NonNullable<NonNullable<UserConfig['markdown']>['theme']>, string>

const { vga } = tokens.color

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
  fg: vga.black,
  bg: vga.white,
  settings: [
    { settings: { foreground: vga.black, background: vga.white } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: vga.green },
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
      settings: { foreground: vga.blue },
    },
    // `=`, `=>`, `+`: keywords by grammar, punctuation to a reader.
    { scope: ['keyword.operator'], settings: { foreground: vga.black } },
    {
      scope: ['keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.typeof'],
      settings: { foreground: vga.blue },
    },
    {
      scope: ['string', 'punctuation.definition.string'],
      settings: { foreground: vga.maroon },
    },
    { scope: ['constant.numeric'], settings: { foreground: vga.teal } },
    {
      scope: ['entity.name.tag', 'punctuation.definition.tag', 'support.class.component'],
      settings: { foreground: vga.navy },
    },
    { scope: ['entity.other.attribute-name'], settings: { foreground: vga.teal } },
  ],
}
