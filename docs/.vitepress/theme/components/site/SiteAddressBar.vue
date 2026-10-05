<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'
import type { NavNode } from './useSiteNav'

/**
 * The address bar: the page's path as `rowkit:\Section\Page`, in rowkit's own
 * drop-down list. The list holds every page by its address; picking one opens
 * it, and typing filters the list, so a path can be typed and confirmed.
 */
const props = defineProps<{
  pages: NavNode[]
  current: NavNode | undefined
}>()

const router = useRouter()

const addressOf = (node: NavNode) =>
  ['rowkit:', ...node.path.map((folder) => folder.text), node.text].join('\\')

const value = computed({
  get: () => props.current?.link,
  set: (link) => {
    if (link !== undefined && link !== props.current?.link) void router.go(withBase(link))
  },
})
</script>

<template>
  <div class="flex items-center gap-1.5 bg-card px-1 py-0.5">
    <label for="rk-address" class="text-ui text-foreground">Address</label>
    <Select v-model="value" searchable class="min-w-0 flex-1">
      <SelectTrigger id="rk-address" placeholder="rowkit:\" class="w-full" />
      <SelectContent>
        <SelectItem
          v-for="page in pages"
          :key="page.id"
          :value="page.link ?? ''"
          :label="addressOf(page)"
        />
      </SelectContent>
    </Select>
  </div>
</template>
