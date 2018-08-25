'use strict';

const statusTexts = require('./status-texts');

class BaseError extends Error {
  // var err = new Error('Not Acceptable');
  // err.status = err.statusCode = 406;
  // assert.number(code, 'code');
  // attempt to retrieve status code description, if not available,
  // fallback on 500.
  // var errorDesc = http.STATUS_CODES[code] || http.STATUS_CODES[500];
  constructor (message = '') {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError);
    }

    if (this.message) {
      this.message = message;
    }
    // this.name = BaseError.name;
    // this.status = null;
  }
}

module.exports = {
  BaseError
}
