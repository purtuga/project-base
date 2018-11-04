# v2.0.0 - todo

- [x] Upgrade to webpack 4.x, including webpack plugins
- [x] Move Uglify plugin to `optimization.minimise`
- [x] Add webpack configuration to output .mjs (ESM)
- [x] Refactor webpack configurations to be able to drive build based on env vars or a config name
    - [x] test first: will cli arg still override provided config? (result: ok)
    - [x] Create new webpack.config.js with function interface.
    - (DEFERRED) Move all webpack configs to a folder named 'webpack'
    - [x] Support --env.build=<value> for all available configs 
- [x] Webpack Prod (ES6) bundle name should have `umd` in the file name
- [x] Webpack configs stats output should have outfile name in them
- [ ] Introduce support for configuration via package.json `project-base`
    - [X] Option to wrap bundle with WC loader
        - [ ] On second thought: remove this. There are specific webpack configs that should be used
- [x] Introduce eslint
    - [x] Add support to webpack Rules
    - [x] Add support to package scripts to run standalone
- [x] Add new package script to run eslint with adn without --fix
- [x] Babel: add support for Class properties
- [ ] Introduce prettier (??)
- [ ] Introduce project-base-init script: initialize a new project (maybe a yo generator?)
- [x] Change eslint to auto-include config in /config/eslint.config.js
- [x] BUG: ESM build is missing BUILD.DATA definitions set by webpack.dev
- [ ] Create script from where all tooling should be used (to avoid installs where tools might not be avialable in hosting project)
    script would be something like `project-base <command> [options]`
- [x] Babel: enable ES7 async/await
- [ ] Webpack: enable static serving of files under the project

### Babel 7 Upgrade

- [x] Upgrade library
- [x] Upgrade plugins
- [x] Remove class builtin-classes transformations work-around