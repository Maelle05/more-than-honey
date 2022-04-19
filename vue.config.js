module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.glsl$/i,
          use: 'raw-loader',
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/styles/main.scss";
        `
      }
    }
  }
}