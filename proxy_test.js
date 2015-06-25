suite('proxy', function() {
  var proxy = require('./');
  var Promise = require('promise');
  var fs = require('fs');
  var fsP = proxy(fs, Promise);

  test('successful promise', function(done) {
    var expected = fs.readFileSync('package.json', 'utf8');

    fsP.readFile('package.json', 'utf8').then(
      function(value) {
        assert.equal(value, expected);
        done();
      }
    );
  });

  suite('unsuccessful promise', function() {
    var expected;
    setup(function(done) {
      fs.readFile('INOHERE', function(err) {
        assert.ok(err);
        expected = err;
        done();
      });
    });

    test('passes errors', function(done) {
      fsP.readFile('INOHERE').then(null, function(err) {
        assert.deepEqual(expected, err);
        done();
      });
    });
  });

  test('sync error from proxied object', function(done) {
    var err = new Error('WTFD');
    var obj = proxy({
      throws: function() {
        throw err;
      }
    }, Promise);

    obj.throws().then(null, function(given) {
      assert.equal(err, given);
      done();
    });
  });

  test('avoid double wrapping the object', function() {
    var anotherFsP = proxy(fsP, Promise);
    assert.equal(anotherFsP, fsP);
  });

  test('with global Promise', function() {
    global.Promise = Promise;
    var fsProxy = proxy(fs);
    var stat = fsProxy.stat('/xfoo');
    assert.ok(stat.then);
  });

  test('getter/setters', function() {
    var obj = {
      prop: ['1', '2', '3']
    };

    var objProxy = proxy(obj, Promise);
    assert.equal(objProxy.prop, obj.prop);

    objProxy.prop = 'zfoo';
    assert.equal(obj.prop, 'zfoo');
  });

  test('deep wrapping', function(done) {
    var constructor = function() {};
    constructor.prototype = {
      a: { prop: 1 },
      funcs: {
        func: function(callback) {
          callback();
        }
      }
    }


    var objProxy = proxy(new constructor(), Promise, {
      deep: true
    });
    assert.equal(objProxy.a.prop, 1);
    objProxy.funcs.func().then(done);
  });
});
