const { test } = require('node:test')
const assert = require('node:assert/strict')
const errors = require('..')
const { HttpError } = errors
const registry = require('./fixtures/errors.json')

test('root and legacy entry points use identical constructors and middleware', () => {
  assert.equal(require('../lib/http-error').HttpError, HttpError)
  for (const [name] of registry) {
    assert.equal(require('../lib/http-error')[name], errors[name])
  }
  assert.equal(require('../lib/middleware').responseErrorHandler, errors.responseErrorHandler)
  assert.equal(errors.httpErrorsMiddleware, errors.responseErrorHandler)
  assert.equal(new errors.TooEarlyError().code, 425)
  assert.equal(new errors.UnorderedCollectionError().name, 'UnorderedCollectionError')
})

test('public exports contain the supported API without internal helpers', () => {
  const expected = [
    'HttpError',
    'responseErrorHandler',
    'httpErrorsMiddleware',
    'createResponseErrorHandler',
    'problemDetailsSerializer',
    ...registry.map(([name]) => name),
  ]
  assert.deepEqual(Object.keys(errors).sort(), expected.sort())
})
