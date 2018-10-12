/**
 * Webpack setup that builds a web component.
 * Adds the WebComponentsPolyfill plugin to the config.
 */
const path = require("path");

const WebComponentsPolyfill = require("@purtuga/web-components-polyfill-webpack-plugin");
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const prodEsmConfig = require("./webpack.prod.esm");
const wcConfig = module.exports = [
    prodEsmConfig.getProdEsmConfig(),
    prodEsmConfig.getProdEsmConfig(true)
];
const removeEsmPlugin = (plugin, i, arr) => {
    if (plugin instanceof EsmWebpackPlugin) {
        arr.splice(i, 1);
        return true;
    }
};

// Default Entry file to `src/import.js`
wcConfig[0].entry = wcConfig[1].entry = path.join(process.cwd(), "src", "import.js");

// Name the configs
wcConfig[0].name = "wc";
wcConfig[1].name = "wc.min";

// Rename output bundles to include word `import`
wcConfig[0].output.filename = `${ process.env.npm_package_name }.import.js`;
wcConfig[1].output.filename = `${ process.env.npm_package_name }.import.min.js`;

// remove the ESM plugin
wcConfig[0].plugins.some(removeEsmPlugin);
wcConfig[1].plugins.some(removeEsmPlugin);

wcConfig[0].plugins.push(new WebComponentsPolyfill());
wcConfig[1].plugins.push(new WebComponentsPolyfill());
