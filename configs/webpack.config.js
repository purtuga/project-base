/**
 * Returns an array to webpack with the list of build configuration that should be run.
 * @param env
 *  The webpack `--env` set value in the cli ( {@link https://webpack.js.org/api/cli/#environment-options} ).
 *  Supported options are:
 *
 *  -   `env.build` | `String|String[]`:
 *      The build type that whose configuration should be returned.
 *      Value should match the associated webpack config file name found between the word
 *      `webpack.` and `.js`. example: `webpack.prod.legacy.minified.js` would be
 *      `--env.build=prod.legacy.minified`.
 *
 * @returns {Array}
 */
module.exports = (env /*, argv*/) => {
    let configs = [];

    const requestedBuilds = !env || !env.build
        ? []
        : Array.isArray(env.build)
            ? env.build
            : [env.build];

    requestedBuilds.forEach((build, i) => requestedBuilds[i] = String(build).toLowerCase().trim());

    if (!requestedBuilds.length) {
        configs.push(require("./webpack.dev"));
    } else {
        configs = requestedBuilds.map(buildType => Object.assign({}, require(`./webpack.${buildType}.js`)));
    }

    return configs;
};
