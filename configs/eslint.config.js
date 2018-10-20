//-----------------------------------------------------------------------------------------
// This is the Base configuration used by the Webpack setup.
//
// For more on eslint configuration, see:
// https://eslint.org/docs/user-guide/configuring
//
// If wanting to disable rules for certain files, see:
// https://eslint.org/docs/user-guide/configuring#disabling-rules-only-for-a-group-of-files
//
// or use an ignore files:
// https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories
//-----------------------------------------------------------------------------------------
module.exports = {
    "extends": [
        "eslint:recommended"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "plugins": [],
    "rules": {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "comma-dangle": ["error", "never"],
        "func-call-spacing": ["error", "never"],
        "no-trailing-spaces": "error"
    }
};