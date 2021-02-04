const path = require('path');
// const HTMLWebpackPlugin = require('html-webpack-plugin');
const _require = id => require(require.resolve(id, { paths: [require.main.path] }));
const HTMLWebpackPlugin = _require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = _require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if (!isDev) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ];
  }

  return config;
};

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '',
      },
    },
    'css-loader'
  ];

  if (extra) {
    loaders.push(extra);
  }

  // return extra ? [extra] : loaders;
  return loaders;
};

const jsLoaders = () => {
  const loaders = [{
    loader: "babel-loader",
    options: {
      presets: ['@babel/preset-env'],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ],
    }
  }];

  return isDev ? ["eslint-loader"] : loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    overlay: true,
    open: true,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : 'nosources-source-map',
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Cicklum calendar',
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: !isDev,
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/inline',
      },
      {
        test: /\.(sass|scss)$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ]
  }
}