/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * Anything matching these is resolved from the consumer's node_modules rather
 * than bundled. Hard rule 5: `vue` is never bundled into the library output.
 */
const external = [
  /^vue$/,
  /^vue\//,
  /^@vue\//,
  /^@rowkit\//,
  /^reka-ui$/,
  // Kept external so a consumer who already uses them gets one copy. Two
  // copies of tailwind-merge would mean two separate class-group configs.
  /^clsx$/,
  /^tailwind-merge$/,
  // Same reasoning, and it is a declared dependency either way. Bundling it
  // also emitted a `dist/node_modules/` tree once the build stopped producing
  // a single file.
  /^class-variance-authority$/,
]

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.lib.json',
      include: ['src'],
      entryRoot: 'src',
      outDirs: 'dist',
      cleanVueFileName: true,
      // tsconfig.lib.json is a typecheck-only project (noEmit). Flip emit on
      // just for declaration generation.
      // declarationMap is off: source isn't shipped (`files: ["dist"]`), so the
      // maps would dangle — and `cleanVueFileName` renames the .d.ts without
      // rewriting the map reference.
      compilerOptions: {
        noEmit: false,
        declaration: true,
        declarationMap: false,
        emitDeclarationOnly: true,
      },
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es'],
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    name: 'ui',
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
