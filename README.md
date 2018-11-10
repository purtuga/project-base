# project-base
The project-base setup for most of my projects, including reusable scripts for common activities.

## Install

-   Add `project-base` to project 
```bash
$ npm install purtuga/project-base#release/version-here
```

## Usage

### Builds

-   Add project-base npm scripts to `package.json`
```bash
$ ./node_modules/.bin/project-base-setup-package-scripts
```

This will add several entries to `package.json` `scripts` section. They include all of the available build types and by default, `dist` is defined to generate a ESM bundle as well as Legacy bundle - minified versions only (with source maps). 

Here are a list of available builds:

-   `build` : Builds the development version. Almost no code transformations are done.
-   `build:ie` : Builds a version of the software and saves it to `my.dev/` folder, for when testing in IE is needed.
-   `build:prod` : Builds the Production ES6 versions of the project, which include a non-minified bundle as well as a minified bundle (with source maps). Meant to be consumed by modern runtimes. Bundles are wrapped with UMD loader code.
-   `build:prod:min` : Build the production ES6 version of the project minified only (with source map). Meant to be consumed by modern runtimes. Bundles are wrapped with UMD loader code. 
-   `build:prod:non-min` : Build the production ES6 version of the project non-minfied only (with source map).Meant to be consumed by modern runtimes. Note that only comments that start with `// ++` are kept in the file. Bundles are wrapped with UMD loader code.
-   `build:prod:legacy` : Builds production ES5 (transpiled) versions of the project - both regular and minified versions.
-   `build:prod:legacy:min` : Builds production ES5 (transpiled) verison of the project minified version.
-   `build:prod:legacy:non-min` : Builds production ES5 (transpiled) verison of the project minified version. 
-   `build:prod:esm` : Build an ESM version of the project. Generates both regular and minified bundles along with source maps
-   `build:prod:esm:min` :  Build a Minified ESM version of the project (with source map)
-   `build:prod:esm:non-min` :  Build a non-Minified ESM version of the project (with source map)
-   `build:prod:wc` : Same as `build:prod:min`, but wraps the bundle with code that ensure runtime supports Web Components. Best to be used with Web Components that auto-register themselves in CustomElementsRegistry. By default, it assumes an entry file of `src/import.js`.
-   `build:prod:wc:min` : Same as `build:prod:min`, but wraps the bundle with code that ensure runtime supports Web Components. Best to be used with Web Components that auto-register themselves in CustomElementsRegistry.
-   `build:prod:wc:non-min` : Same as `build:prod:non-min`, but wraps the bundle with code that ensure runtime supports Web Components. Best to be used with Web Components that auto-register themselves in CustomElementsRegistry.
-   `build:apiDocs` : Generates JSDOCs from all files under `src/` folder.


Other things that should be added to package.json:

- If working on a nodeJS CLI project that needs esm support: 
```json
{
    "esm": { "mode": "auto" }
}
```

#### Build Info. Available for Project Runtime

The following is available for use in Project code:

    BUILD.DATA = {
        VERSION,
        AUTHOR,
        LICENSE,
        NAME,
        TIMESTAMP,
        HASH
    }

In a JS file, the above can be used like this:

```javascript
export const VERSION = BUILD.DATA.VERSION; // eslint-disable-line
```

#### Conditional code Based on Production/Development mode

`process.env.NODE_ENV` can be used to include dev-only (or production only) code blocks through out a code base.

```javascript
if (process.env.NODE_ENV !== "production") {
    console.warn("you are in dev mode!!!!");
}
```

#### JS Comments

By default, all builds strip out all comments from files, with the exception of those starting with `++`.
Examples of comments that would be kept:
```javascript
//++ keep me

//   ++ keep me

/*++ keep me */

/*   ++ keep me  */

```


#### Importing CSS files as Strings

tbd....
    

## Configuration

Configuration is done via the `project-base` entry in `package.json`. The following are supported:

```json5
{
    "project-base": {
        "decorators-legacy": false  // Switch decorators and class props babel plugin to legacy mode
    }
}
```


## Branches

### Master

Bleeding edge... Everything happens here first and then tagged into a version at stable points... It could break existing projects that reference it.

### vX.Y.Z

Stable version... Project (for the most part) should reference these. When a version becomes "old", warnings will be added and seen during builds.



## Transition / Migration

### To v2.x

-   Default output is now ES6 code. ES5 transpiled code is output as a file named `*.legacy.*`
-   All code will now be Linted using eslint and default config

