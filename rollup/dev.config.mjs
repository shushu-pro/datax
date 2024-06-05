import { defineConfig } from '@shushu.pro/rollup';

export default defineConfig({
  input: './playground/index.ts',
  base: './',
  // port: 10004,
  dev: 'browser',
  // env: {
  //   matomo: { siteId: 3 },
  // },
  plugins: {
    terser: false,
    babel: ['decorator'],
    // babel: ['react'],
    // postcss: {
    //   modules: false,
    //   extract: true,
    // },
  },
  // transformImports: {
  //   antd: true,
  // },
});
