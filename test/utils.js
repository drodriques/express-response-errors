const assert = require('chai').assert;

const utils = require('../lib/utils');

// const { HttpResponseException } = exceptions;
// const { HTTP_I_AM_A_TEAPOT } = statusCodes;

describe('Utils', function () {
  before(function() {});


  // should not contain non words
  // should remove hyphen and spaces with camel cased
  // Should end with a single occurrence of Error

  it('should format http status code description as camel case string', function(done) {
    const errorClassName = utils.statusCodeDescToCamelCaseStr('I\'m a Teapot')
    assert.strictEqual(errorClassName, 'ImATeapotError');
    done();
  })
});
