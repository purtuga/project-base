//-----------------------------------------------------------------------------
// Creates a "my.dev" folder good for development of libraries.
//
// To use it, add the following to package.json scripts:
//
//      {
//          scripts: {
//              "setup:dev": "node node_modules/project-base/scripts/create-dev"
//          }
//      }
//
//-----------------------------------------------------------------------------
const promisify                 = require("../utils/promisify");
const getFileContentAsFunction  = require("../utils/getFileContentAsFunction");
const fs            = require("fs");
const path          = require("path");
const CWD           = process.cwd();
const buildOutFile  = require("../configs/webpack.dev").output.filename;
const devDir        = path.join(CWD, "my.dev");
const templateLoc   = path.join(__dirname, "..", "templates", "dev");
const readDir       = promisify(fs.readdir);
const readFile      = promisify(fs.readFile);
const writeFile     = promisify(fs.writeFile);
const mkdir         = promisify(fs.mkdir);
const projPackageJson   = require(path.join(CWD, "package.json"));

if (fs.existsSync(devDir)) {
    console.log(`

    Unable to create "my.dev" folder - it already exists.
    ${ devDir }
    Exiting.

`);
    process.exit(0);
}

mkdir(devDir)
    .then(() => readDir(templateLoc))
    .then(files => {
        return files.reduce((whenPriorCompletes, fileName) => {
            return whenPriorCompletes
                .then(() => {
                    return writeFile(
                        path.join(devDir, fileName),
                        getFileContentAsFunction(path.join(templateLoc, fileName))({
                            packageJson: projPackageJson,
                            buildOutFile
                        })
                    );

                    // return readFile(path.join(templateLoc, fileName), "utf8")
                    //     .then(fileContent => {
                    //         if (fileName === "index.html") {
                    //             fileContent = fileContent.replace("_____PACKAGE_NAME_____", buildOutFile);
                    //         }
                    //         return writeFile(path.join(devDir, fileName), fileContent);
                    //     });
                })
        }, Promise.resolve());
    })
    .then(() => {
        console.log(`
-[ DEV SETUP ]-----------------------------------------
    'my.dev/' folder was created: ${ devDir }
    'npm run serve' can now be used to view it.
-------------------------------------------------------
`)
    })
    .catch(console.error);

