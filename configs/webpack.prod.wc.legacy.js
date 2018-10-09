/**
 * Webpack setup that builds a web component.
 * Adds the WebComponentsPolyfill plugin to the config.
 */
const path = require("path");

const WebComponentsPolyfill = require("@purtuga/web-components-polyfill-webpack-plugin");
const wcConfig = module.exports = require("./webpack.prod.legacy");


// Default Entry file to `src/import.js`
wcConfig[0].entry = wcConfig[1].entry = path.join(process.cwd(), "src", "import.js");

// Rename output bundles to include word `import`
wcConfig[0].output.filename = `${ process.env.npm_package_name }.import.legacy.js`;
wcConfig[1].output.filename = `${ process.env.npm_package_name }.import.legacy.min.js`;

// Remove UMD wrapper (not needed)
wcConfig[0].output.library          = wcConfig[1].output.library = "__LIB";
wcConfig[0].output.libraryTarget    = wcConfig[1].output.libraryTarget = "var";

// Add Web Components Polyfill loading wrapper
wcConfig[0].plugins.push(new WebComponentsPolyfill());
wcConfig[1].plugins.push(new WebComponentsPolyfill());
