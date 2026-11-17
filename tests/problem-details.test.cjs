const { test } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const {
  HttpError,
  NotFoundError,
  UnprocessableEntityError,
  createResponseErrorHandler,
  problemDetailsSerializer,
} = require('..')

for (const version of ['express4', 'express']) {
  const express = require(version)

  const appFor = (error, options = {}) => {
    const app = express()
    app.get('/', (_req, _res, next) => next(error))
    app.use(createResponseErrorHandler({ serialize: problemDetailsSerializer, ...options }))

    return app
  }

  test(`${version}: optional Problem Details uses the matching HTTP status and media type`, async () => {
    await request(appFor(new NotFoundError('Account not found')))
      .get('/')
      .expect('Content-Type', /application\/problem\+json/)
      .expect(404, {
        type: 'about:blank',
        title: 'Not Found',
        status: 404,
        detail: 'Account not found',
      })
  })

  test(`${version}: validation details are public extensions and causes stay private`, async () => {
    const issues = [{ field: 'email', message: 'Required', code: 'required' }]
    const error = new UnprocessableEntityError('Validation failed', {
      errorCode: 'VALIDATION_FAILED',
      details: issues,
      cause: new Error('Private validation input'),
    })

    await request(appFor(error)).get('/').expect(422, {
      type: 'about:blank',
      title: 'Unprocessable Entity',
      status: 422,
      detail: 'Validation failed',
      errorCode: 'VALIDATION_FAILED',
      details: issues,
    })
  })

  test(`${version}: exposure and generic fallback protect Problem Details responses`, async () => {
    const privateError = new HttpError(500, 'Database credentials', {
      expose: false,
      details: { password: 'secret' },
      errorCode: 'PRIVATE',
    })
    const expected = {
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Internal Server Error',
    }

    await request(appFor(privateError)).get('/').expect(500, expected)
    await request(appFor(new Error('Private raw error'), { handleUnknownErrors: true }))
      .get('/')
      .expect(500, expected)
  })

  test(`${version}: serializer selects the media type while preserving other headers`, async () => {
    const error = new HttpError(429, 'Wait', {
      headers: { 'Content-Type': 'text/plain', 'Retry-After': '60' },
    })

    await request(appFor(error))
      .get('/')
      .expect('Content-Type', /application\/problem\+json/)
      .expect('Retry-After', '60')
      .expect(429)
  })

  test(`${version}: normalized errors can use Problem Details`, async () => {
    await request(
      appFor(new Error('Original service failure'), {
        normalizeError: error => new HttpError(409, 'Account already exists', { cause: error }),
      })
    )
      .get('/')
      .expect(409, {
        type: 'about:blank',
        title: 'Conflict',
        status: 409,
        detail: 'Account already exists',
      })
  })

  test(`${version}: applications can add an instance URI without changing standard fields`, async () => {
    const app = appFor(new HttpError(400, 'Invalid'), {
      serialize: (error, req, res) => ({
        ...problemDetailsSerializer(error, req, res),
        instance: 'urn:uuid:example',
      }),
    })
    const response = await request(app).get('/').expect(400)
    assert.equal(response.body.instance, 'urn:uuid:example')
    assert.equal(response.body.type, 'about:blank')
  })
}
