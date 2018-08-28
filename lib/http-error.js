'use strict';

const util = require('util');

const { STATUS_CODES } = require('http');

const ERROR_COLLECTION_BASE_VALUE = 400;

function HttpError(code, message = '') {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.code = code;
  this.message = message;
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

function formatAsCamelCaseWord(word = '') {
  return word
    .replace(/\W+/g, '')
    .toLowerCase()
    .replace(
      /^\w/,
      char => char.toUpperCase()
    );
}

const appendErrIfNone = function(str = '') {
  return str
    .replace(/(error)+$/i, '')
    .concat('Error');
}

function errNameFromDesc(desc) {
  if (typeof desc !== 'string' || desc.length === 0) {
    return false;
  }

  return appendErrIfNone(
    desc
      .split(/[\s-]/)
      .map(formatAsCamelCaseWord)
      .join('')
  );
}

function errorFactory(errors, code) {
  const parsedCode = parseInt(code, 10);
  if (parsedCode < ERROR_COLLECTION_BASE_VALUE) {
    return errors;
  }

  let errorName = errNameFromDesc(STATUS_CODES[parsedCode]);

  if (!errorName) {
    return errors;
  }

  errors[errorName] = function (message = STATUS_CODES[parsedCode]) {
    HttpError.apply(this, [parsedCode, message]);
  }

  util.inherits(errors[errorName], HttpError);

  errors[errorName].prototype.name = errorName;

  return errors;
}

function getAllErrors() {
  return Object.keys(STATUS_CODES).reduce(errorFactory, {});
}

const additionalHttpErrors = getAllErrors();

module.exports = { HttpError, ...additionalHttpErrors }
