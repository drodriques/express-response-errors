const { test } = require('node:test')
const assert = require('node:assert/strict')
const { inherits } = require('node:util')
const { HttpError } = require('..')

test('base error defaults and enumerable legacy fields remain compatible', () => {
  const error = new HttpError(418)
  assert.equal(error.name, 'HttpError')
  assert.equal(error.message, "I'm a Teapot")
  assert.deepEqual({ ...error }, { code: 418, message: "I'm a Teapot" })
  assert.equal(JSON.stringify(error), '{"code":418,"message":"I\'m a Teapot"}')
  error.code = 404
  assert.equal(error.statusCode, 404)
})

test('invalid status inputs throw while unassigned integer codes remain supported', () => {
  for (const code of [undefined, null, '404', NaN, Infinity, -Infinity, 399, 512, 404.5]) {
    assert.throws(() => new HttpError(code), {
      name: 'RangeError',
      message: 'Invalid HTTP status error code.',
    })
  }
  assert.equal(new HttpError(499).message, 'HTTP Error')
  assert.equal(new HttpError(499, 'Custom status').message, 'Custom status')
})

test('new options preserve causes and copy validated immutable headers', () => {
  const cause = new Error('database failure')
  const headers = { 'Retry-After': '60' }
  const details = [{ field: 'email', message: 'Required' }]
  const error = new HttpError(418, 'custom', {
    cause,
    headers,
    details,
    errorCode: 'TEA_ONLY',
    expose: false,
  })
  headers['Retry-After'] = '100'
  assert.equal(error.cause, cause)
  assert.equal(error.headers['Retry-After'], '60')
  assert(Object.isFrozen(error.headers))
  assert.equal(error.errorCode, 'TEA_ONLY')
  assert.equal(error.details, details)
  assert.equal(error.expose, false)
  assert.equal(Object.prototype.propertyIsEnumerable.call(error, 'cause'), false)
  assert.throws(() => new HttpError(400, '', { headers: { 'bad name': 'x' } }))
  assert.throws(() => new HttpError(400, '', { headers: { x: 'a\r\nb' } }))
  assert.throws(() => new HttpError(429, '', { headers: { 'Retry-After': 60 } }), TypeError)
  const unusual = new HttpError(400, '', { headers: JSON.parse('{"__proto__":"value"}') })
  assert.equal(Object.getOwnPropertyDescriptor(unusual.headers, '__proto__').value, 'value')
})

test('base errors support modern and util.inherits subclassing', () => {
  class AccountError extends HttpError {}
  const modern = new AccountError(409, 'Conflict')
  assert(modern instanceof HttpError)
  assert(modern instanceof Error)

  function LegacyError(message) {
    LegacyError.super_.call(this, 409, message)
  }

  inherits(LegacyError, HttpError)
  const legacy = new LegacyError('Conflict')
  assert(legacy instanceof HttpError)
  assert.equal(legacy.code, 409)
  assert.equal(HttpError.super_, Error)
})
