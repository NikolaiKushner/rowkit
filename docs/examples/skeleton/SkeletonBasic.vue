<script setup lang="ts">
import { Skeleton } from 'rowkit'
</script>

<template>
  <!-- Lines of text; the last is shorter, as a paragraph's is. -->
  <div class="w-72">
    <Skeleton :lines="3" label="Loading the article" />
  </div>
</template>
