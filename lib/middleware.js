'use strict';

const { HttpError } = require('./http-error');

 exports.middleware = function (err, req, res, next) {
  if (res.headersSent || !(err instanceof HttpError)) {
    return next(err);
  }
  // jsonp support
  res.status.json(err.code, {message: err.message});
}
