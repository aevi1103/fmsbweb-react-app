const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
                '@primary-color': '#0033A0',
                '@layout-body-background': '#FFFFFF',
                '@layout-header-background': '#0033A0',
                '@menu-highlight-color': '#fff',
                '@layout-trigger-background': '#002a85'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};