const prodConfig = require("./webpack.prod");
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//----------------------------------------------------------------------

function getProdEsmConfig(minified) {
    const prodEsmConfig = prodConfig.getProdConfig(false, true);

    prodEsmConfig.output.filename = `${ process.env.npm_package_name }.esm${ minified ? ".min" : ""}.js`;
    prodEsmConfig.output.library = "__LIB";
    prodEsmConfig.output.libraryTarget = "var";

    // Target last 2 version of firefox for code transpilation
    prodEsmConfig.module.rules.some((rule, i) => {
        if (rule.loader === "babel-loader") {
            rule.options.presets = [
                [
                    "env",
                    {
                        modules: false,
                        targets: {
                            browsers: "last 2 Firefox versions"
                        }
                    }
                ]
            ];

            return true;
        }
    });

    // Insert the ESM plugin - at the top of the list
    prodEsmConfig.plugins.unshift(new EsmWebpackPlugin());

    // For all polyfills provided via `common-micro-libs`,
    // replace them with the runtime Global
    if (!prodEsmConfig.externals) {
        prodEsmConfig.externals = [];
    }
    const IS_COMMON_MICRO_LIB = /common-micro-libs/;
    prodEsmConfig.externals.push(function (context, request, callback) {
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

    // Adjust Uglify minifier options
    prodEsmConfig.optimization.minimizer.some((pluginInstance, i) => {
        if (pluginInstance instanceof UglifyJsPlugin) {
            if (minified) {
                prodEsmConfig.optimization.minimizer[i] = new UglifyJsPlugin({
                    test: /\.m?js$/,
                    sourceMap: true,
                    uglifyOptions: {
                        ecma: 6,
                        output: {
                            comments: false
                        }
                    }
                })
            }
            else {
                prodEsmConfig.optimization.minimizer[i] = new UglifyJsPlugin({
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
                            comments: true
                        }
                    }
                });
            }

            return true;
        }
    });

    return prodEsmConfig;
}

//------------------------------------------------[   EXPORTS   ]-------------
module.exports = [
    // Non-minimized version
    getProdEsmConfig(),

    // Minimized version
    getProdEsmConfig(true)
];
Object.defineProperty(module.exports, `getProdEsmConfig`, {value: getProdEsmConfig});



