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

function Proxy(PromiseObj, object) {
  if (typeof object === 'undefined') {
    object = PromiseObj;
    // attempt to use a global promise object if available
    PromiseObj = Promise;
  }

  if (!(this instanceof Proxy)) return new Proxy(PromiseObj, object);
  if (object.$proxypromiseobject) return object;

  this.Promise = PromiseObj;
  this.subject = object;
  this.$proxypromiseobject = true;

  for (var key in object) {
    if (typeof object[key] !== 'function') continue;
    this[key] = proxy(key);
  }
}

module.exports = Proxy;
