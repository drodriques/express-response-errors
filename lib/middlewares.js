'use strict';

function httpErrorHandlerMiddleware (err, req, res, next) {
  if (res.headersSent || !(err instanceof HttpResponseException)) {
    return next(err);
  }
  // jsonp support
  res.json(err.status, {message: err.message});
}