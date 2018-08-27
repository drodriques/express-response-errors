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
    it('should be instance of Error', function (done) {
      const ImATeapotError = utils.errorFactory(418);
      const errInstance = new ImATeapotError('I only brew coffee');
      const errorInstance = new Error('Test');
      assert.instanceOf(errInstance, HttpError);
      assert.instanceOf(errInstance, Error);
      done();
    });
  });

});

////

// ImATeapotError: I'm a Teapot
// at new err.(anonymous function) (/Users/drodriques/Sites/dw-express-http-errors/lib/utils.js:53:7)
// at Context.<anonymous> (/Users/drodriques/Sites/dw-express-http-errors/test/utils.js:32:27)
// at callFnAsync (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runnable.js:400:21)
// at Test.Runnable.run (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runnable.js:342:7)
// at Runner.runTest (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:455:10)
// at /Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:573:12
// at next (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:369:14)
// at /Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:379:7
// at next (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:303:14)
// at Immediate._onImmediate (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:347:5)
// at runCallback (timers.js:696:18)
// at tryOnImmediate (timers.js:667:5)
// at processImmediate (timers.js:649:5)

/////

// HttpError
// at Object.errorFactory (/Users/drodriques/Sites/dw-express-http-errors/lib/utils.js:39:15)
// at Context.<anonymous> (/Users/drodriques/Sites/dw-express-http-errors/test/utils.js:30:40)
// at callFnAsync (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runnable.js:400:21)
// at Test.Runnable.run (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runnable.js:342:7)
// at Runner.runTest (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:455:10)
// at /Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:573:12
// at next (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:369:14)
// at /Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:379:7
// at next (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:303:14)
// at Immediate._onImmediate (/Users/drodriques/Sites/dw-express-http-errors/node_modules/mocha/lib/runner.js:347:5)
// at runCallback (timers.js:696:18)
// at tryOnImmediate (timers.js:667:5)
// at processImmediate (timers.js:649:5)
