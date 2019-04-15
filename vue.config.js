const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL = process.env.NODE_ENV === 'production'
  ? './'
  : './'

module.exports = {
  baseUrl: BASE_URL,

  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  runtimeCompiler: true,

  devServer: {
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:3003',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
            }
        }
    },
  }
}
