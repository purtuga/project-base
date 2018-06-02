const fs = require("fs");

/**
 * Reads a file and wraps it in a JS Function that supports one input param named `options`.
 * The content of the file is used as a String template, thus can use `options` to
 * replace data in the content when its requested.
 *
 * @param {String} filePath
 * @returns {Function}
 */
module.exports = function getFileContentAsFunction(filePath) {
    return new Function(
        "options",
        "return `" + fs.readFileSync(filePath, "utf8").replace(/\`/g, "\\`") + "`;"
    );
};