const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  //配置方式一：cli提供的属性
  outputDir: './build',
  //配置跨域
  devServer: {
    proxy: {
      '/api': {
        target: '',
        pathRewrite: {
          '^/api': '',
          secure: false,
          changeOrigin: true
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        components: '@/components'
      },
      extensions: ['.ts']
    },
    plugins: [
      require('unplugin-element-plus/webpack')({
        // options
      })
    ]
  }
})
