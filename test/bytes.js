/* eslint-env node, mocha */
'use strict'
const NoFilter = require('../')
const { expect } = require('chai')
const util = require('util')

describe('When not in object mode', () => {
  it('can be created with no params', () => {
    const n = new NoFilter
    expect(n).is.not.null
    expect(n).to.be.an.instanceof(NoFilter)
    expect(NoFilter.isNoFilter(n)).true
    return expect(n.length).to.equal(0)
  })

  it('can be created with a string', () => {
    const n = new NoFilter('foo')
    return expect(n.length).eql(3)
  })

  it('can be created with a string and encoding', () => {
    const n = new NoFilter('Zm9v', 'base64')
    expect(n.length).eql(3)
    return expect(n.toString()).eql('foo')
  })

  it('can be created with a buffer and options', () => {
    let n = new NoFilter(Buffer.from('010203', 'hex'))
    expect(n.toString('hex')).eql('010203')

    n = new NoFilter(Buffer.from('010203', 'hex'), { objectMode: false })
    expect(n.length).eql(3)
    return expect(n.toString('hex')).eql('010203')
  })

  it('can be created with options', () => {
    let n = new NoFilter({
      input: 'Zm9v',
      inputEncoding: 'base64'
    })
    expect(n.length).eql(3)
    expect(n.toString()).eql('foo')

    n = new NoFilter('Zm9v', { inputEncoding: 'base64' })
    expect(n.length).eql(3)
    expect(n.toString()).eql('foo')

    n = new NoFilter('Zm9v', 'base64',
      {objectMode: false})
    expect(n.length).eql(3)
    return expect(n.toString()).eql('foo')
  })

  it('can be passed null', () => {
    const n = new NoFilter(null)
    return expect(n.length).eql(0)
  })

  it('does delayed decodes', () => {
    const n = new NoFilter({
      decodeStrings: false,
      defaultEncoding: 'hex'
    })
    n.end('010203')
    return expect(n.slice(0, 2)).eql(Buffer.from([1, 2]))
  })

  it('looks like a buffer with toJSON', () => {
    const n = new NoFilter('010203', 'hex')
    const b = Buffer.from('010203', 'hex')
    return expect(n.toJSON()).eql(b.toJSON())
  })

  it('looks like a buffer with toString', () => {
    const n = new NoFilter('010203', 'hex')
    const b = Buffer.from('010203', 'hex')
    expect(n.toString()).eql(b.toString())
    return expect(n.toString('hex')).eql(b.toString('hex'))
  })

  it('does integer read/writes', () => {
    const n = new NoFilter
    n.writeUInt8(255)
    expect(n.toString('hex')).equals('ff')
    expect(n.readUInt8()).equals(255)
    n.writeInt32BE(0x01020304)
    return expect(n.toString('hex')).equals('01020304')
  })

  it('does biginteger read/writes', () => {
    if (typeof BigInt === 'function') {
      const n = new NoFilter
      // don't use 1n syntax, for backward-compatibility
      n.writeBigInt(BigInt('17123812398091231231231'))
      expect(n.toString('hex')).equals('03a048a28a37b1b6fcff')
      expect(n.readBigInt()).equals(BigInt('17123812398091231231231'))

      n.writeBigInt(BigInt('171238123980912312312310'))
      expect(n.toString('hex')).equals('2442d659662cf125e1f6')
      expect(n.readBigInt()).equals(BigInt('171238123980912312312310'))

      n.writeBigInt(BigInt('-1234567890'))
      expect(n.toString('hex')).equals('b669fd2e')
      expect(n.readBigInt()).equals(BigInt('-1234567890'))

      n.writeBigInt(BigInt('-1234567890'))
      expect(n.readUBigInt()).equals(BigInt('3060399406'))

      expect(n.readUBigInt()).null
      expect(n.readBigInt()).null
    }
  })

  it('supports inspect', () => {
    const n = new NoFilter
    n.write('01', 'hex')
    n.write(Buffer.from([2]))
    expect(util.inspect(n)).equals('NoFilter [01, 02]')
    return expect(n.inspect()).equals('NoFilter [01, 02]')
  })

  it('supports compare', () => {
    const nf1 = new NoFilter('1')
    const nf2 = new NoFilter('2')
    const nf3 = new NoFilter({ objectMode: true })
    expect(nf1.compare(nf2)).equal(-1)
    expect(nf1.compare(nf1)).equal(0)
    expect(nf1.equals(nf2)).equal(false)
    expect(() => nf1.compare(nf3)).to.throw(Error)
    return expect(() => nf3.compare(nf1)).to.throw(Error)
  })

  it('slices', () => {
    const nf1 = new NoFilter()
    expect(nf1.slice()).eql(Buffer.alloc(0))
    nf1.write('1')
    nf1.write('2')
    nf1.write('3')
    expect(nf1.slice()).eql(Buffer.from('123'))
    return expect(nf1.get(0)).equal('1'.charCodeAt(0))
  })

  return it('emits a read event', (cb) => {
    const nf = new NoFilter('010203', 'hex')
    nf.on('read', (buf) => {
      expect(buf).eql(Buffer.from([1, 2]))
      return cb()
    })

    return expect(nf.read(2)).eql(Buffer.from([1, 2]))
  })
})

describe('Underflow', () => {
  it('When readError is false', () => {
    const nf = new NoFilter('010203', 'hex', { readError: false })
    expect(nf.read(4)).to.have.lengthOf(3)
    expect(nf.read(4)).to.be.null
  })
  it('When readError is true', () => {
    const nf = new NoFilter('010203', 'hex', { readError: true })
    expect(() => nf.readUInt32BE()).to.throw(Error)
    expect(() => nf.readUInt32BE()).to.throw(Error)
  })
})
