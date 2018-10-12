# v2.0.0 - todo

- [x] Upgrade to webpack 4.x, including webpack plugins
- [x] Move Uglify plugin to `optimization.minimise`
- [x] Add webpack configuration to output .mjs (ESM)
- [ ] Refactor webpack configurations to be able to drive build based on env vars or a config name
    - [x] test first: will cli arg still override provided config? (result: ok)
    - [x] Create new webpack.config.js with function interface.
    - [] Move all webpack configs to a folder named 'webpack'
    - [x] Support --env.build=<value> for all available configs 
- [x] Webpack Prod (ES6) bundle name should have `umd` in the file name
- [ ] Webpack configs stats output should have outfile name in them
- [ ] Introduce support for configuration via package.json `project-base`
    - [X] Option to wrap bundle with WC loader
        - [ ] On second thought: remove this. There are specific webpack configs that should be used
    - [ ] Option to set build to NOT expose globals (app mode)
- [x] Introduce eslint
    - [x] Add support to webpack Rules
    - [x] Add support to package scripts to run standalone
- [x] Add new package script to run eslint with adn without --fix
- [ ] Babel: add support for Class properties
- [ ] Introduce prettier (??)
- [ ] Introduce project-base-init script: initialize a new project (maybe a yo generator?)
- [ ] Change eslint to auto-include config in /config/eslint.config.js
- [x] BUG: ESM build is missing BUILD.DATA definitions set by webpack.dev


### Babel 7 Upgrade

- [ ] Upgrade library
- [ ] Upgrade plugins
- [ ] Remove class builtin-classes transformations work-around