# v2.0.0 - todo

- [x] Upgrade to webpack 4.x, including webpack plugins
- [x] Move Uglify plugin to `optimization.minimise`
- [x] Add webpack configuration to output .mjs (ESM)
- [ ] Introduce support for configuration via package.json `project-base`
    - [X] Option to wrap bundle with WC loader
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