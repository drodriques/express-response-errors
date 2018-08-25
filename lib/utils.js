// const assert = require('assert-plus');
// const { STATUS_CODES } = require('http');

// const { HttpResponseException } = require('exceptions');

const formatAsCamelCaseWord = function(word = '') {
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

exports.errNameFromDesc = function(desc) {
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

// exports.errNameFromDesc = errNameFromDesc

// function httpErrorClassFactory() {
//   return Object.keys(STATUS_CODES).map(code => {
//
//     let errorClassName = errNameFromDesc(STATUS_CODES[code]);
//
//     const baseClass = Object.create(HttpResponseException)
//
//
//   })
//
// }

// var req = Object.create(HttpResponseException)
// module.exports = req

// this.locals = Object.create(null);
// Object.defineProperty

// module.exports = {
//   errNameFromDesc
// }
