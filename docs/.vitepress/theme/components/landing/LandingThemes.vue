<script setup lang="ts">
import { h, ref, type FunctionalComponent } from 'vue'
import {
  Button,
  Checkbox,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Window,
  WindowBody,
} from 'rowkit'
import { defineTheme } from 'rowkit/theme'
import { siteScheme } from '../site/useSiteTheme'
import CodeBlock from './CodeBlock.vue'
import SectionHeading from './SectionHeading.vue'

/**
 * «One set of components. Any look.»: one New user form three times, live —
 * in Windows 98, in modern, and in a theme `defineTheme()` writes from the
 * values in the sample under them. The sample is the call the third panel
 * runs, so what the page claims is what it does.
 */
const violet = {
  '--color-control-primary': '#5b3df5',
  '--color-control-primary-hover': '#4f33e0',
  '--color-control-primary-active': '#4327c9',
  '--color-checked': '#5b3df5',
  '--radius-md': '10px',
}

const acme = defineTheme({ name: 'acme', extends: 'modern', light: violet, dark: violet })

const SAMPLE = `import { defineTheme } from 'rowkit/theme'

const violet = {
  '--color-control-primary': '#5b3df5',
  '--color-control-primary-hover': '#4f33e0',
  '--color-control-primary-active': '#4327c9',
  '--color-checked': '#5b3df5',
  '--radius-md': '10px',
}

export const acme = defineTheme({
  name: 'acme', // <html data-theme="acme">
  extends: 'modern',
  light: violet,
  dark: violet,
})`

/** A <style> element: templates may not hold one, a render function may. */
const ThemeStyle: FunctionalComponent<{ css: string }> = (props) => h('style', props.css)

const PANELS = [
  { theme: 'win98', name: 'Windows 98', note: 'data-theme="win98"' },
  { theme: 'modern', name: 'Modern', note: 'data-theme="modern"' },
  { theme: 'acme', name: 'Your theme', note: 'defineTheme()' },
] as const

const roles = ['Administrator', 'Editor', 'Viewer']
const forms = ref(PANELS.map(() => ({ name: '', role: 'Administrator', invite: true })))
</script>

<template>
  <section aria-labelledby="lp-themes" class="bg-card px-5 py-16 md:px-6 md:py-28">
    <ThemeStyle :css="acme" />
    <div class="mx-auto flex max-w-[1200px] flex-col gap-12">
      <SectionHeading id="lp-themes" label="Themes" title="One set of components. Any look.">
        A theme is token values and nothing else — the same markup, one attribute apart. Windows 98
        and modern ship in the box; yours is one <code class="font-mono">defineTheme()</code> call.
      </SectionHeading>

      <div class="grid items-start gap-10 md:grid-cols-3 md:gap-6">
        <figure v-for="(panel, i) in PANELS" :key="panel.theme" class="m-0 flex flex-col gap-3">
          <figcaption class="flex items-baseline gap-2">
            <span class="text-[16px] leading-6 font-semibold text-foreground win98:font-bold">{{
              panel.name
            }}</span>
            <code class="font-mono text-[14px] text-muted-foreground">{{ panel.note }}</code>
          </figcaption>
          <div
            :data-theme="panel.theme"
            :data-color-scheme="panel.theme === 'win98' ? undefined : siteScheme"
            class="font-sans text-ui text-foreground"
          >
            <Window>
              <WindowBody class="flex flex-col gap-3 p-5">
                <h3 class="text-[18px] leading-6 font-strong">New user</h3>
                <Field label="Name" required>
                  <Input v-model="forms[i]!.name" placeholder="Name" />
                </Field>
                <Select v-model="forms[i]!.role">
                  <SelectTrigger aria-label="Role" />
                  <SelectContent>
                    <SelectItem v-for="role in roles" :key="role" :value="role" :label="role" />
                  </SelectContent>
                </Select>
                <Checkbox v-model="forms[i]!.invite" label="Send an invitation" />
                <div class="flex justify-end gap-2 pt-1">
                  <Button variant="secondary">Cancel</Button>
                  <Button>Create</Button>
                </div>
              </WindowBody>
            </Window>
          </div>
        </figure>
      </div>

      <CodeBlock :code="SAMPLE" label="The theme in the third panel" />
    </div>
  </section>
</template>
