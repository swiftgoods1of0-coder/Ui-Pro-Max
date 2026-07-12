import { defineConfig } from 'vite'
import { hydrogen } from '@shopify/hydrogen/vite'
import { oxygen } from '@shopify/mini-oxygen/vite'
import { vitePlugin as remix } from '@remix-run/dev'
import path from 'path'

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  build: {
    cssMinify: true,
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeAeps: ['@shopify/hydrogen-react'],
  },
})
