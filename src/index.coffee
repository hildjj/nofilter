stream = require 'stream'
util = require 'util'

# Stupid stream.
# @property [Number] length the number of bytes to read
module.exports = class Stupid extends stream.Transform
  constructor: (input, inputEncoding, options = {}) ->
    inp = undefined
    inpE = undefined
    switch typeof(input)
      when 'object'
        if Buffer.isBuffer(input)
          inp = input
          if inputEncoding? and (typeof(inputEncoding) == 'object')
            options = inputEncoding
        else
          options = input
          inp = options?.input

      when 'string'
        inp = input
        if inputEncoding? and (typeof(inputEncoding) == 'object')
          options = inputEncoding
        else
          inpE = inputEncoding

    inpE ?= options.inputEncoding
    delete options.input
    delete options.inputEncoding
    if options.objectMode?
      options.readableObjectMode = options.objectMode
      options.writableObjectMode = options.objectMode
      delete options.objectMode

    super(options)

    # when the write side ends, finish the read side
    @once 'prefinish', =>
      @push null

    if inp?
      @end inp, inpE

  # @nodoc
  _transform: (chunk, encoding, callback) ->
    if !@_readableState.objectMode and !Buffer.isBuffer(chunk)
      chunk = new Buffer chunk, encoding
    @push chunk
    callback()

  # @nodoc
  _flush: (cb) ->
    cb()

  # Non-destructively read bytes.  Useful for diagnostics.
  # @param size [Number] Number of bytes to read.  If not specified, peek
  #   at full contents.
  peek: (size) ->
    if sz? and (sz > 0)
      sz = Math.min @_readableState.length, sz
    else
      sz = @_readableState.length

    Buffer.concat @_readableState.buffer, sz

  toJSON: ->
    b = @peek()
    if Buffer.isBuffer(b)
      b.toJSON()
    else
      b

  toString: (encoding, start, end) ->
    b = @peek()
    if !b?
      "null"
    else
      b.toString(encoding, start, end)

  # @nodoc
  inspect: (depth, options) ->
    hex = @_readableState.buffer.map (b) ->
      if Buffer.isBuffer(b)
        options.stylize b.toString('hex'), 'string'
      else
        util.inspect(b, options)
    .join ', '
    "#{@constructor.name} [#{hex}]"

  # @nodoc
  _read_gen = (meth, len) ->
    (val) ->
      b = @read len
      if !Buffer.isBuffer(b)
        return null
      b[meth].call b, 0, true

  # @nodoc
  _write_gen = (meth, len) ->
    (val) ->
      b = new Buffer len
      b[meth].call b, val, 0, true
      @push b

  # unsigned
  writeUInt8:    _write_gen 'writeUInt8',    1
  writeUInt16LE: _write_gen 'writeUInt16LE', 2
  writeUInt16BE: _write_gen 'writeUInt16BE', 2
  writeUInt32LE: _write_gen 'writeUInt32LE', 4
  writeUInt32BE: _write_gen 'writeUInt32BE', 4

  # signed
  writeInt8:     _write_gen 'writeInt8',     1
  writeInt16LE:  _write_gen 'writeInt16LE',  2
  writeInt16BE:  _write_gen 'writeInt16BE',  2
  writeInt32LE:  _write_gen 'writeInt32LE',  4
  writeInt32BE:  _write_gen 'writeInt32BE',  4

  # float
  writeFloatLE:  _write_gen 'writeFloatLE',  4
  writeFloatBE:  _write_gen 'writeFloatBE',  4
  writeDoubleLE: _write_gen 'writeDoubleLE', 8
  writeDoubleBE: _write_gen 'writeDoubleBE', 8

  # unsigned
  readUInt8:    _read_gen 'readUInt8',    1
  readUInt16LE: _read_gen 'readUInt16LE', 2
  readUInt16BE: _read_gen 'readUInt16BE', 2
  readUInt32LE: _read_gen 'readUInt32LE', 4
  readUInt32BE: _read_gen 'readUInt32BE', 4

  # signed
  readInt8:     _read_gen 'readInt8',     1
  readInt16LE:  _read_gen 'readInt16LE',  2
  readInt16BE:  _read_gen 'readInt16BE',  2
  readInt32LE:  _read_gen 'readInt32LE',  4
  readInt32BE:  _read_gen 'readInt32BE',  4

  # float
  readFloatLE:  _read_gen 'readFloatLE',  4
  readFloatBE:  _read_gen 'readFloatBE',  4
  readDoubleLE: _read_gen 'readDoubleLE', 8
  readDoubleBE: _read_gen 'readDoubleBE', 8

  # @nodoc
  get = (props) ->
    Stupid::__defineGetter__(name, getter) for name, getter of props

  # @property [Number] The number of bytes currently available to read
  get length: -> @_readableState.length
