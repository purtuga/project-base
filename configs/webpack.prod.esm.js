const devConfig = require("./webpack.dev");
const prodConfig = require("./webpack.prod");
const webpack = require("webpack");
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const StatsPlugin = require('stats-webpack-plugin');
const PACKAGE_NAME      = require("../lib/build.utils").PACKAGE_NAME;
//----------------------------------------------------------------------

function getProdEsmConfig(minified) {
    const prodEsmConfig = prodConfig.getProdConfig(minified, true);

    prodEsmConfig.name = `esm${ minified ? ".min" : ""}`;
    prodEsmConfig.output.filename = `${ PACKAGE_NAME }.esm${ minified ? ".min" : ""}.js`;
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
        new StatsPlugin(`../me.webpack.stats.${ prodEsmConfig.name }.json`)
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



