import base from '@cto.af/eslint-config';
import jsdoc_ts from '@cto.af/eslint-config/jsdoc_ts.js';
import markdown from '@cto.af/eslint-config/markdown.js';
import mocha from '@cto.af/eslint-config/mocha.js';
import mod from '@cto.af/eslint-config/module.js';
import pluginChaiFriendly from 'eslint-plugin-chai-friendly';
import ts from '@cto.af/eslint-config/ts.js';

export default [
  {
    ignores: [
      'types/**',
      'docs/**',
      'node_modules/**',
    ],
  },
  ...base,
  ...mod,
  ...ts,
  ...jsdoc_ts,
  ...markdown,
  ...mocha,
  {
    rules: {
      'n/prefer-node-protocol': 'off',
    },
  },
  {
    files: [
      'test/*.test.js',
    ],
    plugins: {
      'chai-friendly': pluginChaiFriendly,
    },
    rules: {
      'no-unused-expressions': 'off', // Disable original rule
      'chai-friendly/no-unused-expressions': 'error',
    },
  },
];
