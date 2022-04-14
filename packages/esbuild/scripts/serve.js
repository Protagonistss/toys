const { serve } = require('esbuild')

const entry = () => {
  serve(
    {
      port: 8000,
      servedir: '../dist'
    },
    {
      absWorkingDir: process.cwd(),
      entryPoints: ['./main.jsx'],
      bundle: true,
      format: "esm",
      sourcemap: true,
      ignoreAnnotations: true,
      metafile: true
    }
  ).then((server) => {
    console.log("Server start at port", server.port)
  })
}
entry()