const path          = require("path");
const CWD           = path.resolve(process.cwd());
const PACKAGE_NAME  = process.env.npm_package_name;

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
            path.resolve(CWD, "dev")
        ],
        port: 9598
    },
    resolve: {
        modules: [
            path.resolve(CWD, "node_modules")
        ]
    },
    module: {
        rules: []
    },
    plugins: []
};