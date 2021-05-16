// module.exports = {
// 	publicPath: process.env.NODE_ENV === 'production' ? '/sigma-vue' : '/'
// }
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  //	publicPath: process.env.NODE_ENV === 'production' ? '/sigma-vue' : '/',
  //aşağıdaki ayarla apache srver da dist klasöründe uygulma
  //publicPath: process.env.NODE_ENV === 'production' ? '/dist/' :   '/'
};
