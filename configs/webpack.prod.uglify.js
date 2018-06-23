const webpack           = require('webpack');
const UglifyJsPlugin    = require('uglifyjs-webpack-plugin');
const config            = module.exports = require("./webpack.prod");

// change output file name
config.output.filename = `${ process.env.npm_package_name }.min.js`;

// Find the Uglify entry and replace it with a new one
config.plugins.some((pluginInstance, i) => {
    if (pluginInstance instanceof UglifyJsPlugin) {
        config.plugins[i] = new UglifyJsPlugin({
            sourceMap: true,
            output: {
                comments: false
            }
        });

        return true;
    }
});

