(function() {
  var Stupid, stream, util,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  stream = require('stream');

  util = require('util');

  module.exports = Stupid = (function(superClass) {
    var _read_gen, _write_gen, get;

    extend(Stupid, superClass);

    function Stupid(input, inputEncoding, options) {
      var inp, inpE;
      if (options == null) {
        options = {};
      }
      inp = void 0;
      inpE = void 0;
      switch (typeof input) {
        case 'object':
          if (Buffer.isBuffer(input)) {
            inp = input;
            if ((inputEncoding != null) && (typeof inputEncoding === 'object')) {
              options = inputEncoding;
            }
          } else {
            options = input;
            inp = options != null ? options.input : void 0;
          }
          break;
        case 'string':
          inp = input;
          if ((inputEncoding != null) && (typeof inputEncoding === 'object')) {
            options = inputEncoding;
          } else {
            inpE = inputEncoding;
          }
      }
      if (inpE == null) {
        inpE = options.inputEncoding;
      }
      delete options.input;
      delete options.inputEncoding;
      if (options.objectMode != null) {
        options.readableObjectMode = options.objectMode;
        options.writableObjectMode = options.objectMode;
        delete options.objectMode;
      }
      Stupid.__super__.constructor.call(this, options);
      this.once('prefinish', (function(_this) {
        return function() {
          return _this.push(null);
        };
      })(this));
      if (inp != null) {
        this.end(inp, inpE);
      }
    }

    Stupid.prototype._transform = function(chunk, encoding, callback) {
      if (!this._readableState.objectMode && !Buffer.isBuffer(chunk)) {
        chunk = new Buffer(chunk, encoding);
      }
      this.push(chunk);
      return callback();
    };

    Stupid.prototype._flush = function(cb) {
      return cb();
    };

    Stupid.prototype.peek = function(size) {
      var sz;
      if ((typeof sz !== "undefined" && sz !== null) && (sz > 0)) {
        sz = Math.min(this._readableState.length, sz);
      } else {
        sz = this._readableState.length;
      }
      return Buffer.concat(this._readableState.buffer, sz);
    };

    Stupid.prototype.toJSON = function() {
      var b;
      b = this.peek();
      if (Buffer.isBuffer(b)) {
        return b.toJSON();
      } else {
        return b;
      }
    };

    Stupid.prototype.toString = function(encoding, start, end) {
      var b;
      b = this.peek();
      if (b == null) {
        return "null";
      } else {
        return b.toString(encoding, start, end);
      }
    };

    Stupid.prototype.inspect = function(depth, options) {
      var hex;
      hex = this._readableState.buffer.map(function(b) {
        if (Buffer.isBuffer(b)) {
          return options.stylize(b.toString('hex'), 'string');
        } else {
          return util.inspect(b, options);
        }
      }).join(', ');
      return this.constructor.name + " [" + hex + "]";
    };

    _read_gen = function(meth, len) {
      return function(val) {
        var b;
        b = this.read(len);
        if (!Buffer.isBuffer(b)) {
          return null;
        }
        return b[meth].call(b, 0, true);
      };
    };

    _write_gen = function(meth, len) {
      return function(val) {
        var b;
        b = new Buffer(len);
        b[meth].call(b, val, 0, true);
        return this.push(b);
      };
    };

    Stupid.prototype.writeUInt8 = _write_gen('writeUInt8', 1);

    Stupid.prototype.writeUInt16LE = _write_gen('writeUInt16LE', 2);

    Stupid.prototype.writeUInt16BE = _write_gen('writeUInt16BE', 2);

    Stupid.prototype.writeUInt32LE = _write_gen('writeUInt32LE', 4);

    Stupid.prototype.writeUInt32BE = _write_gen('writeUInt32BE', 4);

    Stupid.prototype.writeInt8 = _write_gen('writeInt8', 1);

    Stupid.prototype.writeInt16LE = _write_gen('writeInt16LE', 2);

    Stupid.prototype.writeInt16BE = _write_gen('writeInt16BE', 2);

    Stupid.prototype.writeInt32LE = _write_gen('writeInt32LE', 4);

    Stupid.prototype.writeInt32BE = _write_gen('writeInt32BE', 4);

    Stupid.prototype.writeFloatLE = _write_gen('writeFloatLE', 4);

    Stupid.prototype.writeFloatBE = _write_gen('writeFloatBE', 4);

    Stupid.prototype.writeDoubleLE = _write_gen('writeDoubleLE', 8);

    Stupid.prototype.writeDoubleBE = _write_gen('writeDoubleBE', 8);

    Stupid.prototype.readUInt8 = _read_gen('readUInt8', 1);

    Stupid.prototype.readUInt16LE = _read_gen('readUInt16LE', 2);

    Stupid.prototype.readUInt16BE = _read_gen('readUInt16BE', 2);

    Stupid.prototype.readUInt32LE = _read_gen('readUInt32LE', 4);

    Stupid.prototype.readUInt32BE = _read_gen('readUInt32BE', 4);

    Stupid.prototype.readInt8 = _read_gen('readInt8', 1);

    Stupid.prototype.readInt16LE = _read_gen('readInt16LE', 2);

    Stupid.prototype.readInt16BE = _read_gen('readInt16BE', 2);

    Stupid.prototype.readInt32LE = _read_gen('readInt32LE', 4);

    Stupid.prototype.readInt32BE = _read_gen('readInt32BE', 4);

    Stupid.prototype.readFloatLE = _read_gen('readFloatLE', 4);

    Stupid.prototype.readFloatBE = _read_gen('readFloatBE', 4);

    Stupid.prototype.readDoubleLE = _read_gen('readDoubleLE', 8);

    Stupid.prototype.readDoubleBE = _read_gen('readDoubleBE', 8);

    get = function(props) {
      var getter, name, results;
      results = [];
      for (name in props) {
        getter = props[name];
        results.push(Stupid.prototype.__defineGetter__(name, getter));
      }
      return results;
    };

    get({
      length: function() {
        return this._readableState.length;
      }
    });

    return Stupid;

  })(stream.Transform);

}).call(this);

