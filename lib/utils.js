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

  let errorClassName = errNameFromDesc(STATUS_CODES[code]);

  if (!errorClassName) {
    return;
  }

  err[errorClassName] = function (message = STATUS_CODES[code]) {
    HttpError.apply(this, [code, message]);
  }

  // var myName = "myName";
  // var f = function () { return true; };
  // Object.defineProperty(function() { console.log('hello'); }, 'name', {value: 'tmp1', writable: false});

  // console.log(Object.prototype.tmp1);

  // err[errorClassName].prototype.name = errorClassName;

  util.inherits(err[errorClassName], HttpError);

  // err[errorClassName].prototype.name = errorClassName;

  // fn = {[name]: function() {}}[name];

  return err[errorClassName];
}

function getAllErrors() {
  return Object.keys(STATUS_CODES).map(errorFactory);
}

// var req = Object.create(BaseError)
// module.exports = req

// this.locals = Object.create(null);
// Object.defineProperty

module.exports = {
  getAllErrors,
  errorFactory,
  errNameFromDesc
}
