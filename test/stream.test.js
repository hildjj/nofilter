/* eslint-env node, mocha */

import {Buffer} from 'buffer';
import {NoFilter} from '../lib/index.js';
import {expect} from 'chai';

describe('When streaming', () => {
  it('listens for pipe events', () => {
    const nf1 = new NoFilter({
      objectMode: true,
    });
    const nf2 = new NoFilter({
      objectMode: false,
    });

    nf1.pipe(nf2);
    return expect(nf2._readableState.objectMode).true;
  });

  it('does not have to listen for pipe events', () => {
    const nf1 = new NoFilter({
      objectMode: true,
    });
    const nf2 = new NoFilter({
      objectMode: false,
      watchPipe: false,
    });

    nf1.pipe(nf2);
    return expect(nf2._readableState.objectMode).false;
  });

  it('does not allow piping after writing', () => {
    const nf1 = new NoFilter({
      objectMode: true,
    });
    const nf2 = new NoFilter({
      objectMode: false,
    });
    nf2.write('123');
    return expect(() => nf1.pipe(nf2)).to.throw(Error);
  });

  it('can generate a promise', () => {
    const nf = new NoFilter();
    const p = nf.promise()
      .then(val => expect(val).eql(Buffer.from('123')));
    nf.end('123');
    return p;
  });

  it('can generate a rejected promise', () => {
    const nf = new NoFilter();
    const p = nf.promise()
      .then(_v => expect.fail('should not execute'))
      .catch(er => {
        expect(er).instanceof(Error);
      });

    nf.emit('error', new Error('Test error'));
    nf.end();
    return p;
  });

  it('can generate a promise and a callback', () => {
    const nf = new NoFilter();
    const p = nf.promise((er, val) => {
      expect(er).null;
      expect(val).eql(Buffer.from('123'));
    });
    nf.end('123');
    return p;
  });

  it('can generate a rejected promise and a callback', () => {
    const nf = new NoFilter();
    const p = nf.promise((er, val) => {
      expect(er).instanceof(Error);
      expect(val).is.undefined;
    });

    nf.emit('error', new Error('Test error'));
    nf.end();
    return p.then(_v => expect.fail(), er => expect(er).instanceof(Error));
  });

  it('handles AbortSignals', async () => {
    const ac = new AbortController();
    const nf = new NoFilter('foo', {signal: ac.signal});
    ac.abort();
    await expect(nf.readFull(3)).to.eventually.be.rejectedWith('This operation was aborted');

    const ac2 = new AbortController();
    const nf2 = new NoFilter({signal: ac2.signal});
    const p = expect(nf2.readFull(3)).to.eventually.be.rejectedWith('This operation was aborted');
    ac2.abort();
    await p;
  });

  it('handles reads larger than highWaterMark', async () => {
    const nf = new NoFilter({highWaterMark: 1024});
    const p = nf.waitFor(2048);
    nf.write(Buffer.alloc(1024));
    nf.write(Buffer.alloc(1024));
    await p;
    const b = nf.read(2048);
    expect(b.length).eq(2048);
    expect(nf.offset).eq(2048);

    const nf2 = new NoFilter({highWaterMark: 1024, bigReadError: true});
    expect(nf2.waitFor(2048)).to.eventually.be.rejectedWith('...');
  });
});
