suite('proxy', function() {
  var Proxy = require('./');
  var Promise = require('promise');
  var fs = require('fs');
  var fsP = new Proxy(Promise, fs);

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
    var obj = new Proxy(Promise, {
      throws: function() {
        throw err;
      }
    });

    obj.throws().then(null, function(given) {
      assert.equal(err, given);
      done();
    });
  });
});
