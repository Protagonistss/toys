module.exports = () => ({
  name: 'esbuild:cdn',
  setup(build) {
    let https = require('https')
    let http = require('http')
    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      return {
        path: args.path,
        namespace: 'http-url'
      }
    })
    build.onResolve({ filter: /.*/, namespace: 'http-url' }, (args) => {
      const url = new URL(args.path, args.importer).toString()
      return {
        path: url,
        namespace: 'http-url'
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ${url}`)
          let lib = url.startsWith("https") ? https : http
          let req = lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                // 重定向
                fetch(new URL(res.headers.location, url).toString())
                req.abort()
              } else if (res.statusCode === 200) {
                // 响应成功
                let chunks = []
                res.on("data", (chunk) => chunks.push(chunk))
                res.on("end", () => resolve(Buffer.concat(chunks)))
              } else {
                reject(
                  new Error(`GET ${url} failed: status ${res.statusCode}`)
                )
              }
            })
            .on("error", reject)
        }
        fetch(args.path)
      })
      return { contents }
    })
  }
})