const webpack               = require('webpack');
const UglifyJsPlugin        = require('uglifyjs-webpack-plugin');
const StatsPlugin           = require('stats-webpack-plugin');
const WebComponentsPolyfill = require("@purtuga/web-components-polyfill-webpack-plugin");
const devConfig             = require("./webpack.dev");

//----------------------------------------------------------------------
const plugins = [];

if (process.env.npm_package_project_base_build_with_web_components_polyfill) {
    plugins.push(new WebComponentsPolyfill());
}


function getProdConfig(minified) {
    const prodConfig = devConfig.getDevConfig();

    prodConfig.mode = "production";

    if (minified) {
        prodConfig.output.filename = `${ process.env.npm_package_name }.min.js`;
    }

    prodConfig.module.rules.some((rule, i) => {
        if (rule.loader === "babel-loader") {
            rule.options.presets = [
                ["env", { "modules": false, targets: { "uglify": true } }]
            ];

            return true;
        }
    });

    prodConfig.plugins.unshift(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    );

    // Using Uglify but not really minimizing code will result in a
    // bundle that is "tree shaken"
    if (!prodConfig.optimization) {
        prodConfig.optimization = {};
    }

    prodConfig.optimization.minimizer = [];

    if (minified) {
        prodConfig.optimization.minimizer.push(new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false
                }
            }
        }));
    }
    else {
        prodConfig.optimization.minimizer.push(new UglifyJsPlugin({
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
    }

    prodConfig.plugins.push(
        new StatsPlugin("../me.stats.json"),
        ...plugins
    );

    return prodConfig;
}


//------------------------------------------------[   EXPORTS   ]-------------
module.exports = [
    // Non-minimized version
    getProdConfig(),

    // Minimized version
    getProdConfig(true)
];
Object.defineProperty(module.exports, `getProdConfig`, {value: getProdConfig});

