const webpack                       = require('webpack');
const UglifyJsPlugin                = require('uglifyjs-webpack-plugin');
const StatsPlugin                   = require('stats-webpack-plugin');
const config                        = module.exports = require("./webpack.dev");

//----------------------------------------------------------------------

config.mode = "production";

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

// Using Uglify but not really minimizing code will result in a
// bundle that is "tree shaken"
if (!config.optimization) {
    config.optimization = {};
}
if (!config.optimization.minimizer) {
    config.optimization.minimizer = [];
}
config.optimization.minimizer.push(new UglifyJsPlugin({
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
}));


config.plugins.push(
    new StatsPlugin("../me.stats.json")
);
