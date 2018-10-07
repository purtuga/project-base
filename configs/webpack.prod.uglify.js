console.warn("[WARN] DEPRECATED: webpack.prod.uglify.js is deprecated. Use webpack.prod.minified.js");
module.exports = require("./webpack.prod")[1];
// FIXME: Delete this file
