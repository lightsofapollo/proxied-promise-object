function proxy(method, subject) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
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

// Create getters for the underlying objects if it's not a function.
// NOTE: This is as slow and potentially sketchy as it looks.
function createGetter(target, property, subject) {
  var targetDesc = {
    enumerable: subject.propertyIsEnumerable(property),
    get: function() {
      return subject[property];
    },
    set: function(value) {
      subject[property] = value;
    }
  };

  Object.defineProperty(target, property, targetDesc);
}

function Proxy(object, PromiseObj, options) {
  PromiseObj = PromiseObj || Promise;
  if (!PromiseObj) {
    throw new Error('Invalid promise object given or cannot find global');
  }
  if (!object) throw new Error('Invalid proxy object');
  if (!(this instanceof Proxy)) return new Proxy(object, PromiseObj, options);
  if (object.$proxypromiseobject) return object;
  options = options || {};

  // Traverse all levels by default.
  if (!('deep' in options)) options.deep = true;

  this.Promise = PromiseObj;

  // Protects against double wrapping and circular references.
  this.$proxypromiseobject = true;

  for (var key in object) {
    // Sanity check for older JS engines just in case...
    switch (typeof object[key]) {
      case 'object':
        if (options.deep && object[key] && !Array.isArray(object[key])) {
          this[key] = new Proxy(object[key], PromiseObj, options);
        } else {
          // If it's not deep then just stop here...
          createGetter(this, key, object);
        }
        break;
      case 'function':
        this[key] = proxy(key, object);
        break;
      default:
        createGetter(this, key, object);
    }
  }
}

module.exports = Proxy;
