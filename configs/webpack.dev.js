const path          = require("path");
const webpack       = require('webpack');
const CWD           = path.resolve(process.cwd());
const resolveOpt    = { paths: [ CWD ] };

const PACKAGE_NAME      = process.env.npm_package_name;
const PACKAGE_VERSION   = process.env.npm_package_version;
const PACKAGE_LICENSE   = process.env.npm_package_license;
const PACKAGE_AUTHOR    = process.env.npm_package_author;

const GIT_HASH = require("../scripts/getGitHash")();

// console.log(CWD);

function localResolve(preset) {
    // console.log(`Path: ${ require.resolve(preset[0], resolveOpt) }`);

    return Array.isArray(preset) ?
        [require.resolve(preset[0], resolveOpt), preset[1]] :
        require.resolve(preset, resolveOpt);
}

function getDevConfig() {
    return {
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
                path.resolve(CWD, "my.dev")
            ],
            port: 0,
            open: true,
            watchContentBase: true,
            overlay: true
        },
        resolve: {
            modules: [
                path.resolve(CWD, "node_modules"),
                "node_modules"
            ]
        },
        module: {
            rules: [
                //---------------------------------[  pre loaders ]--
                {
                    enforce: "pre",
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                    options: {
                        cache: true,
                        parser: "babel-eslint"
                    }
                },


                //---------------------------------[ normal loaders ]--
                {
                    test:   /\.js$/,
                    loader: "babel-loader",
                    options: {
                        babelrc: false,
                        presets: [
                            ["babel-preset-env", {
                                modules: false,
                                loose: true,
                                targets: {
                                    browsers: "last 2 Chrome versions"
                                }
                            }]
                        ].map(localResolve),
                        plugins: [
                            ["babel-plugin-transform-decorators-legacy"],
                            ["babel-plugin-transform-builtin-classes", {
                                "globals": ["Array", "Error", "HTMLElement"]
                            }]
                        ].map(localResolve)
                    }
                },
                {
                    test: /\.less$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "less-loader"
                    ]
                },
                {   // CSS FILES THAT SHOULD BE RETURNED BACK AS A STRING
                    // (INSTEAD OF BEING SENT/EMBEDED INTO THE PAGE AS <STYLE> TAGS
                    // IDEAL FOR USE WITH WEB COMPONENTS THAT USE SHADOW DOM
                    test: /\.toString\.css$/,
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
                {
                    test: /^(?!.*toString\.css$).*\.css$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                camelCase: true
                            }
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
            }),
        ]
    };
}

module.exports = getDevConfig();
Object.defineProperty(module.exports, `getDevConfig`, {value: getDevConfig});
