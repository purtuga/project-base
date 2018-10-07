const devConfig = require("./webpack.dev");
const prodConfig = require("./webpack.prod");
const webpack = require("webpack");
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const StatsPlugin = require('stats-webpack-plugin');

//----------------------------------------------------------------------

function getProdEsmConfig(minified) {
    const prodEsmConfig = prodConfig.getProdConfig(minified, true);

    prodEsmConfig.output.filename = `${ process.env.npm_package_name }.esm${ minified ? ".min" : ""}.js`;
    prodEsmConfig.output.library = "__LIB";
    prodEsmConfig.output.libraryTarget = "var";

    // Re-defined the plugins
    prodEsmConfig.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        ...devConfig.getDevConfig().plugins,
        new EsmWebpackPlugin(),
        new StatsPlugin("../me.stats.json")
    ];

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



