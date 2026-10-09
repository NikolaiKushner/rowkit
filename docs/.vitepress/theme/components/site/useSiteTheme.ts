import { computed, ref } from 'vue'

/**
 * Which rowkit theme the site's live examples are drawn in, and their scheme.
 *
 * The docs chrome is VitePress's, with its own light/dark switch. The rowkit
 * theme — Windows 98 or modern — is the «Components» switch in the nav bar,
 * set on <html> as an app sets it, so overlays teleported to <body> follow.
 * The site starts in modern; `?theme=win98` in a link opens it in Windows 98.
 * That is the site's choice, not the library's: rowkit's own default, without
 * an attribute, is still Windows 98.
 *
 * The scheme is VitePress's: its dark mode puts `data-color-scheme="dark"` on
 * <html> too, so the modern examples turn dark with the page.
 */
export type SiteTheme = 'win98' | 'modern'
export type SiteScheme = 'system' | 'light' | 'dark'

// `-2` since the site opens in modern: a choice stored while Windows 98 was
// the default is not kept, so every visitor starts in modern once.
export const THEME_KEY = 'rowkit-theme-2'
/** VitePress's own key for its appearance switch. */
const APPEARANCE_KEY = 'vitepress-theme-appearance'

export const siteTheme = ref<SiteTheme>('modern')
const dark = ref(false)

/** The examples' scheme, as the page draws it. */
export const siteScheme = computed<SiteScheme>(() => (dark.value ? 'dark' : 'light'))

/** Reads what the inline script set. Client only. */
export function readSiteTheme(): void {
  siteTheme.value = document.documentElement.dataset.theme === 'win98' ? 'win98' : 'modern'
}

export function setSiteTheme(theme: SiteTheme): void {
  siteTheme.value = theme
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Private windows and blocked storage: the switch still works for this visit.
  }
}

/** Follows VitePress's dark mode. */
export function setSiteDark(isDark: boolean): void {
  dark.value = isDark
  document.documentElement.dataset.colorScheme = isDark ? 'dark' : 'light'
}

/**
 * The script that sets the theme before the page paints, inlined into <head>
 * beside VitePress's own appearance script. Kept here, beside the keys it
 * reads, so the two cannot drift.
 */
export const themeBootScript = `(function(){var r=document.documentElement,t,a;try{var q=new URLSearchParams(location.search);t=q.get('theme')||localStorage.getItem('${THEME_KEY}');if(q.get('theme'))localStorage.setItem('${THEME_KEY}',t);a=localStorage.getItem('${APPEARANCE_KEY}')}catch(e){}r.dataset.theme=t==='win98'?'win98':'modern';var d=a==='dark'||((!a||a==='auto')&&matchMedia('(prefers-color-scheme: dark)').matches);r.dataset.colorScheme=d?'dark':'light'})()`
