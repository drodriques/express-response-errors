const assert = require('assert');

const { HttpResponseException, statusCodes } = require('..');

const { HTTP_I_AM_A_TEAPOT } = statusCodes;

describe('HttpResponseException', function () {
  let httpError;

  before(function() {
    httpError = new HttpResponseException(HTTP_I_AM_A_TEAPOT);
  });

  it('should be instance of Error', function(done) {
    assert(httpError instanceof Error);
    done();
  })

  it('should be instance of error of HttpResponseException', function(done) {
      assert(httpError instanceof HttpResponseException);
      done();
  })

  // The name property should be set to the error's name
  it('should have name of custom class', function(done) {
    assert.strictEqual(httpError.name, 'HttpResponseException');
    done();
  })

  it('should have message set to default value', function(done) {
    assert.strictEqual(httpError.message, 'I\'m a teapot');
    done();
  })

  it('should have message set to custom value', function(done) {
    const CUSTOM_ERROR_MESSAGE = 'custom message';
    const { message } = new HttpResponseException(HTTP_I_AM_A_TEAPOT, CUSTOM_ERROR_MESSAGE);
    assert.strictEqual(message, CUSTOM_ERROR_MESSAGE);
    done();
  })

  it('should throw error with correct status code', function(done) {
    assert.strictEqual(httpError.status, 418);
    done();
  })

  it('should throw error with stack', function(done) {
    assert(httpError.stack);
    done();
  })

})

// The name property should be set to the error's name
// assert(err.name = 'CustomError');

// The error should be an instance of its class
// assert(err instanceof CustomError);

// The error should be an instance of builtin Error
// assert(err instanceof Error);

// The error should be recognized by Node.js' util#isError
// assert(require('util').isError(err));

// The error should have recorded a stack
// assert(err.stack);

// toString should return the default error message formatting
// assert.strictEqual(err.toString(),
//   'CustomError: It went bad!');

// The stack should start with the default error message formatting
// assert.strictEqual(err.stack.split('\n')[0],
//   'CustomError: It went bad!');

// The first stack frame should be the function where the error was thrown.
// assert.strictEqual(err.stack.split('\n')[1].indexOf('doSomethingBad'), 7);

// The extra property should have been set
// assert.strictEqual(err.extra, 42);



