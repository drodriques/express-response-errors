const util = require('util')

const assert = require('chai').assert;

const { HttpError } = require('../lib/http-errors');
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
    let httpErrorInstance;
    let ImATeapotError

    before(function() {
      ImATeapotError = utils.errorFactory(418);
      httpErrorInstance = new ImATeapotError()
    });

    it('should be instance of Error', function (done) {
      assert.instanceOf(httpErrorInstance, Error);
      done();
    });

    it('should be instance of HttpError', function (done) {
      assert.instanceOf(httpErrorInstance, HttpError);
      done();
    });

    it('should be recognized by Node.js', function(done) {
      assert.isTrue(util.isError(httpErrorInstance));
      done();
    })

    it('should have name of custom class', function(done) {
      assert.strictEqual(httpErrorInstance.name, 'ImATeapotError');
      done();
    })

    it('should have message set to default value', function(done) {
      assert.strictEqual(httpErrorInstance.message, 'I\'m a Teapot');
      done();
    })

    it('should have message set to custom value', function(done) {
      const { message } = new ImATeapotError('I only brew coffee')
      assert.strictEqual(message, 'I only brew coffee');
      done();
    })

    it('should have code set to default value', function(done) {
      assert.strictEqual(httpErrorInstance.code, 418);
      done();
    })

    it('should set a value for stack', function(done) {
      assert(httpErrorInstance.stack);
      done();
    })

  });

});
