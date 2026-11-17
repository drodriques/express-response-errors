const { test } = require('node:test')
const assert = require('node:assert/strict')
const { inherits } = require('node:util')
const errors = require('..')
const { HttpError, NotFoundError } = errors
const registry = require('./fixtures/errors.json')

test('all v1 error exports retain codes, names, defaults and inheritance', () => {
  for (const [name, code, message] of registry) {
    const Constructor = errors[name]
    const error = new Constructor()
    assert(error instanceof Constructor)
    assert(error instanceof HttpError)
    assert(error instanceof Error)
    assert.equal(error.code, code)
    assert.equal(error.statusCode, code)
    assert.equal(error.name, name)
    assert.equal(error.message, message)
    assert.equal(new Constructor('custom').message, 'custom')
    assert.equal(new Constructor('').message, message)
    assert(error.stack.includes(name))
    assert.equal(error.toString(), `${name}: ${message}`)
  }
})

test('modern and util.inherits subclassing continue to work', () => {
  class AccountMissingError extends NotFoundError {}
  const modern = new AccountMissingError('Account missing')
  assert(modern instanceof NotFoundError)
  assert.equal(modern.code, 404)

  function LegacyNamedError(message) {
    LegacyNamedError.super_.call(this, message)
  }

  inherits(LegacyNamedError, NotFoundError)
  assert(new LegacyNamedError() instanceof NotFoundError)
  assert.equal(NotFoundError.super_, HttpError)
  assert.equal(HttpError.super_, Error)
})

test('named constructors pass options to the shared base constructor', () => {
  const cause = new Error('Lookup failed')
  const details = { resource: 'account' }
  const error = new NotFoundError('Missing account', {
    cause,
    details,
    errorCode: 'ACCOUNT_MISSING',
    expose: false,
    headers: { 'Cache-Control': 'no-store' },
  })

  assert.equal(error.cause, cause)
  assert.equal(error.details, details)
  assert.equal(error.errorCode, 'ACCOUNT_MISSING')
  assert.equal(error.expose, false)
  assert.deepEqual(error.headers, { 'Cache-Control': 'no-store' })
})
