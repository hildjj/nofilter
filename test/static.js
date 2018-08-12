/* eslint-env node, mocha */
'use strict'

const NoFilter = require('../')
const { expect } = require('chai')
const util = require('util')

describe('Static methods', () => {
  it('can be compared', () => {
    const nf1 = new NoFilter('1')
    const nf2 = new NoFilter('2')
    expect(NoFilter.compare(nf1, nf1)).equal(0)
    expect(NoFilter.compare(nf1, new NoFilter('1'))).equal(0)
    expect(NoFilter.compare(nf1, nf2)).equal(-1)
    expect(NoFilter.compare(nf2, nf1)).equal(1)
    expect(() => NoFilter.compare(null, null)).to.throw(TypeError)
    return expect(() => NoFilter.compare(nf1, null)).to.throw(TypeError)
  })

  return it('can be concatenated', () => {
    const nf1 = new NoFilter('1')
    const nf2 = new NoFilter('2')
    const nf3 = new NoFilter({
      objectMode: true})
    expect(NoFilter.concat([nf1, nf2])).eql(Buffer.from('12'))
    expect(NoFilter.concat([])).eql(Buffer.alloc(0))
    expect(NoFilter.concat([nf1, nf2], 0)).eql(Buffer.alloc(0))
    expect(NoFilter.concat([nf1, nf2], 1)).eql(Buffer.from('1'))

    expect(() => NoFilter.concat('foo')).to.throw(TypeError)
    expect(() => NoFilter.concat([0]))
      .to.throw(TypeError)
    expect(() => NoFilter.concat([0], 1)).to.throw(TypeError)
    return expect(() => NoFilter.concat([nf1, nf2, nf3], 1)).to.throw(Error)
  })
})
