const webpack                       = require('webpack');
const UglifyJSPlugin                = require('uglifyjs-webpack-plugin');
const WebpackBabelExternalsPlugin   = require('webpack-babel-external-helpers-2');
const config = module.exports       = require("./webpack.dev");

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),

    new WebpackBabelExternalsPlugin(/* plugin options object */),

    new UglifyJSPlugin({
        sourceMap: true,
        comments: true,
        beautify: true,
        mangle: false,
        compress: {
            warnings: false,
            collapse_vars: false,
            sequences: false,
            // conditionals: false,
            comparisons: false,
            booleans: false,
            //evaluate:       false,
            hoist_funs: false,
            join_vars: false,
            if_return: false,
            cascade: false
        }
    })
);
