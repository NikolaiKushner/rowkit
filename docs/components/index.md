---
title: Components
---

# Components

Every component in rowkit, by folder — the same tree as the folder pane on the
left. Each name opens its page: what it is for, examples to copy, and its props.

<script setup>
import ComponentIndex from '../.vitepress/theme/components/ComponentIndex.vue'
import { data } from '../.vitepress/theme/data/components.data'
</script>

<ComponentIndex :summaries="data" />
