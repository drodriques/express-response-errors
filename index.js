'use strict';

const statusCodes = require('./lib/status-codes');
const statusTexts = require('./lib/status-texts');

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

function httpErrorHandlerMiddleware (err, req, res, next) {
  if (res.headersSent || !(err instanceof HttpResponseException)) {
    return next(err);
  }
  res.json(err.status, {message: err.message});
}

module.exports = {
  statusCodes,
  statusTexts,
  httpErrorHandlerMiddleware,
  HttpResponseException
};
