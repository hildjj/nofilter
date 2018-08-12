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
    return expect(n._writableState.objectMode).to.be.true
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
    return expect(n.slice(0, 1)).eql([
      {a: 1}
    ])
  })

  it('is transparent for toJSON', () => {
    const n = new NoFilter({
      objectMode: true
    })
    n.write({
      a: 1})
    return expect(n.toJSON()).eql([
      {a: 1}
    ])
  })

  it('does not fail reading integers', () => {
    const n = new NoFilter({
      objectMode: true})
    n.write({
      a: 1
    })
    return expect(n.readUInt8()).equals(null)
  })

  return it('supports inspect', () => {
    const n = new NoFilter({
      objectMode: true})
    n.write(1)
    n.write({
      a: 1
    })
    return expect(util.inspect(n)).equals('NoFilter [1, { a: 1 }]')
  })
})
