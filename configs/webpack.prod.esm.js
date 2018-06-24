const config = module.exports = require("./webpack.prod");
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//----------------------------------------------------------------------

// Change output config
config.output.filename = `${ process.env.npm_package_name }.esm.js`;
config.output.library = "__LIB";
config.output.libraryTarget = "var";

// Target last 2 version of firefox for code transpilation
config.module.rules.some((rule, i) => {
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
config.plugins.unshift(new EsmWebpackPlugin());

// For all polyfills provided via `common-micro-libs`,
// replace them with the runtime Global
if (!config.externals) {
    config.externals = [];
}
const IS_COMMON_MICRO_LIB = /common-micro-libs/;
config.externals.push(function (context, request, callback) {
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
config.optimization.minimizer.some((pluginInstance, i) => {
    if (pluginInstance instanceof UglifyJsPlugin) {
        config.optimization.minimizer[i] = new UglifyJsPlugin({
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

        return true;
    }
});
