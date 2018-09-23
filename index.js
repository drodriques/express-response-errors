'use strict'

const httpErrors = require('./lib/http-error')
const { responseErrorHandler } = require('./lib/middleware')

module.exports = {
  ...httpErrors,
  httpErrorsMiddleware: responseErrorHandler, // Deprecated
  responseErrorHandler
}
