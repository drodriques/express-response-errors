'use strict';

const statusTexts = require('./status-texts');

class HttpResponseException extends Error {
  // var err = new Error('Not Acceptable');
  // err.status = err.statusCode = 406;
  // assert.number(code, 'code');
  // attempt to retrieve status code description, if not available,
  // fallback on 500.
  // var errorDesc = http.STATUS_CODES[code] || http.STATUS_CODES[500];
  constructor (status, message = '') {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpResponseException);
    }

    this.message = message ? message : statusTexts[status];
    this.name = HttpResponseException.name;
    this.status = status;
  }
}

module.exports = {
  HttpResponseException
}
