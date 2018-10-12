/**
 * Webpack setup that builds a web component.
 * Adds the WebComponentsPolyfill plugin to the config.
 */
const path = require("path");
const StatsPlugin = require('stats-webpack-plugin');
const WebComponentsPolyfill = require("@purtuga/web-components-polyfill-webpack-plugin");
const prodLegacyConfig = require("./webpack.prod.legacy");
const wcConfig = module.exports = [
    prodLegacyConfig.getProdConfig(),
    prodLegacyConfig.getProdConfig(true)
];
const getStatsPluginsInstance = function (config) {
    return config.plugins.find(pluginInstance => pluginInstance instanceof StatsPlugin);
};

// Default Entry file to `src/import.js`
wcConfig[0].entry = wcConfig[1].entry = path.join(process.cwd(), "src", "import.js");

// Rename output bundles to include word `import`
wcConfig[0].output.filename = `${ process.env.npm_package_name }.import.legacy.js`;
wcConfig[1].output.filename = `${ process.env.npm_package_name }.import.legacy.min.js`;

// Name the configs
wcConfig[0].name = "wc.legacy";
wcConfig[1].name = "wc.legacy.min";

// Remove UMD wrapper (not needed)
wcConfig[0].output.library          = wcConfig[1].output.library = "__LIB";
wcConfig[0].output.libraryTarget    = wcConfig[1].output.libraryTarget = "var";

// Add Web Components Polyfill loading wrapper
wcConfig[0].plugins.push(new WebComponentsPolyfill());
wcConfig[1].plugins.push(new WebComponentsPolyfill());


// Adjust stats output file name
getStatsPluginsInstance(wcConfig[0]).output = `../me.webpack.stats.${ wcConfig[0].name }.json`;
getStatsPluginsInstance(wcConfig[1]).output = `../me.webpack.stats.${ wcConfig[1].name }.json`;