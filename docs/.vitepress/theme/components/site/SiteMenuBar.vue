<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase, type DefaultTheme } from 'vitepress'

/**
 * The menu bar under the title bar: the site's top navigation, from the
 * `nav` config. Items are links for now — their drop-down menus come with the
 * Start menu. Hovered, an item rises with a thin bevel; focused from the
 * keyboard it turns navy.
 */
const { theme } = useData<DefaultTheme.Config>()

function linkOf(item: DefaultTheme.NavItem): string | undefined {
  if ('link' in item) return item.link
  const first = 'items' in item ? item.items[0] : undefined
  return first && 'link' in first ? first.link : undefined
}

const items = computed(() =>
  (theme.value.nav ?? []).flatMap((item) => {
    const link = linkOf(item)
    if (!('text' in item) || link === undefined) return []
    const external = /^https?:/.test(link)
    return [{ text: item.text, href: external ? link : withBase(link), external }]
  })
)
</script>

<template>
  <nav aria-label="Main" class="flex items-center bg-card px-0.5 py-px">
    <a
      v-for="item in items"
      :key="item.text"
      :href="item.href"
      :target="item.external ? '_blank' : undefined"
      :rel="item.external ? 'noreferrer' : undefined"
      class="flex h-[18px] items-center px-1.5 text-ui text-foreground no-underline outline-none hover:shadow-raised-thin focus-visible:bg-surface-selected focus-visible:text-on-selected"
      >{{ item.text }}</a
    >
  </nav>
</template>
