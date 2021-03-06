'use strict'

module.exports = {
  extends: '@cto.af',
  globals: {
    BigInt: false,
    globalThis: false
  },
  plugins: [
    'chai-friendly'
  ],
  rules: {
    'no-unused-expressions': 'off',
    'chai-friendly/no-unused-expressions': 'error'
  }
}
