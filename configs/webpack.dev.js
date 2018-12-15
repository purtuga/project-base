//---------------------------------------------------------------
//
// THIS CONFIGURATION WORKS ONLY WHEN USED FROM
// AN NPM PACKAGE.JSON SCRIPT
//
//---------------------------------------------------------------
const path          = require("path");
const webpack       = require('webpack');
const esLintConfig  = require("./eslint.config");
const CWD           = path.resolve(process.cwd());

const PACKAGE_NAME      = require("../lib/build.utils").PACKAGE_NAME;
const PACKAGE_VERSION   = process.env.npm_package_version;
const PACKAGE_LICENSE   = process.env.npm_package_license;
const PACKAGE_AUTHOR    = process.env.npm_package_author;

const GIT_HASH = require("../scripts/getGitHash")();

// console.log(CWD);

function getDevConfig() {
    let decoratorsLegacy = process.env.npm_package_project_base_decorators_legacy;
    if ("string" === typeof decoratorsLegacy) {
        decoratorsLegacy = decoratorsLegacy === "true";
    } else {
        decoratorsLegacy = false;
    }

    return {
        name: "dev",
        mode: "development",
        entry: path.join(CWD, process.env.npm_package_main),
        output: {
            // Library Name === package.json#name as CameCase.
            // example: my-module === MyModule
            library: PACKAGE_NAME
                .replace(/^./, match => match.toUpperCase())
                .replace(/-(.)/g, (match, chr) => chr.toUpperCase()),
            libraryTarget:  "umd",
            filename:       `${ PACKAGE_NAME }.js`,
            path:           path.join(CWD, "dist")
        },
        devtool: "source-map",
        devServer: {
            contentBase: [ // Server content from these directories
                path.resolve(CWD, "dist"),
                path.resolve(CWD, "dev"),   // FIXME: remove this in the future
                path.resolve(CWD, "my.dev"),
                path.resolve(CWD)
            ],
            port: 0,
            open: true,
            watchContentBase: true,
            overlay: true,
            compress: true
        },
        resolve: {
            modules: [
                path.resolve(CWD, "node_modules"),  // If installed top-level - use that!
                "node_modules"
            ],
            symlinks: false // Make `npm link`'d packages work as expected
        },

        module: {
            rules: [
                //---------------------------------[  pre loaders ]--
                {
                    enforce: "pre",
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                    options: { // For more, see: https://eslint.org/docs/developer-guide/nodejs-api#cliengine
                        cache: true,
                        parser: "babel-eslint",
                        baseConfig: esLintConfig
                    }
                },


                //---------------------------------[ normal loaders ]--
                {
                    test:   /\.js$/,
                    loader: "babel-loader",
                    options: {
                        babelrc: false,
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    modules: false,
                                    loose: true,
                                    targets: {
                                        browsers: "last 2 Firefox versions"
                                    }
                                }
                            ]
                        ],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": false,
                                    "helpers": true,
                                    "regenerator": true,
                                    "useESModules": true
                                }
                            ],
                            ["@babel/plugin-transform-async-to-generator"],
                            [
                                "@babel/plugin-proposal-decorators",
                                {
                                    "legacy": decoratorsLegacy,
                                    decoratorsBeforeExport: true
                                }
                            ],
                            [
                                "@babel/plugin-proposal-class-properties",
                                {
                                    "loose" : decoratorsLegacy
                                }
                            ]
                        ]
                    }
                },

                {
                    test: /\.less$/,
                    oneOf: [
                        // inline or toString
                        // Return instead the stylesheet as a string
                        {
                            resourceQuery: /(inline|toString|asString|as-string)/i,
                            use: [
                                "to-string-loader",
                                {
                                    loader: "css-loader",
                                    options: {
                                        camelCase: true
                                    }
                                },
                                "less-loader"
                            ]
                        },
                        // ELSE, just use the regular style loader (style tag in document)
                        {
                            use: [
                                "style-loader",
                                "css-loader",
                                "less-loader"
                            ]
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    oneOf: [
                        {   // OLD style that required naming file a special way
                            test: [/\.toString\.css$/],
                            use: [
                                "to-string-loader",
                                {
                                    loader: "css-loader",
                                    options: {
                                        camelCase: true
                                    }
                                }
                            ]
                        },
                        {   // If Query (?) has any of these, return string
                            resourceQuery: /(inline|toString|asString|as-string)/i,
                            use: [
                                "to-string-loader",
                                {
                                    loader: "css-loader",
                                    options: {
                                        camelCase: true
                                    }
                                }
                            ]
                        },
                        {   // DEFAULT: style tag load into the document
                            use: [
                                "style-loader",
                                {
                                    loader: "css-loader",
                                    options: {
                                        camelCase: true
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    test:   /\.(html|htm|txt)$/,
                    use:    ["raw-loader"]
                },
                {
                    test:   /\.(eot|ttf|svg|woff|woff2|png|gif)(\?.*)?$/,
                    use:    [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 150000
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                "BUILD.DATA": {
                    VERSION:    JSON.stringify(PACKAGE_VERSION),
                    AUTHOR:     JSON.stringify(PACKAGE_AUTHOR),
                    LICENSE:    JSON.stringify(PACKAGE_LICENSE),
                    NAME:       JSON.stringify(PACKAGE_NAME),
                    TIMESTAMP:  Date.now(),
                    HASH:       JSON.stringify(GIT_HASH)
                }
            })
        ]
    };
}

module.exports = getDevConfig();

// Expose a few methods with the config
Object.defineProperty(module.exports, `getDevConfig`, {value: getDevConfig});
