
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ['src/index.js', 'src/helper.js'],
  output: [
    // esm和es打包出的产物一致
    {
      dir: 'dist/esm',
      format: 'esm'
    },
    {
      dir: 'dist/cjs',
      format: 'cjs'
    },
    {
      dir: 'dist/es',
      format: 'es'
    }
  ]
}

export default buildOptions