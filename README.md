# proxied-promise-object

Proxy all calls to an objects functions to a wrapper which returns
promises. In addition to wrapping functions this project will also setup
a getter/setter "proxy" so you can treat the proxied objects very
similar to their originals (i.e. setting a property on either will
effect both).

NOTE: This does not use "real" proxies (ES6)

Works in node & the browser through component

## Usage

```js
var proxy = require('proxied-promise-object');

var fs = proxy(require('fs'), PromiseLibary);

fs.stat('xfoo/...').then(
  function() {
  }
);
```

Proxies are stamped as well to protect wrapping proxies with proxies

```js
var fs = proxy(YourFavPromiseLib, require('fs'));
var fs2 = proxy(YourFavPromiseLib, fs);

// fs === fs2
```

If there is a global promise object (like in the browser):

```js
var proxied = proxy(callbackReturningObj);
```

By default when you proxy an object it will "deeply" traverse the object
creating proxies even on nested levels.

```js
var proxyObj = proxy(...);

proxyObj.nested.api.call().then(...)
```

This can be disabled by passing deep: false:

```js
proxyObj = proxy(object, Promise, { deep: false });
```

## LICENSE

The MIT License (MIT)

Copyright (c) 2015 Sahaja James Lal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
