import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginLess } from '@rsbuild/plugin-less';

export default defineConfig({
  plugins: [pluginReact(),pluginLess()],
  server: {
    open: false,
    port: 18000
  },
  html: {
    template: './public/index.html'
  }
})
