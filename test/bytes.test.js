/* eslint-disable mocha/max-top-level-suites */

import * as chai from 'chai';
import {Buffer} from 'buffer';
import {NoFilter} from '../lib/index.js';
import chaiAsPromised from 'chai-as-promised';
import {pEvent} from 'p-event';
import util from 'util';

chai.use(chaiAsPromised);
const {expect} = chai;

describe('When not in object mode', () => {
  it('can be created with no params', () => {
    const n = new NoFilter();
    expect(n).is.not.null;
    expect(n).to.be.an.instanceof(NoFilter);
    expect(NoFilter.isNoFilter(n)).true;
    return expect(n.length).to.equal(0);
  });

  it('can be created with a string', () => {
    const n = new NoFilter('foo');
    return expect(n.length).eql(3);
  });

  it('can be created with a string and encoding', () => {
    const n = new NoFilter('Zm9v', 'base64');
    expect(n.length).eql(3);
    return expect(n.toString()).eql('foo');
  });

  it('can be created with a buffer and options', () => {
    let n = new NoFilter(Buffer.from('010203', 'hex'));
    expect(n.toString('hex')).eql('010203');

    n = new NoFilter(Buffer.from('010203', 'hex'), {objectMode: false});
    expect(n.length).eql(3);
    return expect(n.toString('hex')).eql('010203');
  });

  it('can be created with options', () => {
    let n = new NoFilter({
      input: 'Zm9v',
      inputEncoding: 'base64',
    });
    expect(n.length).eql(3);
    expect(n.toString()).eql('foo');

    n = new NoFilter('Zm9v', {inputEncoding: 'base64'});
    expect(n.length).eql(3);
    expect(n.toString()).eql('foo');

    n = new NoFilter('Zm9v', 'base64', {objectMode: false});
    expect(n.length).eql(3);
    return expect(n.toString()).eql('foo');
  });

  it('can be passed null', () => {
    const n = new NoFilter(null);
    return expect(n.length).eql(0);
  });

  it('throws on invalid inputs', () => {
    expect(() => new NoFilter(1)).to.throw(TypeError);
    expect(() => new NoFilter(null, 1)).to.throw(TypeError);
    expect(() => new NoFilter(null, null, null)).to.throw(TypeError);
    expect(() => new NoFilter(null, null, 1)).to.throw(TypeError);
  });

  it('does delayed decodes', () => {
    const n = new NoFilter({
      decodeStrings: false,
      defaultEncoding: 'hex',
    });
    n.end('010203');
    return expect(n.slice(0, 2)).eql(Buffer.from([1, 2]));
  });

  it('looks like a buffer with toJSON', () => {
    const n = new NoFilter('010203', 'hex');
    const b = Buffer.from('010203', 'hex');
    return expect(n.toJSON()).eql(b.toJSON());
  });

  it('looks like a buffer with toString', () => {
    const n = new NoFilter('010203', 'hex');
    const b = Buffer.from('010203', 'hex');
    expect(n.toString()).eql(b.toString());
    expect(n.toString('hex')).eql(b.toString('hex'));
  });

  it('does integer read/writes', () => {
    const n = new NoFilter();
    n.writeUInt8(255);
    expect(n.toString('hex')).equals('ff');
    expect(n.readUInt8()).equals(255);
    n.writeInt8(-128);
    expect(n.readInt8()).equals(-128);

    n.writeUInt16LE(0x0102);
    expect(n.readUInt16LE()).equals(0x0102);
    n.writeUInt16BE(0x0102);
    expect(n.readUInt16BE()).equals(0x0102);
    n.writeInt16LE(0x0102);
    expect(n.readInt16LE()).equals(0x0102);
    n.writeInt16BE(0x0102);
    expect(n.readInt16BE()).equals(0x0102);

    n.writeUInt32LE(0x01020304);
    expect(n.readUInt32LE()).equals(0x01020304);
    n.writeUInt32BE(0x01020304);
    expect(n.readUInt32BE()).equals(0x01020304);
    n.writeInt32LE(0x01020304);
    expect(n.readInt32LE()).equals(0x01020304);
    n.writeInt32BE(0x01020304);
    expect(n.readInt32BE()).equals(0x01020304);

    n.writeFloatLE(-1.5);
    expect(n.readFloatLE()).equals(-1.5);
    n.writeFloatBE(-1.5);
    expect(n.readFloatBE()).equals(-1.5);

    n.writeDoubleLE(-1.5);
    expect(n.readDoubleLE()).equals(-1.5);
    n.writeDoubleBE(-1.5);
    expect(n.readDoubleBE()).equals(-1.5);

    n.writeBigInt64LE(-0x0102030405060708n);
    expect(n.readBigInt64LE()).equals(-0x0102030405060708n);
    n.writeBigInt64BE(0x0102030405060708n);
    expect(n.readBigInt64BE()).equals(0x0102030405060708n);

    n.writeBigUInt64LE(0x0102030405060708n);
    expect(n.readBigUInt64LE()).equals(0x0102030405060708n);
    n.writeBigUInt64BE(0x0102030405060708n);
    expect(n.readBigUInt64BE()).equals(0x0102030405060708n);

    expect(n.length).equals(0);
  });

  it('does biginteger read/writes', () => {
    if (typeof BigInt === 'function') {
      const n = new NoFilter();
      // Don't use 1n syntax, for backward-compatibility
      n.writeBigInt(BigInt('17123812398091231231231'));
      expect(n.toString('hex')).equals('03a048a28a37b1b6fcff');
      expect(n.readBigInt()).equals(BigInt('17123812398091231231231'));

      n.writeBigInt(BigInt('171238123980912312312310'));
      expect(n.toString('hex')).equals('2442d659662cf125e1f6');
      expect(n.readBigInt()).equals(BigInt('171238123980912312312310'));

      n.writeBigInt(BigInt('-1234567890'));
      expect(n.toString('hex')).equals('b669fd2e');
      expect(n.readBigInt()).equals(BigInt('-1234567890'));

      n.writeBigInt(BigInt('-1234567890'));
      expect(n.readUBigInt()).equals(BigInt('3060399406'));

      expect(n.readUBigInt()).null;
      expect(n.readBigInt()).null;
    }
  });

  it('supports inspect', () => {
    const n = new NoFilter();
    n.write('01', 'hex');
    n.write(Buffer.from([2]));
    expect(util.inspect(n)).equals('NoFilter [01, 02]');
  });

  it('supports compare', () => {
    const nf1 = new NoFilter('1');
    const nf2 = new NoFilter('2');
    const nf3 = new NoFilter({objectMode: true});
    expect(nf1.compare(nf2)).equal(-1);
    expect(nf1.compare(nf1)).equal(0);
    expect(nf1.equals(nf2)).equal(false);
    expect(() => nf1.compare(nf3)).to.throw(Error);
    expect(() => nf3.compare(nf1)).to.throw(Error);
  });

  it('slices', () => {
    const nf1 = new NoFilter();
    expect(nf1.slice()).eql(Buffer.alloc(0));
    nf1.write('1');
    nf1.write('2');
    nf1.write('3');
    expect(nf1.slice()).eql(Buffer.from('123'));
    return expect(nf1.get(0)).equal('1'.charCodeAt(0));
  });

  return it('emits a read event', cb => {
    const nf = new NoFilter('010203', 'hex');
    nf.on('read', buf => {
      expect(buf).eql(Buffer.from([1, 2]));
      return cb();
    });

    expect(nf.read(2)).eql(Buffer.from([1, 2]));
  });
});

