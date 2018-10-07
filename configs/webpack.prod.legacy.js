const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const WebComponentsPolyfill = require("@purtuga/web-components-polyfill-webpack-plugin");
const WrapperPlugin = require('wrapper-webpack-plugin');
const devConfig = require("./webpack.dev");
const globalScoping = require("../lib/browser.scope.globals");

//----------------------------------------------------------------------
const plugins = [];

if (process.env.npm_package_project_base_build_with_web_components_polyfill === "true") {
    console.log("[INFO][project-base] Adding Web Components Polyfill wrapper");
    plugins.push(new WebComponentsPolyfill());
}


/**
 *
 * @param {Boolean} [minified=false]
 *  return the Minified setup.
 *
 * @param {Boolean} [defaultSetup=false]
 *  When set to `true`, then the default prod. configuration will be returned.
 *  No additional setup is added to it based on package.json entries.
 */
function getProdConfig(minified, defaultSetup) {
    const prodConfig = devConfig.getDevConfig();

    prodConfig.mode = "production";
    prodConfig.output.filename = `${ process.env.npm_package_name }.legacy${ minified ? ".min" : "" }.js`;
    prodConfig.module.rules.some((rule, i) => {
        if (rule.loader === "babel-loader") {
            rule.options.presets = [
                ["env", {"modules": false, targets: {"uglify": true}}]
            ];
            rule.options.plugins.push(
                [
                    "babel-plugin-transform-builtin-classes",
                    {"globals": ["Array", "Error", "HTMLElement"]}
                ]
            );

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
                    comments: function (nodeAst, commentAst) {
                        // Keep comments that start with `++`
                        const keep = /^\+\+/.test(commentAst.value);
                        return keep;
                    }
                }
            }
        }));
    }

    prodConfig.plugins.push(
        new StatsPlugin("../me.stats.json")
    );

    // If not getting the default setup, then add the
    // conditional items based on user settings
    if (!defaultSetup) {
        prodConfig.plugins.push(...plugins);
    }

    // Add final set of plugins
    prodConfig.plugins.push(
        new WrapperPlugin({
            test: /\.js$/,
            header: globalScoping.header,
            footer: globalScoping.footer
        })
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

