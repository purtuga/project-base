const execSync    = require("child_process").execSync;
let gitHash     = "";

module.exports = function(noChache){
    if (gitHash && !noChache) {
        return gitHash;
    }

    try {
        gitHash = execSync("git rev-parse --short HEAD").toString().replace(/\n/g, "");
    }
    catch(e) {
        console.log(`[WARNING][getGitHash] running git command failed: ${e.message}`);
        gitHash = "Unknown";
    }

    return gitHash;
};
