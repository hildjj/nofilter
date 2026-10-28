'use strict';

/** @import * as typedoc from 'typedoc'; */
/** @type {typedoc.TypeDocOptions} */
module.exports = {
  entryPoints: ['lib/index.js'],
  out: 'docs',
  cleanOutputDir: true,
  sidebarLinks: {
    GitHub: 'https://github.com/hildjj/nofilter/',
    Documentation: 'http://hildjj.github.io/nofilter/',
  },
  navigation: {
    includeCategories: false,
    includeGroups: false,
  },
  includeVersion: true,
  categorizeByGroup: false,
  sort: ['static-first', 'alphabetical'],
  exclude: ['**/*.spec.ts'],
  externalSymbolLinkMappings: {
    '@types/node': {
      '*': '#',
    },
  },
};
