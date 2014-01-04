# proxied-promise-object

Proxy all calls to an objects functions to a wrapper which returns
promises.

NOTE: This does not use "real" proxies (ES6)

## Usage

```js
var Proxy = require('proxied-promise-object');
var fs = new Proxy(YourFavPromiseLib, require('fs'));

fs.stat('xfoo/...').then(
  function() {
  }
);
```
