import { defineConfig } from '@shushu.pro/rollup';

export default defineConfig({
  mode: 'production',
  input: './docs-src/index.ts',
  browser: true,
  plugins: {
    // terser: false,
    babel: ['decorator'],
  },
  output: {
    iife: {
      file: './docs/index.js',
    },
  },
});
