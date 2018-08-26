const assert = require('chai').assert;

const utils = require('../lib/utils');

describe('utils', function () {
  before(function() {});

  describe('.errNameFromDesc', function() {
    it('should create camel case word only error name from description', function(done) {
      const statusCodeDesc = 'I\'m a Tea-pot';
      assert.strictEqual(utils.errNameFromDesc(statusCodeDesc), 'ImATeaPotError');
      assert.isTrue(/Error$/g.test(utils.errNameFromDesc(statusCodeDesc)));
      done();
    });

    it('should append \'Error\' to name if description doesn\'t end with it', function(done) {
      assert.isFalse(/(error){2,}$/ig.test(utils.errNameFromDesc('I\'m a Tea-pot Error')));
      done();
    });

    it('should return false if description is not string or empty', function(done) {
      assert.isFalse(utils.errNameFromDesc());
      done();
    });
  });

  describe('.errorFactor', function() {
    it('should be instance of Error', function (done) {
      const ImATeapotError = utils.errorFactory(418);
      const tmp = ImATeapotError instanceof Error;
      assert.instanceOf(ImATeapotError, Error);
      done();
    });
  });

});
