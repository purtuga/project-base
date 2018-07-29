/**
 * Webpack setup that builds a web component.
 * Adds the WebComponentsPolyfill plugin to the config.
 */


const WebComponentsPolyfill = require("@purtuga/web-components-polyfill-webpack-plugin");
const getProdConfig = require("./webpack.prod").getProdConfig;

module.exports = [
    getProdConfig(false, true),
    getProdConfig(true, true)
];

module.exports[0].plugins.push(new WebComponentsPolyfill());
module.exports[1].plugins.push(new WebComponentsPolyfill());