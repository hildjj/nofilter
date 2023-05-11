/* eslint-env node, mocha */
'use strict'

import NoFilter from '../lib/index.js'
import {expect} from 'chai'
import {Buffer} from 'buffer'

describe('When streaming', () => {
  it('listens for pipe events', () => {
    const nf1 = new NoFilter({
      objectMode: true,
    })
    const nf2 = new NoFilter({
      objectMode: false,
    })

    nf1.pipe(nf2)
    return expect(nf2._readableState.objectMode).true
  })

  it('does not have to listen for pipe events', () => {
    const nf1 = new NoFilter({
      objectMode: true,
    })
    const nf2 = new NoFilter({
      objectMode: false,
      watchPipe: false,
    })

    nf1.pipe(nf2)
    return expect(nf2._readableState.objectMode).false
  })

  it('does not allow piping after writing', () => {
    const nf1 = new NoFilter({
      objectMode: true,
    })
    const nf2 = new NoFilter({
      objectMode: false,
    })
    nf2.write('123')
    return expect(() => nf1.pipe(nf2)).to.throw(Error)
  })

  it('can generate a promise', () => {
    const nf = new NoFilter()
    const p = nf.promise()
      .then(val => expect(val).eql(Buffer.from('123')))
    nf.end('123')
    return p
  })

  it('can generate a rejected promise', () => {
    const nf = new NoFilter()
    const p = nf.promise()
      .then(v => expect.fail('should not execute'))
      .catch(er => {
        expect(er).instanceof(Error)
      })

    nf.emit('error', new Error('Test error'))
    nf.end()
    return p
  })

  it('can generate a promise and a callback', () => {
    const nf = new NoFilter()
    const p = nf.promise((er, val) => {
      expect(er).null
      expect(val).eql(Buffer.from('123'))
    })
    nf.end('123')
    return p
  })

  return it('can generate a rejected promise and a callback', () => {
    const nf = new NoFilter()
    const p = nf.promise((er, val) => {
      expect(er).instanceof(Error)
      expect(val).is.undefined
    })

    nf.emit('error', new Error('Test error'))
    nf.end()
    return p.then(v => expect.fail(), er => expect(er).instanceof(Error))
  })
})
