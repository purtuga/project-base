/**
 * Parses a package name to remove the scope (if any).
 *
 * @param {String} name
 *
 * @returns {String}
 */
function parsePackageName(name = "") {
    if (name.startsWith("@")) {
        return name.substr(name.indexOf("/") + 1);
    }
    return name;
}

//=============================================================================
//                                EXPORTS
//=============================================================================
exports.parsePackageName = parsePackageName;
exports.PACKAGE_NAME = parsePackageName(process.env.npm_package_name || "");
