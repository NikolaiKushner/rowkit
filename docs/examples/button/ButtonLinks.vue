<script setup lang="ts">
import { Button } from 'rowkit'
</script>

<template>
  <!--
    Something that changes the URL is a link: render an <a> with `as`, and
    middle-click, copy link and open in a new tab keep working.
  -->
  <div class="flex flex-wrap items-center gap-2">
    <Button as="a" href="/installation">Get started</Button>
    <Button
      as="a"
      href="https://github.com/NikolaiKushner/rowkit"
      target="_blank"
      rel="noreferrer"
      variant="secondary"
    >
      GitHub
    </Button>
    <Button as="a" href="/components/data-table" variant="link">See the DataTable</Button>
  </div>
</template>
