import { defineConfig, loadEnv } from 'vite'
import { minify } from 'html-minifier-terser'
import QRCode from 'qrcode'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { VitePWA } from 'vite-plugin-pwa'

const htmlMinifierPlugin = () => {
  return {
    name: 'html-minifier-plugin',
    enforce: 'post',
    async transformIndexHtml(html) {
      return await minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        processConditionalComments: true,
        removeOptionalTags: true
      })
    },
  }
}

const qrCodePlugin = () => {
  return {
    name: 'qr-code-plugin',
    async writeBundle() {
      const filePath = resolve(__dirname, 'dist/index.html')
      const code = readFileSync(filePath, 'utf-8')

      await QRCode.toFile(resolve(__dirname, 'public/index.qr.png'), code, {
        errorCorrectionLevel: 'L',
        type: 'png',
        width: 1000,
        margin: 1
      })

      const pwaScript = `<link rel="manifest" href="manifest.webmanifest"><script>if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js')</script>`
      writeFileSync(filePath, code + pwaScript)
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseUrl = process.env.BASE_URL || env.BASE_URL || '/'

  return {
    base: baseUrl,
    plugins: [
      VitePWA({
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        injectRegister: null,
        manifest: {
          name: 'QRx',
          short_name: 'qrx',
          description: 'recursive html file',
          theme_color: '#ffffff',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          globIgnores: ['**/404.html', '**/index.qr.png'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true
        }
      }),
      htmlMinifierPlugin(),
      qrCodePlugin()
    ],
    build: {
      minify: 'terser',
      terserOptions: { format: { comments: false } },
    }
  }
})
