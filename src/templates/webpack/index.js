const { getFilesFormDir } = require('../../utils');

async function invokeWebPack() {
  const webpackTemplate = await getFilesFormDir(__dirname);

  return {
    ...webpackTemplate,
    pkg: {
      scripts: {
        build: 'webpack --config ./config/webpack.config.js',
        dev: 'webpack server --config ./config/webpack.config.js --open',
      },
      devDependencies: {
        webpack: '^5.69.1',
        '@babel/core': '^7.15.5',
        '@babel/preset-env': '^7.16.11',
        'babel-loader': '^8.2.3',
        'babel-preset-react-app': '^10.0.1',
        'css-loader': '^6.6.0',
        'css-minimizer-webpack-plugin': '^3.4.1',
        'html-loader': '^3.1.0',
        'html-webpack-plugin': '^5.5.0',
        'mini-css-extract-plugin': '^2.5.3',
        'webpack-cli': '^4.9.2',
        'webpack-dev-server': '^4.7.4',
      },
    },
  };
}

module.exports = invokeWebPack;
