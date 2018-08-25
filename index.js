'use strict';

const httpErrors = require('./lib/http-errors');
const middlewares = require('./lib/middlewares');
const statusCodes = require('./lib/code-constants');
const statusTexts = require('./lib/status-texts');

module.exports = {
  httpErrors,
  middlewares,
  statusCodes,
  statusTexts
};
