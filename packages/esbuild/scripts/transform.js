const { transform } = require('esbuild')

const entry = async () => {
  const content = await transform(
    "const hello = () => { console.log('hello esbuild') };",
    {
      sourcemap: true,
      loader: 'tsx'
    }
  )
  console.log('content', content)
}
entry()