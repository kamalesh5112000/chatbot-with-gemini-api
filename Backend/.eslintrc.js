const globals = require('globals');
const pluginJs = require('@eslint/js');

module.exports = {
  env: {
    es6: true,
    node: true,
    commonjs: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
  },
};
