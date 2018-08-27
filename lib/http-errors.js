'use strict';

const util = require('util');

function HttpError(code, message = '') {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.code = code;
  this.message = message;
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

module.exports = {
  HttpError
}
