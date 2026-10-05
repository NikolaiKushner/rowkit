<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from 'rowkit'

const files = [
  'Quarterly report — revenue by region and plan, final.pdf',
  'logo.svg',
  'Customer interviews, transcripts and notes (September).docx',
]
</script>

<template>
  <!--
    Text cut short by a narrow column: the tooltip shows it whole. The trigger
    takes focus (tabindex), so the full name reaches the keyboard too.
  -->
  <ul class="m-0 flex w-56 list-none flex-col gap-1 bg-input p-1 shadow-sunken">
    <li v-for="file in files" :key="file" class="text-ui">
      <Tooltip>
        <TooltipTrigger as-child>
          <span
            tabindex="0"
            class="block truncate outline-none focus-visible:outline-1 focus-visible:outline-dotted"
          >
            {{ file }}
          </span>
        </TooltipTrigger>
        <TooltipContent placement="right">{{ file }}</TooltipContent>
      </Tooltip>
    </li>
  </ul>
</template>
