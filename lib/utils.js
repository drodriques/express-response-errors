const assert = require('assert-plus');
// const { STATUS_CODES } = require('http');

// const { HttpResponseException } = require('exceptions');

function normalizeWord(word) {
  return word
    .replace(/\W+/g, '')
    .toLowerCase()
    .replace(
      /^\w/,
      char => char.toUpperCase()
    );
}

function normalizeStr(str) {
  return str
    .replace(/error$/i, '')
    .concat('Error');
}

function statusCodeDescToCamelCaseStr(desc) {
  assert.string(desc, 'desc');
  return normalizeStr(
    desc
      .split(/[\s-]/)
      .map(normalizeWord)
      .join('')
  );
}

// function httpErrorClassFactory() {
//   return Object.keys(STATUS_CODES).map(code => {
//
//     let errorClassName = statusCodeDescToCamelCaseStr(STATUS_CODES[code]);
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

module.exports = {
  statusCodeDescToCamelCaseStr
}
