const { test } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const { HttpError, ConflictError, createResponseErrorHandler } = require('..')

for (const version of ['express4', 'express']) {
  const express = require(version)

  const appFor = (error, options) => {
    const app = express()
    app.get('/', (_req, _res, next) => next(error))
    app.use(createResponseErrorHandler(options))
    app.use((err, _req, res, next) => {
      if (res.headersSent) {
        return next(err)
      }

      res.status(599).json({ forwarded: err.message })
    })

    return app
  }

  test(`${version}: normalization maps application errors and logs the original`, async () => {
    const original = Object.assign(new Error('Database constraint failed'), { code: '23505' })
    let logged
    const options = {
      normalizeError: (error, req) => {
        assert.equal(error, original)
        assert.equal(req.path, '/')

        return new ConflictError('Account already exists', {
          cause: error,
          errorCode: 'ACCOUNT_EXISTS',
          headers: { 'Cache-Control': 'no-store' },
        })
      },
      onError: error => {
        logged = error
      },
      serialize: error => ({ message: error.message, errorCode: error.errorCode }),
    }

    await request(appFor(original, options))
      .get('/')
      .expect('Cache-Control', 'no-store')
      .expect(409, { message: 'Account already exists', errorCode: 'ACCOUNT_EXISTS' })
    assert.equal(logged, original)
    assert.equal(original.message, 'Database constraint failed')
  })

  test(`${version}: existing HTTP errors bypass normalization`, async () => {
    await request(
      appFor(new HttpError(404, 'Missing'), {
        normalizeError: () => assert.fail('Existing errors must not be remapped'),
      })
    )
      .get('/')
      .expect(404, { message: 'Missing' })
  })

  test(`${version}: unmapped errors follow the existing delegation policy`, async () => {
    const original = new Error('Unmapped failure')

    await request(
      appFor(original, {
        normalizeError: () => undefined,
        onError: () => assert.fail('Delegated errors must not be logged here'),
      })
    )
      .get('/')
      .expect(599, { forwarded: 'Unmapped failure' })

    await request(
      appFor(original, {
        normalizeError: () => undefined,
        handleUnknownErrors: true,
      })
    )
      .get('/')
      .expect(500, { message: 'Internal Server Error' })
  })

  test(`${version}: normalized errors still obey the exposure policy`, async () => {
    await request(
      appFor(new Error('Private source'), {
        normalizeError: () =>
          new ConflictError('Private mapping', {
            expose: false,
            errorCode: 'PRIVATE',
            details: { private: true },
          }),
        serialize: error => {
          assert.equal(error.errorCode, undefined)
          assert.equal(error.details, undefined)

          return { message: error.message }
        },
      })
    )
      .get('/')
      .expect(409, { message: 'Conflict' })
  })

  test(`${version}: invalid normalization results and callback failures are delegated`, async () => {
    const invalidResult = 'normalizeError must return an HttpError or undefined.'

    for (const [normalizeError, expected] of [
      [() => ({ code: 409, message: 'Not an HttpError' }), invalidResult],
      [async () => new ConflictError(), invalidResult],
      [
        () => {
          throw new Error('Mapping failed')
        },
        'Mapping failed',
      ],
    ]) {
      const app = appFor(new Error('Original'), { normalizeError })
      const response = await request(app).get('/').expect(599)
      assert.equal(response.body.forwarded, expected)
    }
  })
}

test('normalization does not run after response headers have been sent', () => {
  const original = new Error('Original')
  let forwarded
  const handler = createResponseErrorHandler({ normalizeError: () => assert.fail('Already sent') })
  handler(original, {}, { headersSent: true }, error => {
    forwarded = error
  })
  assert.equal(forwarded, original)
})
