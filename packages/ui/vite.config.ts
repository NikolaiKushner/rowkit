/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * Anything matching these is resolved from the consumer's node_modules rather
 * than bundled. Hard rule 5: `vue` is never bundled into the library output.
 */
const external = [/^vue$/, /^vue\//, /^@vue\//, /^@rowkit\//, /^reka-ui$/]

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
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external,
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
  test: {
    name: 'ui',
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
  },
})
