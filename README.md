# proxied-promise-object

Proxy all calls to an objects functions to a wrapper which returns
promises.

NOTE: This does not use "real" proxies (ES6)

Works in node & the browser through component

## Usage

```js
var Proxy = require('proxied-promise-object');

// Proxy(Promise, object); also works
var fs = new Proxy(YourFavPromiseLib, require('fs'));

fs.stat('xfoo/...').then(
  function() {
  }
);
```

Proxies are stamped as well to protect wrapping proxies with proxies

```js
var fs = new Proxy(YourFavPromiseLib, require('fs'));
var fs2 = new Proxy(YourFavPromiseLib, fs);

// fs === fs2
```

If there is a global promise object (like in the browser):

```js
var proxied = new Proxy(callbackReturningObj);
```
