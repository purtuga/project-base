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

    prodConfig.name = `prod.umd${ minified ? ".min" : ""}`;
    prodConfig.mode = "production";
    prodConfig.output.filename = `${ process.env.npm_package_name }.umd${ minified ? ".min" : ""}.js`;

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
        // 2018-10-07
        // About the Exports below: Because the polyfills from common-micro-libs are available
        // as both named exports as well as default, we need to ensure that the Global defined
        // within the Webpack bundle can find the named exports. To do this, we assign the
        // global to a property on that gobal by the same name.
        // An alternative might have been to use the Webpack internal definition for transpiled
        // Modules: `{ default: WeakMap, WeakMap: WeakMap, __esModule: true}`
        if (IS_COMMON_MICRO_LIB.test(context) || IS_COMMON_MICRO_LIB.test(request)) {
            // Map polyfill
            if (/\/(es6-Map|Map)(\.js)?$/.test(request)) {
                return callback(null, "root (Map.Map = Map)");
            }

            // Set polyfill
            if (/\/(es6-Set|Set)(\.js)?$/.test(request)) {
                return callback(null, "root (Set.Set = Set)");
            }

            // Set polyfill
            if (/\/(es6-promise|Promise)(\.js)?$/.test(request)) {
                return callback(null, "root (Promise.Promise = Promise");
            }

            // Symbol polyfill
            if (/\/Symbol(\.js)?$/.test(request)) {
                return callback(null, "root (Symbol.Symbol = Symbol)");
            }

            // WeakMap polyfill
            if (/\/WeakMap(\.js)?$/.test(request)) {
                return callback(null, "root (WeakMap.WeakMap = WeakMap)");
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
        new StatsPlugin(`../me.webpack.stats.${ prodConfig.name }.json`)
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

