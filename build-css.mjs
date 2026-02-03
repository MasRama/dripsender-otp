import { readFileSync, writeFileSync } from 'fs'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const css = readFileSync('./src/app.css', 'utf8')

const result = await postcss([
  tailwindcss('./tailwind.config.js'),
  autoprefixer
]).process(css, { from: './src/app.css' })

writeFileSync('./src/compiled.css', result.css)
console.log('CSS compiled! Size:', result.css.length, 'bytes')
