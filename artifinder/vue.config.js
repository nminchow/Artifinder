module.exports = {
  configureWebpack: {
    devServer: {
      clientLogLevel: 'none',
      public: '0.0.0.0:8080',
      watchOptions: {
        poll: true,
      },
    },
  },
};
