/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.lib.json',
      include: ['src'],
      entryRoot: 'src',
      outDirs: 'dist',
      // tsconfig.lib.json is a typecheck-only project (noEmit). Flip emit on
      // just for declaration generation.
      // declarationMap is off: source isn't shipped (`files: ["dist"]`), so the
      // maps would dangle.
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
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      output: {
        preserveModules: false,
      },
    },
  },
  test: {
    name: 'tokens',
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
})
