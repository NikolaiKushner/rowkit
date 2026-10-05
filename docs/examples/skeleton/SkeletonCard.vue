<script setup lang="ts">
import { Skeleton } from 'rowkit'
</script>

<template>
  <!-- Compose the shape of what is coming: an avatar, a name and a role, a thumbnail. -->
  <div class="flex w-72 flex-col gap-3 bg-card p-3 shadow-window" aria-busy="true">
    <div class="flex items-center gap-3">
      <Skeleton variant="circle" />
      <div class="flex-1"><Skeleton :lines="2" /></div>
    </div>
    <Skeleton variant="rect" class="h-24" />
  </div>
</template>
