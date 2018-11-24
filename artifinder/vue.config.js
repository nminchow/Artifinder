module.exports = {
  configureWebpack: {
    devServer: {
      public: '0.0.0.0:8080',
      clientLogLevel: 'info',
      watchOptions: {
        poll: true,
      },
    },
  },
};
