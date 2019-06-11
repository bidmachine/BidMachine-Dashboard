var path = require("path");
const webpack = require('webpack');
const CSSExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const API_URL = process.env['API_URL'] || 'http://localhost:3000';

var config = {
  entry: {
    index: "./src/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "build/public"),
    filename: "assets/bundle.[hash:8].js",
    pathinfo: true,
    publicPath: '/'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        // test: /\.scss$|\.sass|\.css$/,
        // loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!sass-loader'})
        test: /\.s?css$/, use: [
          CSSExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        test: /\.woff2?$|\.otf$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$|\.ico$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[hash].[ext]'
            }
          }
        ]
      }
    ]
  },

  devServer: {
    inline: true,
    port: 8080,
    publicPath: '/',
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: API_URL,
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.ejs'),
      inject: 'body',
      favicon: 'assets/favicon.ico'
    }),
    new CSSExtractPlugin({
      filename: 'assets/bundle.[contenthash:8].css'
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version),
      DEVELOPMENT: DEVELOPMENT,
      PRODUCTION: !DEVELOPMENT
    })
  ]
};
module.exports = config;
