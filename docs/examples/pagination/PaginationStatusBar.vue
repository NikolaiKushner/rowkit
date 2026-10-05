<script setup lang="ts">
import { ref } from 'vue'
import { Pagination, StatusBar, StatusBarSection } from 'rowkit'

const page = ref(3)
</script>

<template>
  <!--
    Compact, in a window's status bar: no page-size control, no summary.
    On a phone the range gives way, so the page buttons keep their room.
  -->
  <StatusBar class="max-w-[560px]">
    <StatusBarSection class="max-sm:hidden"
      >Rows {{ (page - 1) * 25 + 1 }}–{{ page * 25 }} of 312</StatusBarSection
    >
    <StatusBarSection class="w-auto py-0 pr-1">
      <Pagination
        v-model:page="page"
        :page-size="25"
        :total="312"
        size="sm"
        hide-page-size
        hide-summary
        label="Users pages"
      />
    </StatusBarSection>
  </StatusBar>
</template>