//# sourceMappingURL=data:application/json;base64,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U0FBQSxDQUFVLGNBQVYsRUFBMEIsQ0FBMUI7O3FCQUNkLFlBQUEsR0FBYyxTQUFBLENBQVUsY0FBVixFQUEwQixDQUExQjs7cUJBR2QsUUFBQSxHQUFjLFNBQUEsQ0FBVSxVQUFWLEVBQTBCLENBQTFCOztxQkFDZCxXQUFBLEdBQWMsU0FBQSxDQUFVLGFBQVYsRUFBMEIsQ0FBMUI7O3FCQUNkLFdBQUEsR0FBYyxTQUFBLENBQVUsYUFBVixFQUEwQixDQUExQjs7cUJBQ2QsV0FBQSxHQUFjLFNBQUEsQ0FBVSxhQUFWLEVBQTBCLENBQTFCOztxQkFDZCxXQUFBLEdBQWMsU0FBQSxDQUFVLGFBQVYsRUFBMEIsQ0FBMUI7O3FCQUdkLFdBQUEsR0FBYyxTQUFBLENBQVUsYUFBVixFQUEwQixDQUExQjs7cUJBQ2QsV0FBQSxHQUFjLFNBQUEsQ0FBVSxhQUFWLEVBQTBCLENBQTFCOztxQkFDZCxZQUFBLEdBQWMsU0FBQSxDQUFVLGNBQVYsRUFBMEIsQ0FBMUI7O3FCQUNkLFlBQUEsR0FBYyxTQUFBLENBQVUsY0FBVixFQUEwQixDQUExQjs7SUFHZCxHQUFBLEdBQU0sU0FBQyxLQUFEO0FBQ0osVUFBQTtBQUFBO1dBQUEsYUFBQTs7cUJBQUEsTUFBTSxDQUFBLFNBQUUsQ0FBQSxnQkFBUixDQUF5QixJQUF6QixFQUErQixNQUEvQjtBQUFBOztJQURJOztJQUlOLEdBQUEsQ0FBSTtNQUFBLE1BQUEsRUFBUSxTQUFBO2VBQUcsSUFBQyxDQUFBLGNBQWMsQ0FBQztNQUFuQixDQUFSO0tBQUo7Ozs7S0FoSm9DLE1BQU0sQ0FBQztBQUw3QyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbInN0cmVhbSA9IHJlcXVpcmUgJ3N0cmVhbSdcbnV0aWwgPSByZXF1aXJlICd1dGlsJ1xuXG4jIFN0dXBpZCBzdHJlYW0uXG4jIEBwcm9wZXJ0eSBbTnVtYmVyXSBsZW5ndGggdGhlIG51bWJlciBvZiBieXRlcyB0byByZWFkXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFN0dXBpZCBleHRlbmRzIHN0cmVhbS5UcmFuc2Zvcm1cbiAgY29uc3RydWN0b3I6IChpbnB1dCwgaW5wdXRFbmNvZGluZywgb3B0aW9ucyA9IHt9KSAtPlxuICAgIGlucCA9IHVuZGVmaW5lZFxuICAgIGlucEUgPSB1bmRlZmluZWRcbiAgICBzd2l0Y2ggdHlwZW9mKGlucHV0KVxuICAgICAgd2hlbiAnb2JqZWN0J1xuICAgICAgICBpZiBCdWZmZXIuaXNCdWZmZXIoaW5wdXQpXG4gICAgICAgICAgaW5wID0gaW5wdXRcbiAgICAgICAgICBpZiBpbnB1dEVuY29kaW5nPyBhbmQgKHR5cGVvZihpbnB1dEVuY29kaW5nKSA9PSAnb2JqZWN0JylcbiAgICAgICAgICAgIG9wdGlvbnMgPSBpbnB1dEVuY29kaW5nXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvcHRpb25zID0gaW5wdXRcbiAgICAgICAgICBpbnAgPSBvcHRpb25zPy5pbnB1dFxuXG4gICAgICB3aGVuICdzdHJpbmcnXG4gICAgICAgIGlucCA9IGlucHV0XG4gICAgICAgIGlmIGlucHV0RW5jb2Rpbmc/IGFuZCAodHlwZW9mKGlucHV0RW5jb2RpbmcpID09ICdvYmplY3QnKVxuICAgICAgICAgIG9wdGlvbnMgPSBpbnB1dEVuY29kaW5nXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpbnBFID0gaW5wdXRFbmNvZGluZ1xuXG4gICAgaW5wRSA/PSBvcHRpb25zLmlucHV0RW5jb2RpbmdcbiAgICBkZWxldGUgb3B0aW9ucy5pbnB1dFxuICAgIGRlbGV0ZSBvcHRpb25zLmlucHV0RW5jb2RpbmdcbiAgICBpZiBvcHRpb25zLm9iamVjdE1vZGU/XG4gICAgICBvcHRpb25zLnJlYWRhYmxlT2JqZWN0TW9kZSA9IG9wdGlvbnMub2JqZWN0TW9kZVxuICAgICAgb3B0aW9ucy53cml0YWJsZU9iamVjdE1vZGUgPSBvcHRpb25zLm9iamVjdE1vZGVcbiAgICAgIGRlbGV0ZSBvcHRpb25zLm9iamVjdE1vZGVcblxuICAgIHN1cGVyKG9wdGlvbnMpXG5cbiAgICAjIHdoZW4gdGhlIHdyaXRlIHNpZGUgZW5kcywgZmluaXNoIHRoZSByZWFkIHNpZGVcbiAgICBAb25jZSAncHJlZmluaXNoJywgPT5cbiAgICAgIEBwdXNoIG51bGxcblxuICAgIGlmIGlucD9cbiAgICAgIEBlbmQgaW5wLCBpbnBFXG5cbiAgIyBAbm9kb2NcbiAgX3RyYW5zZm9ybTogKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIC0+XG4gICAgaWYgIUBfcmVhZGFibGVTdGF0ZS5vYmplY3RNb2RlIGFuZCAhQnVmZmVyLmlzQnVmZmVyKGNodW5rKVxuICAgICAgY2h1bmsgPSBuZXcgQnVmZmVyIGNodW5rLCBlbmNvZGluZ1xuICAgIEBwdXNoIGNodW5rXG4gICAgY2FsbGJhY2soKVxuXG4gICMgQG5vZG9jXG4gIF9mbHVzaDogKGNiKSAtPlxuICAgIGNiKClcblxuICAjIE5vbi1kZXN0cnVjdGl2ZWx5IHJlYWQgYnl0ZXMuICBVc2VmdWwgZm9yIGRpYWdub3N0aWNzLlxuICAjIEBwYXJhbSBzaXplIFtOdW1iZXJdIE51bWJlciBvZiBieXRlcyB0byByZWFkLiAgSWYgbm90IHNwZWNpZmllZCwgcGVla1xuICAjICAgYXQgZnVsbCBjb250ZW50cy5cbiAgcGVlazogKHNpemUpIC0+XG4gICAgaWYgc3o/IGFuZCAoc3ogPiAwKVxuICAgICAgc3ogPSBNYXRoLm1pbiBAX3JlYWRhYmxlU3RhdGUubGVuZ3RoLCBzelxuICAgIGVsc2VcbiAgICAgIHN6ID0gQF9yZWFkYWJsZVN0YXRlLmxlbmd0aFxuXG4gICAgQnVmZmVyLmNvbmNhdCBAX3JlYWRhYmxlU3RhdGUuYnVmZmVyLCBzelxuXG4gIHRvSlNPTjogLT5cbiAgICBiID0gQHBlZWsoKVxuICAgIGlmIEJ1ZmZlci5pc0J1ZmZlcihiKVxuICAgICAgYi50b0pTT04oKVxuICAgIGVsc2VcbiAgICAgIGJcblxuICB0b1N0cmluZzogKGVuY29kaW5nLCBzdGFydCwgZW5kKSAtPlxuICAgIGIgPSBAcGVlaygpXG4gICAgaWYgIWI/XG4gICAgICBcIm51bGxcIlxuICAgIGVsc2VcbiAgICAgIGIudG9TdHJpbmcoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpXG5cbiAgIyBAbm9kb2NcbiAgaW5zcGVjdDogKGRlcHRoLCBvcHRpb25zKSAtPlxuICAgIGhleCA9IEBfcmVhZGFibGVTdGF0ZS5idWZmZXIubWFwIChiKSAtPlxuICAgICAgaWYgQnVmZmVyLmlzQnVmZmVyKGIpXG4gICAgICAgIG9wdGlvbnMuc3R5bGl6ZSBiLnRvU3RyaW5nKCdoZXgnKSwgJ3N0cmluZydcbiAgICAgIGVsc2VcbiAgICAgICAgdXRpbC5pbnNwZWN0KGIsIG9wdGlvbnMpXG4gICAgLmpvaW4gJywgJ1xuICAgIFwiI3tAY29uc3RydWN0b3IubmFtZX0gWyN7aGV4fV1cIlxuXG4gICMgQG5vZG9jXG4gIF9yZWFkX2dlbiA9IChtZXRoLCBsZW4pIC0+XG4gICAgKHZhbCkgLT5cbiAgICAgIGIgPSBAcmVhZCBsZW5cbiAgICAgIGlmICFCdWZmZXIuaXNCdWZmZXIoYilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIGJbbWV0aF0uY2FsbCBiLCAwLCB0cnVlXG5cbiAgIyBAbm9kb2NcbiAgX3dyaXRlX2dlbiA9IChtZXRoLCBsZW4pIC0+XG4gICAgKHZhbCkgLT5cbiAgICAgIGIgPSBuZXcgQnVmZmVyIGxlblxuICAgICAgYlttZXRoXS5jYWxsIGIsIHZhbCwgMCwgdHJ1ZVxuICAgICAgQHB1c2ggYlxuXG4gICMgdW5zaWduZWRcbiAgd3JpdGVVSW50ODogICAgX3dyaXRlX2dlbiAnd3JpdGVVSW50OCcsICAgIDFcbiAgd3JpdGVVSW50MTZMRTogX3dyaXRlX2dlbiAnd3JpdGVVSW50MTZMRScsIDJcbiAgd3JpdGVVSW50MTZCRTogX3dyaXRlX2dlbiAnd3JpdGVVSW50MTZCRScsIDJcbiAgd3JpdGVVSW50MzJMRTogX3dyaXRlX2dlbiAnd3JpdGVVSW50MzJMRScsIDRcbiAgd3JpdGVVSW50MzJCRTogX3dyaXRlX2dlbiAnd3JpdGVVSW50MzJCRScsIDRcblxuICAjIHNpZ25lZFxuICB3cml0ZUludDg6ICAgICBfd3JpdGVfZ2VuICd3cml0ZUludDgnLCAgICAgMVxuICB3cml0ZUludDE2TEU6ICBfd3JpdGVfZ2VuICd3cml0ZUludDE2TEUnLCAgMlxuICB3cml0ZUludDE2QkU6ICBfd3JpdGVfZ2VuICd3cml0ZUludDE2QkUnLCAgMlxuICB3cml0ZUludDMyTEU6ICBfd3JpdGVfZ2VuICd3cml0ZUludDMyTEUnLCAgNFxuICB3cml0ZUludDMyQkU6ICBfd3JpdGVfZ2VuICd3cml0ZUludDMyQkUnLCAgNFxuXG4gICMgZmxvYXRcbiAgd3JpdGVGbG9hdExFOiAgX3dyaXRlX2dlbiAnd3JpdGVGbG9hdExFJywgIDRcbiAgd3JpdGVGbG9hdEJFOiAgX3dyaXRlX2dlbiAnd3JpdGVGbG9hdEJFJywgIDRcbiAgd3JpdGVEb3VibGVMRTogX3dyaXRlX2dlbiAnd3JpdGVEb3VibGVMRScsIDhcbiAgd3JpdGVEb3VibGVCRTogX3dyaXRlX2dlbiAnd3JpdGVEb3VibGVCRScsIDhcblxuICAjIHVuc2lnbmVkXG4gIHJlYWRVSW50ODogICAgX3JlYWRfZ2VuICdyZWFkVUludDgnLCAgICAxXG4gIHJlYWRVSW50MTZMRTogX3JlYWRfZ2VuICdyZWFkVUludDE2TEUnLCAyXG4gIHJlYWRVSW50MTZCRTogX3JlYWRfZ2VuICdyZWFkVUludDE2QkUnLCAyXG4gIHJlYWRVSW50MzJMRTogX3JlYWRfZ2VuICdyZWFkVUludDMyTEUnLCA0XG4gIHJlYWRVSW50MzJCRTogX3JlYWRfZ2VuICdyZWFkVUludDMyQkUnLCA0XG5cbiAgIyBzaWduZWRcbiAgcmVhZEludDg6ICAgICBfcmVhZF9nZW4gJ3JlYWRJbnQ4JywgICAgIDFcbiAgcmVhZEludDE2TEU6ICBfcmVhZF9nZW4gJ3JlYWRJbnQxNkxFJywgIDJcbiAgcmVhZEludDE2QkU6ICBfcmVhZF9nZW4gJ3JlYWRJbnQxNkJFJywgIDJcbiAgcmVhZEludDMyTEU6ICBfcmVhZF9nZW4gJ3JlYWRJbnQzMkxFJywgIDRcbiAgcmVhZEludDMyQkU6ICBfcmVhZF9nZW4gJ3JlYWRJbnQzMkJFJywgIDRcblxuICAjIGZsb2F0XG4gIHJlYWRGbG9hdExFOiAgX3JlYWRfZ2VuICdyZWFkRmxvYXRMRScsICA0XG4gIHJlYWRGbG9hdEJFOiAgX3JlYWRfZ2VuICdyZWFkRmxvYXRCRScsICA0XG4gIHJlYWREb3VibGVMRTogX3JlYWRfZ2VuICdyZWFkRG91YmxlTEUnLCA4XG4gIHJlYWREb3VibGVCRTogX3JlYWRfZ2VuICdyZWFkRG91YmxlQkUnLCA4XG5cbiAgIyBAbm9kb2NcbiAgZ2V0ID0gKHByb3BzKSAtPlxuICAgIFN0dXBpZDo6X19kZWZpbmVHZXR0ZXJfXyhuYW1lLCBnZXR0ZXIpIGZvciBuYW1lLCBnZXR0ZXIgb2YgcHJvcHNcblxuICAjIEBwcm9wZXJ0eSBbTnVtYmVyXSBUaGUgbnVtYmVyIG9mIGJ5dGVzIGN1cnJlbnRseSBhdmFpbGFibGUgdG8gcmVhZFxuICBnZXQgbGVuZ3RoOiAtPiBAX3JlYWRhYmxlU3RhdGUubGVuZ3RoXG4iXX0=
