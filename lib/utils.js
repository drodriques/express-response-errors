'use strict';

const util = require('util');

const { STATUS_CODES } = require('http');

const { HttpError } = require('./http-errors');

const ERROR_COLLECTION_BASE_VALUE = 400;

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

function errorFactory(code) {
  let err = {};
  if (code < ERROR_COLLECTION_BASE_VALUE) {
    return;
  }

  let errorName = errNameFromDesc(STATUS_CODES[code]);

  if (!errorName) {
    return;
  }

  err[errorName] = function (message = STATUS_CODES[code]) {
    HttpError.apply(this, [code, message]);
  }

  util.inherits(err[errorName], HttpError);

  err[errorName].prototype.name = errorName;

  return err[errorName];
}

function getAllErrors() {
  return Object.keys(STATUS_CODES).map(errorFactory);
}

module.exports = {
  getAllErrors,
  errorFactory,
  errNameFromDesc
}
