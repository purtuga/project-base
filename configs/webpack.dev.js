let config = module.exports = {
    entry: './src/index.js',
    output: {
        library: "",
        libraryTarget: "umd",
        filename: '?.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    devServer: {
        contentBase: [
            path.resolve(__dirname, "dist"),
            path.resolve(__dirname, "dev")
        ],
        port: 9598
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "node_modules")
        ]
    },
    module: {
        rules: []
    },
    plugins: []
};