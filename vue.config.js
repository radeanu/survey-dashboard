const path = require('path');
// const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

module.exports = {
  publicPath: './',
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,

  chainWebpack(config) {
    config.plugin('VuetifyLoaderPlugin').tap(() => [
      {
        resourceQuery: /lazy\?vuetify-preload/
      }
    ]);
  },

  configureWebpack: {
    resolve: {
      mainFields: ['main', 'browser'],
      alias: {
        '~shared': path.resolve('src/shared/'),
        '~widgets': path.resolve('src/components/widgets/'),
        '~components': path.resolve('src/components/'),
        '~views': path.resolve('src/views/'),
        '~services': path.resolve('src/services/'),
        // lodash: 'lodash/core',
        // moment: 'moment/src/moment',
        xlsx: 'xlsx/dist/xlsx.mini.min'
      }
    },
    plugins: [
      // new ModuleFederationPlugin({
      //   name: "consumer",
      //   filename: "remoteEntry.js",
      //   remotes: {
      //     // survey: "survey@http://localhost:8080/remoteEntry.js",
      //   },
      //   // shared: require("./package.json").dependencies,
      // })
    ]
  }
};
