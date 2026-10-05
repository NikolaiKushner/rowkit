import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-28',
  devtools: { enabled: false },
  // The Windows 98 faces first, loaded the way an app is told to load them.
  css: [
    '@fontsource/pt-sans/400.css',
    '@fontsource/pt-sans/700.css',
    '@fontsource/vt323/400.css',
    '~/assets/css/main.css',
  ],
  vite: {
    // Tailwind v4 has no Nuxt module; the Vite plugin is the supported path.
    plugins: [tailwindcss()],
  },
  typescript: { typeCheck: false },
})
