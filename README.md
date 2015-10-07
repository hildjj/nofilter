# NoFilter

A node.js package to read and write a stream of data into or out of what looks
like a growable [Buffer](https://nodejs.org/api/buffer.html).

I kept needing this, and none of the existing packages seemed to have enough
features, test coverage, etc.

# Examples

```javascript
var NoFilter = require('nofilter');
nf = new NoFilter();
nf.on('finish', function() {
  console.log(nf.toString('base64'));
});
process.stdin.pipe(nf);
```
