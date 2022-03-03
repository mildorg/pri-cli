const path = require('path');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 设置Node 为开发环境
process.env.NODE_ENV = 'development';

const getStyleLoader = () => {
  const cssLoader = require.resolve('css-loader');
  const loader = [MiniCssExtractPlugin.loader, cssLoader];
  return loader;
};

module.exports = {
  // mode: 'production',
  mode: 'development',
  devtool: 'source-map',
  stats: 'errors-warnings',

  entry: {
    app: path.resolve(__dirname, '../src/index.jsx'),
  },

  output: {
    filename: '[name].[contenthash:20].bundle.js',
    clean: true, // 每次build之前清理dist文件夹
  },

  devServer: {
    compress: true,
    hot: true,
    static: { directory: path.join(__dirname, '../public') },
  },

  module: {
    rules: [
      // handle css
      {
        test: /\.css$/i,
        use: getStyleLoader(),
      },

      // handle image
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        type: 'asset/resource',
      },
      { test: /\.html$/i, use: 'html-loader', exclude: /node_modules/ },

      // handle js files
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: [[require.resolve('babel-preset-react-app'), { runtime: 'automatic' }]],
        },
        exclude: [/node_modules/],
      },
    ],
  },

  optimization: {
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    // path alias
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'React App',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash:20].css',
    }),
    new CssMinimizerWebpackPlugin(),
  ],
};
