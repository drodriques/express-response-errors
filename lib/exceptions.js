'use strict';

const statusTexts = require('./status-texts');

class HttpResponseException extends Error {
  // invalidargumentexception
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
