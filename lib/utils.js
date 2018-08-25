// const assert = require('assert-plus');
const { STATUS_CODES } = require('http');

const { BaseError } = require('./http-errors');

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
  if (code < ERROR_COLLECTION_BASE_VALUE) {
    return;
  }

  let errorClassName = errNameFromDesc(STATUS_CODES[code]);

  if (!errorClassName) {
    return;
  }

  return Object.create(new Error(), {
    message: {
      value: STATUS_CODES[code],
      writable: true
    },
    name: {
      value: errorClassName,
      writable: false
    },
    status: {
      value: code,
      writable: false
    }
  });

  // Object.defineProperties(baseClass, {
  //   message: {
  //     value: STATUS_CODES[code],
  //     writable: true
  //   },
  //   name: {
  //     value: errorClassName,
  //     writable: false
  //   },
  //   status: {
  //     value: code,
  //     writable: false
  //   }
  // });

  // return baseClass;

  // set name

  // set code

  // if message set
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
