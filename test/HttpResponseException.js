// const assert = require('chai').assert;
const assert = require('assert').strict;
const http = require('http').STATUS_CODES;
const util = require('util');

const { exceptions, statusCodes } = require('..');

const { HttpResponseException } = exceptions;
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

  it('should be instance of HttpResponseException', function(done) {
      assert(httpError instanceof HttpResponseException);
      done();
  })

  it('should be recognized by Node.js', function(done) {
    assert(util.isError(httpError));
    done();
  })

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

  it('should have status set to constructor parameter', function(done) {
    assert.strictEqual(httpError.status, 418);
    done();
  })

  it('should set a value for stack', function(done) {
    assert(httpError.stack);
    done();
  })
});
