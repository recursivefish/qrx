import { defineConfig } from 'vite'
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
      
      await QRCode.toFile(resolve(__dirname, 'dist/index.qr.png'), code, {
        errorCorrectionLevel: 'L',
        type: 'png',
        width: 1000,
        margin: 1
      })
    }
  }
}

export default defineConfig({
  plugins: [htmlMinifierPlugin(), qrCodePlugin()],
  build: {
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
  }
})
