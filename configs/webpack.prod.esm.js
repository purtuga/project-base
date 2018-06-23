const config = module.exports = require("./webpack.prod");

//----------------------------------------------------------------------
// change output file name
config.output.filename = `${ process.env.npm_package_name }.mjs`;

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

// Don't use my polifills in final package - use globals instead
// FIXME: intercept polyfills - server globals
