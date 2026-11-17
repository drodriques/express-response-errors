const { test } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const {
  HttpError,
  UriTooLongError,
  TooManyRequestsError,
  responseErrorHandler,
  createResponseErrorHandler,
} = require('..')

for (const version of ['express4', 'express']) {
  const express = require(version)
  const appFor = (error, handler = responseErrorHandler) => {
    const app = express()
    app.get('/', (_req, _res, next) => next(error))
    app.use(handler)
    app.use((err, _req, res, next) => {
      if (res.headersSent) {
        return next(err)
      }
      res.status(599).json({ forwarded: err.message })
    })
    return app
  }

  test(`${version}: legacy base and named responses`, async () => {
    for (const Constructor of [HttpError.bind(null, 414), UriTooLongError]) {
      for (const message of [undefined, 'TL;DR']) {
        await request(appFor(new Constructor(message)))
          .get('/')
          .expect('Content-Type', /json/)
          .expect(414, { message: message || 'URI Too Long' })
      }
    }
  })

  test(`${version}: ordinary errors and lookalike objects are forwarded`, async () => {
    for (const error of [new Error('ordinary'), { code: 404, message: 'lookalike' }]) {
      await request(appFor(error)).get('/').expect(599, { forwarded: error.message })
    }
  })

  test(`${version}: applies headers without adding metadata to default JSON`, async () => {
    const error = new TooManyRequestsError('Wait', {
      headers: { 'Retry-After': '60' },
      errorCode: 'RATE_LIMIT',
      cause: new Error('private'),
      details: { limit: 1 },
    })
    await request(appFor(error))
      .get('/')
      .expect('Retry-After', '60')
      .expect(429, { message: 'Wait' })
  })

  test(`${version}: configurable serializer and logger receive request context`, async () => {
    const original = new HttpError(422, 'Invalid email', {
      errorCode: 'INVALID_EMAIL',
      details: ['email'],
    })
    const seen = []
    const handler = createResponseErrorHandler({
      onError: (err, req) => seen.push([err, req.path]),
      serialize: (err, req) => ({
        message: err.message,
        errorCode: err.errorCode,
        details: err.details,
        path: req.path,
      }),
    })
    await request(appFor(original, handler))
      .get('/')
      .expect(422, {
        message: 'Invalid email',
        errorCode: 'INVALID_EMAIL',
        details: ['email'],
        path: '/',
      })
    assert.deepEqual(seen, [[original, '/']])
  })

  test(`${version}: exposure policies remove private fields before serialization`, async () => {
    const original = new HttpError(500, 'private database message', {
      errorCode: 'PRIVATE',
      details: 'secret',
      cause: new Error('private cause'),
      expose: true,
    })
    const handler = createResponseErrorHandler({
      expose: false,
      onError: err => assert.equal(err, original),
      serialize: err => {
        assert.equal(err.cause, undefined)
        assert.equal(err.details, undefined)
        assert.equal(err.errorCode, undefined)
        return { message: err.message }
      },
    })
    await request(appFor(original, handler))
      .get('/')
      .expect(500, { message: 'Internal Server Error' })
    assert.equal(original.message, 'private database message')
    await request(appFor(new HttpError(403, 'private', { expose: false })))
      .get('/')
      .expect(403, { message: 'Forbidden' })
    await request(appFor(original, createResponseErrorHandler({ expose: err => err.code < 500 })))
      .get('/')
      .expect(500, { message: 'Internal Server Error' })
  })

  test(`${version}: unknown error handling is opt in and hides original messages`, async () => {
    await request(
      appFor(new Error('secret'), createResponseErrorHandler({ handleUnknownErrors: true }))
    )
      .get('/')
      .expect(500, { message: 'Internal Server Error' })
  })

  test(`${version}: failures in custom callbacks reach the next handler`, async () => {
    for (const hook of ['serialize', 'onError', 'expose']) {
      const handler = createResponseErrorHandler({
        [hook]: () => {
          throw new Error('callback failed')
        },
      })
      await request(appFor(new HttpError(400), handler))
        .get('/')
        .expect(599, { forwarded: 'callback failed' })
    }
  })

  test(`${version}: non-Error callback failures are wrapped with their cause`, async () => {
    const handler = createResponseErrorHandler({
      serialize: () => {
        throw 'callback failure'
      },
    })
    await request(appFor(new HttpError(400), handler))
      .get('/')
      .expect(599, { forwarded: 'Error handler callback failed' })
  })
}

test('sent responses are forwarded without invoking callbacks or writing again', () => {
  const error = new HttpError(400)
  let forwarded
  const handler = createResponseErrorHandler({ onError: () => assert.fail('callback invoked') })
  handler(error, {}, { headersSent: true }, err => {
    forwarded = err
  })
  assert.equal(forwarded, error)
})

test('callbacks that send headers prevent a second response', () => {
  const error = new HttpError(400)
  const res = { headersSent: false }
  const handler = createResponseErrorHandler({
    onError: () => {
      res.headersSent = true
    },
  })
  let forwarded
  handler(error, {}, res, err => {
    forwarded = err
  })
  assert.equal(forwarded, error)
})
