'use strict'

module.exports = {
  extends: ['@cto.af', 'plugin:markdown/recommended'],
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
    'jsdoc/no-undefined-types': ['error', {
      definedTypes: [
        'BufferEncoding',
      ],
    }],
  },
}
