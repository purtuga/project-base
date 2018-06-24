#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const cwd = process.cwd();
// const promisify = require("util").promisify;
// const writeFile = promisify(fs.writeFile);

const promisify = require("../utils/promisify");
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
            "serve": "webpack-dev-server --config node_modules/project-base/configs/webpack.dev.js --progress --hot --color --entry ./my.dev/index.js",
            "src:lint": "eslint --config ./node_modules/project-base/configs/eslint.config.js src/**",
            "build": "webpack --config node_modules/project-base/configs/webpack.dev.js",
            "build:ie": "webpack --config node_modules/project-base/configs/webpack.prod.js --entry ./my.dev/index.js --output-path ./my.dev --output-filename ie-test-bundle.js",
            "build:prod": "webpack --config node_modules/project-base/configs/webpack.prod.js",
            "build:prod:min": "webpack --config node_modules/project-base/configs/webpack.prod.uglify.js",
            "build:prod:esm": "webpack --config node_modules/project-base/configs/webpack.prod.esm.js",
            "build:prod:esm:min": "webpack --config node_modules/project-base/configs/webpack.prod.esm.minified.js",
            "build:apiDocs": "jsdoc -c node_modules/project-base/configs/jsdoc.conf.json",
            "dist": "npm run build:prod&&npm run build:prod:min&&npm run build:prod:esm&&npm run build:prod:esm:min",
            "setup:dev": "node node_modules/project-base/scripts/create-dev",
            "test": "tape -r esm test/**/*.js"
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





