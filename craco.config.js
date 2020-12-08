const CracoLessPlugin = require('craco-less');
const tennecoBlue = '#0033A0';

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
                '@primary-color': tennecoBlue,
                '@layout-body-background': '#fff',
                '@layout-header-background': tennecoBlue,
                '@menu-highlight-color': '#fff',
                '@layout-trigger-background': '#002a85',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};