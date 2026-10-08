<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId } from 'vue'
import { withBase } from 'vitepress'
import { Button } from 'rowkit'
import SiteMenu from './SiteMenu.vue'
import { schemeMenu } from './menu'
import {
  setSiteScheme,
  setSiteTheme,
  siteScheme,
  siteTheme,
  type SiteScheme,
  type SiteTheme,
} from './useSiteTheme'

/**
 * The site's theme switch: Windows 98 or modern, and for the modern theme its
 * colour scheme. Sits in the Windows 98 taskbar tray and in the modern menu
 * bar — the same control, drawn by whichever theme is on. Both drawings are
 * rendered and the theme hides one, so the first paint is already right.
 *
 * Modern (Figma SiteModern/ThemeSwitcher): a segmented control, one tab stop
 * with ← → between the themes, and an icon button that cycles the scheme —
 * Auto, Light, Dark. A long press or ↓ on it opens the scheme menu instead
 * (Figma SiteModern/Menu/Scheme).
 */
const NEXT: Record<SiteScheme, SiteScheme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<SiteScheme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' }
const ICON: Record<SiteScheme, string> = { system: 'auto', light: 'sun', dark: 'moon' }

const THEMES: { value: SiteTheme; label: string }[] = [
  { value: 'win98', label: 'Windows 98' },
  { value: 'modern', label: 'Modern' },
]

const root = ref<HTMLElement>()

/*
 * Switching the theme hides the drawing that was used and shows the other,
 * so focus would fall to the page. It moves to the chosen theme's control in
 * the drawing now on screen: this switch's, or — where this one is modern
 * only, as in About — the menu bar's.
 */
const CHOSEN = '[data-theme-switch] :is([aria-pressed=true], [aria-checked=true])'

function choose(theme: SiteTheme): void {
  const hadFocus = root.value?.contains(document.activeElement) ?? false
  setSiteTheme(theme)
  if (!hadFocus) return
  void nextTick(() => {
    const visible = (scope: ParentNode | undefined) =>
      [...(scope?.querySelectorAll<HTMLElement>(CHOSEN) ?? [])].find(
        (control) => control.offsetParent !== null
      )
    ;(visible(root.value?.parentNode ?? undefined) ?? visible(document))?.focus()
  })
}

/* The scheme menu. */
const schemeButton = ref<HTMLButtonElement>()
const schemeMenuRef = ref<{ focusFirst: () => void; focusPanel: () => void }>()
const schemeOpen = ref(false)
const schemeId = useId()
let pressTimer: ReturnType<typeof setTimeout> | undefined
let pressed = false

function openSchemeMenu(fromKeyboard: boolean): void {
  schemeOpen.value = true
  document.addEventListener('pointerdown', onOutside, true)
  void nextTick(() =>
    fromKeyboard ? schemeMenuRef.value?.focusFirst() : schemeMenuRef.value?.focusPanel()
  )
}

function closeSchemeMenu(focusButton: boolean): void {
  schemeOpen.value = false
  document.removeEventListener('pointerdown', onOutside, true)
  if (focusButton) schemeButton.value?.focus()
}

function onOutside(event: PointerEvent): void {
  const target = event.target as Node
  if (root.value?.contains(target)) return
  closeSchemeMenu(false)
}

// Held for half a second, the button opens the menu, and the release does not cycle.
function onSchemeDown(event: PointerEvent): void {
  if (event.button !== 0) return
  pressed = false
  clearTimeout(pressTimer)
  pressTimer = setTimeout(() => {
    pressed = true
    openSchemeMenu(false)
  }, 500)
}

function onSchemeUp(): void {
  clearTimeout(pressTimer)
}

function onSchemeClick(): void {
  if (pressed) {
    pressed = false
    return
  }
  if (schemeOpen.value) closeSchemeMenu(false)
  setSiteScheme(NEXT[siteScheme.value])
}

function onSchemeKeydown(event: KeyboardEvent): void {
  if (event.key !== 'ArrowDown') return
  event.preventDefault()
  openSchemeMenu(true)
}

onBeforeUnmount(() => {
  clearTimeout(pressTimer)
  document.removeEventListener('pointerdown', onOutside, true)
})

function onSegmentKeydown(event: KeyboardEvent): void {
  const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key]
  if (step === undefined) return
  event.preventDefault()
  const index = THEMES.findIndex((theme) => theme.value === siteTheme.value)
  choose(THEMES[(index + step + THEMES.length) % THEMES.length].value)
}
</script>

<template>
  <div ref="root" data-theme-switch class="contents">
    <div role="group" aria-label="Theme" class="flex shrink-0 items-center gap-0.5 modern:hidden">
      <Button
        size="xs"
        variant="ghost"
        :pressed="siteTheme === 'win98'"
        class="min-w-0"
        @click="choose('win98')"
        >Windows 98</Button
      >
      <Button
        size="xs"
        variant="ghost"
        :pressed="siteTheme === 'modern'"
        class="min-w-0"
        @click="choose('modern')"
        >Modern</Button
      >
    </div>

    <div class="flex shrink-0 items-center gap-1 win98:hidden">
      <div role="radiogroup" aria-label="Theme" class="flex rounded-[7px] bg-control-latched p-0.5">
        <button
          v-for="theme in THEMES"
          :key="theme.value"
          type="button"
          role="radio"
          :aria-checked="siteTheme === theme.value"
          :tabindex="siteTheme === theme.value ? 0 : -1"
          class="flex h-[18px] items-center rounded-[5px] px-2.5 text-ui text-muted-foreground outline-none focus-visible:focus-outer aria-checked:bg-control aria-checked:font-strong aria-checked:text-foreground aria-checked:shadow-raised"
          @click="choose(theme.value)"
          @keydown="onSegmentKeydown"
        >
          {{ theme.label }}
        </button>
      </div>
      <div class="relative">
        <button
          :id="schemeId"
          ref="schemeButton"
          type="button"
          aria-haspopup="menu"
          :aria-expanded="schemeOpen"
          class="flex size-[22px] items-center justify-center rounded-[5px] text-muted-foreground outline-none hover:bg-control-ghost-hover focus-visible:focus-outer active:bg-control-ghost-active aria-expanded:bg-control-ghost-active"
          :aria-label="`Colour scheme: ${LABEL[siteScheme]}. Change`"
          :title="`Colour scheme: ${LABEL[siteScheme]}`"
          @click="onSchemeClick"
          @keydown="onSchemeKeydown"
          @pointerdown="onSchemeDown"
          @pointerup="onSchemeUp"
          @pointerleave="onSchemeUp"
          @contextmenu.prevent
        >
          <span
            aria-hidden="true"
            class="size-4 bg-current [mask-size:contain]"
            :style="{ maskImage: `url(${withBase(`/icons/modern/${ICON[siteScheme]}.svg`)})` }"
          />
        </button>
        <SiteMenu
          v-if="schemeOpen"
          ref="schemeMenuRef"
          :entries="schemeMenu()"
          :labelledby="schemeId"
          class="absolute top-[calc(100%+3px)] left-0 z-50"
          @close="() => closeSchemeMenu(true)"
          @prev="() => {}"
          @next="() => {}"
        />
      </div>
    </div>
  </div>
</template>
