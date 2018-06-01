const path          = require("path");
const CWD           = path.resolve(process.cwd());
const PACKAGE_NAME  = process.env.npm_package_name;
const resolveOpt    = { paths: [ CWD ] };

// console.log(CWD);

function localResolve(preset) {
    // console.log(`Path: ${ require.resolve(preset[0], resolveOpt) }`);

    return Array.isArray(preset) ?
        [require.resolve(preset[0], resolveOpt), preset[1]] :
        require.resolve(preset, resolveOpt);
}

let config = module.exports = {
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
            path.resolve(CWD, "node_modules")
        ]
    },
    module: {
        rules: [
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
                test:   /\.(eot|ttf|svg|woff|png|gif)(\?.*)?$/,
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
    plugins: []
};