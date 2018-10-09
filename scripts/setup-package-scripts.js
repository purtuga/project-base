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

            "build": "webpack --config node_modules/project-base/configs/webpack.dev.js",
            "build:ie": "webpack --config node_modules/project-base/configs/webpack.dev.ie.js --entry ./my.dev/index.js --output-path ./my.dev --output-filename ie-test-bundle.js",

            "build:prod": "webpack --config node_modules/project-base/configs/webpack.prod.js",
            "build:prod:min": "webpack --config node_modules/project-base/configs/webpack.prod.minified.js",
            "build:prod:non-min": "webpack --config node_modules/project-base/configs/webpack.prod.non-minified.js",

            "build:prod:legacy": "webpack --config node_modules/project-base/configs/webpack.prod.legacy.js",
            "build:prod:legacy:min": "webpack --config node_modules/project-base/configs/webpack.prod.legacy.minified.js",
            "build:prod:legacy:non-min": "webpack --config node_modules/project-base/configs/webpack.prod.legacy.non-minified.js",

            "build:prod:esm": "webpack --config node_modules/project-base/configs/webpack.prod.esm.js",
            "build:prod:esm:min": "webpack --config node_modules/project-base/configs/webpack.prod.esm.minified.js",
            "build:prod:esm:non-min": "webpack --config node_modules/project-base/configs/webpack.prod.esm.non-minified.js",

            "build:prod:wc": "webpack --config node_modules/project-base/configs/webpack.prod.wc.js",
            "build:prod:wc:min": "webpack --config node_modules/project-base/configs/webpack.prod.wc.minified.js",
            "build:prod:wc:non-min": "webpack --config node_modules/project-base/configs/webpack.prod.wc.non-minified.js",

            "build:prod:wc:legacy": "webpack --config node_modules/project-base/configs/webpack.prod.wc.legacy.js",
            "build:prod:wc:legacy:min": "webpack --config node_modules/project-base/configs/webpack.prod.wc.legacy.minified.js",
            "build:prod:wc:legacy:non-min": "webpack --config node_modules/project-base/configs/webpack.prod.wc.legacy.non-minified.js",

            "build:apiDocs": "jsdoc -c node_modules/project-base/configs/jsdoc.conf.json",

            "dist": "npm run build:prod:min&&npm run build:prod:legacy:min&&npm run build:prod:esm:min",

            "setup:dev": "node node_modules/project-base/scripts/create-dev",

            "test": "tape -r esm test/**/*.js",

            "lint": "eslint src/**/*.js",
            "lint:fix": "eslint src/**/*.js --fix"
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





