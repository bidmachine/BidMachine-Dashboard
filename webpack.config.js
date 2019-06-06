var path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const API_URL = process.env['API_URL'] || 'http://localhost:3000';

var config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build/public"),
    filename: "assets/bundle.[hash:8].js",
    pathinfo: true,
    publicPath: '/'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: 'source-map',
  module: {
    loaders: [
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
        test: /\.scss$|\.sass|\.css$/,
        loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!sass-loader'})
      },
      {
        test: /\.woff2?$|\.otf$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$|\.ico$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[hash].[ext]'
        }
      }
    ]
  },
  devServer: {
    inline: true,
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
      inject: true,
      favicon: 'assets/favicon.ico',
      template: path.join(__dirname, 'src/index.ejs')
    }),
    new ExtractTextPlugin("assets/bundle.[contenthash:8].css"),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version),
      DEVELOPMENT: DEVELOPMENT,
      PRODUCTION: !DEVELOPMENT
    })
  ]
};
module.exports = config;
