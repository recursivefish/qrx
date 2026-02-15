import { defineConfig, loadEnv } from 'vite'
import { minify } from 'html-minifier-terser'
import QRCode from 'qrcode'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const htmlMinifierPlugin = () => {
  return {
    name: 'html-minifier-plugin',
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
    async closeBundle() {
      const file = resolve(__dirname, 'dist/index.html')
      const code = readFileSync(file, 'utf-8')
      
      await QRCode.toFile(resolve(__dirname, 'public/index.qr.png'), code, {
        errorCorrectionLevel: 'L',
        type: 'png',
        width: 1000,
        margin: 1
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.APP_BASE || '/',
    plugins: [htmlMinifierPlugin(), qrCodePlugin()],
    build: {
      minify: 'terser',
      terserOptions: {
        format: {
          comments: false,
        },
      },
    }
  }
})
