const config = module.exports = require("./webpack.prod.esm");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//----------------------------------------------------------------------

// Change output config
config.output.filename = `${ process.env.npm_package_name }.esm.min.js`;

// Find the Uglify entry and replace it with a new one
config.optimization.minimizer.some((pluginInstance, i) => {
    if (pluginInstance instanceof UglifyJsPlugin) {
        config.optimization.minimizer[i] = new UglifyJsPlugin({
            test: /\.m?js$/,
            sourceMap: true,
            uglifyOptions: {
                ecma: 6,
                output: {
                    comments: false
                }
            }
        });

        return true;
    }
});

