const { build } = require('esbuild')
const CDN = require('../plugins/import-cdn')

const entry = async () => {
  build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./main.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [CDN()]
  }).then(() => {
    console.log('build finished')
  })
}

entry()