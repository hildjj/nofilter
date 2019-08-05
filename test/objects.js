/* eslint-env node, mocha */
'use strict'
const NoFilter = require('../')
const { expect } = require('chai')
const util = require('util')

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

  it('supports inspect', () => {
    const n = new NoFilter({
      objectMode: true})
    n.write(1)
    n.write({
      a: 1
    })
    expect(util.inspect(n)).equals('NoFilter [1, { a: 1 }]')
  })

  it ('supports toString', () => {
    const n = new NoFilter({
      objectMode: true})
    n.write(1)
    expect(n.toString()).equals('[1]')
  })
})
