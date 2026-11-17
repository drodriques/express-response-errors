const { test } = require('node:test')
const assert = require('node:assert/strict')
const { HttpError } = require('..')
const registry = require('./fixtures/errors.json')

test('base errors use the fixed messages for every supported named status', () => {
  for (const [, code, message] of registry) {
    assert.equal(new HttpError(code).message, message)
    assert.equal(new HttpError(code, '').message, message)
    assert.equal(new HttpError(code, 'Custom message').message, 'Custom message')
  }
})
