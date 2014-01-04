suite('Make Tea', function() {
  var fs = require('fs'),
      Promise = require('promise');

  function proxy(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      var subject = this.subject;

      return new this.Promise(function(accept, reject) {
        args.push(function(err, value) {
          if (err) return reject(err);
          accept(value);
        });

        try {
          subject[method].apply(subject, args);
        } catch (e) {
          reject(e);
        }
      });
    }
  }

  function Proxy(Promise, object) {
    this.Promise = Promise;
    this.subject = object;

    for (var key in object) {
      if (typeof object[key] !== 'function') continue;
      this[key] = proxy(key);
    }
  }

  var fsProxy = new Proxy(Promise, fs);

  bench('build proxy', function() {
    var prox = new Proxy(Promise, fs);
  });

  bench('baseline', function(done) {
    fs.stat('README.md', done);
  });

  bench('call proxy', function(done) {
    fsProxy.stat('README.md').then(done);
  });
});
