#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const cwd = process.cwd();
const promisify = require("util").promisify;
const writeFile = promisify(fs.writeFile);
const readline = require('readline');
const packageJsonFile = path.join(cwd, "package.json");
const packageJson = require(packageJsonFile);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`

This will replace your existing package.json script section. 

Continue? Y|n  `, answer => {
    answer = String(answer).trim().toLowerCase();
    if (answer === "y" || !answer) {
        packageJson.scripts = {
            "serve": "webpack-dev-server --config node_modules/Base/configs/webpack.dev.js --progress --hot --color --entry ./dev/index.js",
            "build": "webpack --config node_modules/Base/configs/webpack.dev.js",
            "build:ie": "webpack --config node_modules/Base/configs/webpack.prod.js --entry ./dev/index.js --output-path ./dev",
            "build:prod": "webpack --config node_modules/Base/configs/webpack.prod.js",
            "build:prod:min": "webpack --config node_modules/Base/configs/webpack.prod.uglify.js",
            "dist": "npm run build:prod&&npm run build:prod:min",
            "setup:dev": "node node_modules/Base/scripts/create-dev",
            "test": "tape test/**/*.js"
        };

        writeFile(packageJsonFile, JSON.stringify(packageJson, null, 4)).then(() => {
            console.log(`
    Done!
    Review package.json for change made.
`);
            process.exit(0);
        });
    }
    else {
        console.log(`
Aborted. Nothing done!
`);
        process.exit(0);
    }
});





