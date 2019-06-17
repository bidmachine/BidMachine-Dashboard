import webpack from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';

import defaultConfiguration from './default';

export default (env: webpack.Configuration): webpack.Configuration => merge(defaultConfiguration(env), {
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            DEVELOPMENT: false,
        })
    ],
} as webpack.Configuration)
