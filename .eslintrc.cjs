'use strict'

module.exports = {
  extends: ['@cto.af/eslint-config/modules', '@cto.af/eslint-config/jsdoc'],
  globals: {
    BigInt: false,
    globalThis: false,
  },
  ignorePatterns: [
    'node_modules/',
    'docs/',
  ],
  rules: {
    'no-unused-expressions': 'off',
  },
}
