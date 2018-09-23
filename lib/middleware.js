'use strict'

const { HttpError } = require('./http-error')

exports.responseErrorHandler = function (err, req, res, next) {
  if (res.headersSent || !(err instanceof HttpError)) {
    return next(err)
  }
  res.status(err.code).json({ message: err.message })
}
