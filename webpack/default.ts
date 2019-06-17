import path from 'path';
import webpack from 'webpack';
import CSSExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env: webpack.Configuration): webpack.Configuration => ({
    entry: path.resolve(__dirname, "../src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "../build/public"),
        filename: "assets/bundle.[hash:8].js",
        pathinfo: true,
        publicPath: '/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    target: 'web',
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
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.ejs'),
            inject: 'body',
            favicon: 'assets/favicon.ico'
        }),
        new CSSExtractPlugin({
            filename: 'assets/bundle.[contenthash:8].css'
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("../package.json").version),
        })
    ]
})
