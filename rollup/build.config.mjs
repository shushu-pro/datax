import { defineConfig } from '@shushu.pro/rollup';

export default defineConfig({
  plugins: {
    // terser: false,
    babel: ['decorator'],
  },
  output: {
    cjs: true,
    es: true,
    umd: {
      name: 'DataX',
    },
    dts: true,
  },
});
