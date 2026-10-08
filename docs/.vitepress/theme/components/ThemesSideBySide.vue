<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  DialogFooter,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'
import { siteScheme } from './site/useSiteTheme'

/**
 * The Themes page's «Side by side» (Figma Site/Content/ThemesPage): one New
 * user form, live, in each theme on its own desktop, with the attribute that
 * is the only difference written under it. The same markup twice — the
 * point of the page. The modern one follows the site's colour scheme.
 */
const THEMES = ['win98', 'modern'] as const

const roles = ['Owner', 'Admin', 'Editor', 'Viewer']
const form = ref(
  Object.fromEntries(
    THEMES.map((theme) => [
      theme,
      { name: 'Ada Lovelace', email: 'ada@analytical', role: 'Editor' },
    ])
  ) as Record<(typeof THEMES)[number], { name: string; email: string; role: string }>
)

const emailError = (email: string) =>
  /^[^@\s]+@[^@\s.]+\.\S+$/.test(email) ? undefined : 'Enter an email like name@example.com'
</script>

<template>
  <div class="rk-demo mt-4 grid items-start gap-6 md:grid-cols-2">
    <figure v-for="theme in THEMES" :key="theme" class="m-0 flex min-w-0 flex-col gap-2.5">
      <div
        :data-theme="theme"
        :data-color-scheme="theme === 'modern' && siteScheme !== 'system' ? siteScheme : undefined"
        class="flex justify-center bg-desktop p-4"
        :class="theme === 'modern' && 'rounded-[10px]'"
      >
        <Window class="w-[320px] max-w-full text-left">
          <WindowTitleBar title="New user">
            <template #controls>
              <WindowButton glyph="close" label="Close New user" disabled />
            </template>
          </WindowTitleBar>
          <WindowBody class="flex flex-col gap-3 px-dialog-px pt-3">
            <Field label="Full name" required>
              <Input v-model="form[theme].name" />
            </Field>
            <Field label="Email" required :error="emailError(form[theme].email)">
              <Input v-model="form[theme].email" type="email" />
            </Field>
            <Field label="Role" hint="Editors can change data but not invite people.">
              <Select v-model="form[theme].role">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem v-for="role in roles" :key="role" :value="role" :label="role" />
                </SelectContent>
              </Select>
            </Field>
          </WindowBody>
          <DialogFooter>
            <Button>OK</Button>
            <Button variant="secondary">Cancel</Button>
          </DialogFooter>
        </Window>
      </div>
      <figcaption class="font-mono text-[12px] leading-[18px] text-muted-foreground">
        data-theme="{{ theme }}"
      </figcaption>
    </figure>
  </div>
</template>
