/* eslint-env node, mocha */
'use strict'
const NoFilter = require('../')
const { expect } = require('chai')
const util = require('util')
const path = require('path')

async function requireWithFailedDependency(source, dependency, fn) {
  const src = require.resolve(source)
  const dep = require.resolve(dependency)
  const old_src = require.cache[src]
  const old_dep = require.cache[dep]
  require.cache[dep] = {
    loaded: true,
    get exports() {
      // see @node/lib/internal/modules/cjs/loader.js#tryPackage()
      const err = new Error(
        `Cannot find module '${dep}'. ` +
        'Please verify that the package.json has a valid "main" entry'
      )
      err.code = 'MODULE_NOT_FOUND'
      err.path = path.resolve(dependency, 'package.json')
      err.requestPath = __filename
    }
  }
  delete require.cache[src]
  await fn(require(source))
  require.cache[src] = old_src
  require.cache[dep] = old_dep
}

describe('When in object mode', () => {
  it('can be created', () => {
    const n = new NoFilter({
      objectMode: true
    })
    expect(n._readableState.objectMode).to.be.true
    expect(n._writableState.objectMode).to.be.true
  })

  it('allows object writes', () => {
    const n = new NoFilter({
      objectMode: true})
    n.write({
      a: 1
    })
    expect(n.slice()).eql([
      {a: 1}
    ])
    n.write({
      b: 2
    })
    expect(n.slice()).eql([
      {a: 1},
      {b: 2}
    ])
    expect(n.slice(0, 1)).eql([
      {a: 1}
    ])
  })

  it('is transparent for toJSON', () => {
    const n = new NoFilter({
      objectMode: true
    })
    n.write({
      a: 1})
    expect(n.toJSON()).eql([
      {a: 1}
    ])
  })

  it('does not fail reading integers', () => {
    const n = new NoFilter({
      objectMode: true})
    n.write({
      a: 1
    })
    expect(n.readUInt8()).equals(null)
  })

  it('can concat streams', () => {
    const n = Array.from(new Array(5), (v, k) => {
      const nf = new NoFilter({
        objectMode: true
      })
      nf.write({a: k})
      nf.write([k])
      return nf
    })
    expect(NoFilter.concat(n)).eql([
      {a: 0},
      [0],
      {a: 1},
      [1],
      {a: 2},
      [2],
      {a: 3},
      [3],
      {a: 4},
      [4]
    ])
    expect(NoFilter.concat(n, 2)).eql([
      {a: 0},
      [0]
    ])
  })

  it('supports inspect', async() => {
    const n = new NoFilter({
      objectMode: true})
    n.write(1)
    n.write({
      a: 1
    })
    expect(util.inspect(n)).equals('NoFilter [1, { a: 1 }]')
    await requireWithFailedDependency('../', 'util', (nof) => {
      const n = new nof({
        objectMode: true
      })
      n.write(1)
      n.write({
        a: 1
      })
      expect(util.inspect(n)).equals('NoFilter [1, [object Object]]')
    })
  })

  it ('supports toString', () => {
    const n = new NoFilter({
      objectMode: true})
    n.write(1)
    expect(n.toString()).equals('[1]')
  })
})