describe('Underflow', () => {
  it('When readError is false', () => {
    const nf = new NoFilter('010203', 'hex', {readError: false});
    expect(nf.read(4)).to.have.lengthOf(3);
    expect(nf.read(4)).to.be.null;
  });

  it('When readError is true', () => {
    const nf = new NoFilter('010203', 'hex', {readError: true});
    expect(() => nf.readUInt32BE()).to.throw(Error);
    expect(() => nf.readUInt32BE()).to.throw(Error);
  });
});

describe('readFull', () => {
  it('Does not wait if ready', async() => {
    const nf = new NoFilter('010203', 'hex');
    expect(await nf.readFull(2)).eql(Buffer.from([1, 2]));
  });

  it('Waits if needed', async() => {
    const nf = new NoFilter();
    nf.write(Buffer.from([1, 2, 3]));
    process.nextTick(() => nf.write(Buffer.from([4, 5])));
    expect(await nf.readFull(4)).eql(Buffer.from([1, 2, 3, 4]));
  });

  it('Detects EOF', async() => {
    const nf = new NoFilter('');
    await pEvent(nf, 'finish'); // Finish is async, even here
    await expect(nf.readFull(4)).to.eventually.be.rejectedWith(
      'Stream finished before 4 bytes were available'
    );

    const nf2 = new NoFilter(''); // Don't wait
    await expect(nf2.readFull(4)).to.eventually.be.rejectedWith(
      'Stream finished before 4 bytes were available'
    );
  });
});
