import webpack from 'webpack';
import merge from 'webpack-merge';

import defaultConfiguration from './default';

export default (env: webpack.Configuration): webpack.Configuration => merge(defaultConfiguration(env), {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPMENT: true,
        })
    ],
    devServer: {
        inline: true,
        port: 8080,
        publicPath: '/',
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: process.env['API_URL'] || 'http://localhost:3000',
                secure: false,
                changeOrigin: true,
                logLevel: 'debug',
            }
        }
    },
    devtool: 'source-map',
} as webpack.Configuration);
