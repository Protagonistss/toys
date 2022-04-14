const { build } = require('esbuild')

const entry = async () => {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./main.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    external: [],
    splitting: true,
    sourcemap: true,
    metafile: true,
    minify: false,
    watch: false,
    write: true,
    loader: {
      '.png': 'base64'
    }
  })
  console.log('result', result)
}

entry()