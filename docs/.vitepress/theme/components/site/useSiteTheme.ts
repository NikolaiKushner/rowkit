import { ref } from 'vue'

/**
 * Which rowkit theme the site is drawn in, and its colour scheme.
 *
 * The site is one theme at a time, set on <html>: before the first paint by
 * the inline script in `config.ts` (so a reload never flashes the other
 * theme), then by the switch in the taskbar or menu bar. The choice is kept
 * in localStorage; `?theme=win98` in a link opens the site in that theme.
 *
 * The site opens in the modern theme. That is the site's choice, not the
 * library's: rowkit's own default, without an attribute, is still Windows 98.
 */
export type SiteTheme = 'win98' | 'modern'
export type SiteScheme = 'system' | 'light' | 'dark'

// `-2` since the site opens in modern: a choice stored while Windows 98 was
// the default is not kept, so every visitor starts in modern once.
export const THEME_KEY = 'rowkit-theme-2'
export const SCHEME_KEY = 'rowkit-scheme'

export const siteTheme = ref<SiteTheme>('modern')
export const siteScheme = ref<SiteScheme>('system')

/** Reads what the inline script set. Client only. */
export function readSiteTheme(): void {
  const root = document.documentElement
  siteTheme.value = root.dataset.theme === 'win98' ? 'win98' : 'modern'
  const scheme = root.dataset.colorScheme
  siteScheme.value = scheme === 'light' || scheme === 'dark' ? scheme : 'system'
}

function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Private windows and blocked storage: the switch still works for this visit.
  }
}

export function setSiteTheme(theme: SiteTheme): void {
  siteTheme.value = theme
  document.documentElement.dataset.theme = theme
  store(THEME_KEY, theme)
}

export function setSiteScheme(scheme: SiteScheme): void {
  siteScheme.value = scheme
  const root = document.documentElement
  if (scheme === 'system') delete root.dataset.colorScheme
  else root.dataset.colorScheme = scheme
  store(SCHEME_KEY, scheme)
}

/**
 * The script that sets the theme before the page paints, inlined into <head>.
 * Kept here, beside the keys it reads, so the two cannot drift.
 */
export const themeBootScript = `(function(){var r=document.documentElement,t,s;try{var q=new URLSearchParams(location.search);t=q.get('theme')||localStorage.getItem('${THEME_KEY}');s=q.get('scheme')||localStorage.getItem('${SCHEME_KEY}');if(q.get('theme'))localStorage.setItem('${THEME_KEY}',t);if(q.get('scheme'))localStorage.setItem('${SCHEME_KEY}',s)}catch(e){}r.dataset.theme=t==='win98'?'win98':'modern';if(s==='light'||s==='dark')r.dataset.colorScheme=s})()`
