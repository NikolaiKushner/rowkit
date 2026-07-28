import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-28',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    // Tailwind v4 has no Nuxt module; the Vite plugin is the supported path.
    plugins: [tailwindcss()],
  },
  typescript: { typeCheck: false },
})
