const isPro = process.env.NODE_ENV === 'production'
module.exports = {
  productionSourceMap: !isPro,
  publicPath: './',
  configureWebpack: config => {
    if (isPro) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios'
    }
  },

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    open: true,
    hot: true,
    port: 8899,
    proxy: {
      '/ishop': {
        target: 'http://172.100.25.32:9600',
        ws: false,
        changeOrigin: true
      }
    }
  },

  lintOnSave: undefined
}
