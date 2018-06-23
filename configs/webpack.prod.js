const webpack                       = require('webpack');
const UglifyJsPlugin                = require('uglifyjs-webpack-plugin');
const StatsPlugin                   = require('stats-webpack-plugin');
const config                        = module.exports = require("./webpack.dev");

//----------------------------------------------------------------------

config.mode = "production";

if (!config.optimization) {
    config.optimization = {};
}
config.optimization.minimize = false;

config.module.rules.some((rule, i) => {
    if (rule.loader === "babel-loader") {
        rule.options.presets = [
            ["env", { "modules": false, targets: { "uglify": true } }]
        ];

        return true;
    }
});

config.plugins.unshift(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
);

config.plugins.push(
    // new WebpackBabelExternalsPlugin(/* plugin options object */),

    new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
            compress: {
                warnings: false,
                collapse_vars: false,
                sequences: false,
                comparisons: false,
                booleans: false,
                hoist_funs: false,
                join_vars: false,
                if_return: false,
                dead_code: true
            },
            mangle: false,
            output: {
                beautify: true,
                comments: true
            }
        }
    }),

    new StatsPlugin("../me.stats.json")
);
