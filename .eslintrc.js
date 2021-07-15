'use strict'

module.exports = {
  extends: '@cto.af',
  globals: {
    BigInt: false,
    globalThis: false
  },
  ignorePatterns: [
    'node_modules/',
    'docs/'
  ],
  rules: {
    'no-unused-expressions': 'off'
  }
}
