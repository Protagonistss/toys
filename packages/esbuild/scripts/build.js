const { build } = require('esbuild')
const CDN = require('../plugins/import-cdn')
const HTML = require('../plugins/gen-html')

const entry = async () => {
  build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./main.jsx', './home.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [HTML(), CDN()]
  }).then(() => {
    console.log('build finished')
  })
}

entry()