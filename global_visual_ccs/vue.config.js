const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

module.exports = {
  // options...
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /\/data\/.*\.json$/, to: context => context.parsedUrl.pathname }, // 保证访问 /data/*.json 不被重定向
        { from: /./, to: '/index.html' }, // 其他路由重定向到 index.html
      ]
    },
    client: {
      overlay: false
    }
  }
};
