const webpack               = require('webpack');
const UglifyJsPlugin        = require('uglifyjs-webpack-plugin');
const StatsPlugin           = require('stats-webpack-plugin');
const WebComponentsPolyfill = require("@purtuga/web-components-polyfill-webpack-plugin");
const WrapperPlugin         = require('wrapper-webpack-plugin');
const devConfig             = require("./webpack.dev");
const globalScoping         = require("../lib/browser.scope.globals");

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

    if (minified) {
        prodConfig.output.filename = `${ process.env.npm_package_name }.min.js`;
    }

    prodConfig.plugins.unshift(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    );

    //-------------------------------------------------------
    // For all polyfills provided via `common-micro-libs`,
    // replace them with the runtime Global
    //-------------------------------------------------------
    if (!prodConfig.externals) {
        prodConfig.externals = [];
    }
    const IS_COMMON_MICRO_LIB = /common-micro-libs/;
    prodConfig.externals.push(function (context, request, callback) {
        if (IS_COMMON_MICRO_LIB.test(context) || IS_COMMON_MICRO_LIB.test(request)) {
            // Map polyfill
            if (/\/(es6-Map|Map)(\.js)?$/.test(request)) {
                return callback(null, "root Map");
            }

            // Set polyfill
            if (/\/(es6-Set|Set)(\.js)?$/.test(request)) {
                return callback(null, "root Set");
            }

            // Set polyfill
            if (/\/(es6-promise|Promise)(\.js)?$/.test(request)) {
                return callback(null, "root Promise");
            }

            // Symbol polyfill
            if (/\/Symbol(\.js)?$/.test(request)) {
                return callback(null, "root Symbol");
            }

            // WeakMap polyfill
            if (/\/WeakMap(\.js)?$/.test(request)) {
                return callback(null, "root WeakMap");
            }
        }

        callback();
    });

    //----------------------------------------------------
    // Adjust Uglify minifier options to output ES6
    //----------------------------------------------------
    if (!prodConfig.optimization) {
        prodConfig.optimization = {};
    }

    prodConfig.optimization.minimizer = [];

    if (minified) {
        prodConfig.optimization.minimizer.push(
            new UglifyJsPlugin({
                test: /\.m?js$/,
                sourceMap: true,
                uglifyOptions: {
                    ecma: 6,
                    output: {
                        comments: false
                    }
                }
            })
        );
    }
    else {
        prodConfig.optimization.minimizer.push(
            new UglifyJsPlugin({
                test: /\.m?js$/,
                sourceMap: true,
                uglifyOptions: {
                    ecma: 6,
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
                        comments: false
                    }
                }
            })
        );
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
            test:   /\.js$/,
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

