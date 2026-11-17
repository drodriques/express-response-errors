const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const request = require('supertest')
const errors = require('..')

// Execute the actual guide example so the documented configuration stays usable.
const guide = fs.readFileSync(path.join(__dirname, '../docs/user_guide.md'), 'utf8')
const section = guide.split('## Localize responses\n')[1].split('\n## ')[0]
const example = section.match(/```js\n([\s\S]*?)\n```/)[1]
const spanish = section.match(/```js\n(messages\.es = [\s\S]*?)\n```/)[1]

function configureExample(includeSpanish = true) {
  let handler
  const context = {
    require: name => {
      assert.equal(name, 'express-response-errors')
      return errors
    },
    app: {
      use: middleware => {
        handler = middleware
      },
    },
  }
  const setup = includeSpanish ? spanish : ''
  const messages = vm.runInNewContext(`${example}\n${setup}\nmessages`, context)

  return { handler, messages }
}

for (const version of ['express4', 'express']) {
  const express = require(version)

  const appFor = (error, handler) => {
    const app = express()

    app.use((_req, res, next) => {
      res.vary('Accept-Encoding')
      res.vary('Accept-Language')
      next()
    })
    app.get('/', (_req, _res, next) => next(error))
    app.use(handler)

    return app
  }

  test(`${version}: English is the only configured language by default`, async () => {
    const { handler, messages } = configureExample(false)
    assert.deepEqual(Object.keys(messages), ['en'])
    const error = new errors.NotFoundError('Original message', { errorCode: 'ACCOUNT_MISSING' })

    await request(appFor(error, handler))
      .get('/')
      .set('Accept-Language', 'es')
      .expect(404, { message: 'Account not found' })
    assert.equal(error.message, 'Original message')
  })

  test(`${version}: application catalogs follow language weights, regions and fallbacks`, async () => {
    const { handler } = configureExample()
    const error = new errors.NotFoundError('Original message', { errorCode: 'ACCOUNT_MISSING' })
    const app = appFor(error, handler)
    const scenarios = [
      [undefined, 'Account not found'],
      ['es', 'Cuenta no encontrada'],
      ['es-MX', 'Cuenta no encontrada'],
      ['es;q=0.2,en;q=0.9', 'Account not found'],
      ['en;q=0.2,es;q=0.9', 'Cuenta no encontrada'],
      ['fr', 'Account not found'],
    ]

    await Promise.all(
      scenarios.map(async ([header, message]) => {
        const call = request(app).get('/')

        if (header) {
          call.set('Accept-Language', header)
        }

        await call.expect('Vary', 'Accept-Encoding, Accept-Language').expect(404, { message })
      })
    )
    assert.equal(error.message, 'Original message')
  })

  test(`${version}: missing keys fall back without changing unkeyed messages`, async () => {
    const { handler, messages } = configureExample()
    messages.en.ENGLISH_ONLY = 'English fallback'
    const scenarios = [
      [new errors.NotFoundError('Original', { errorCode: 'ENGLISH_ONLY' }), 'English fallback'],
      [new errors.NotFoundError('Original', { errorCode: 'MISSING_KEY' }), 'Original'],
      [new errors.NotFoundError('Original', { errorCode: 'toString' }), 'Original'],
      [new errors.NotFoundError('Custom message'), 'Custom message'],
      [new errors.NotFoundError(), 'Not Found'],
    ]

    for (const [error, message] of scenarios) {
      await request(appFor(error, handler))
        .get('/')
        .set('Accept-Language', 'es')
        .expect(404, { message })
    }
  })

  test(`${version}: localization preserves hidden messages and omits private metadata`, async () => {
    const { handler } = configureExample()
    const error = new errors.ForbiddenError('Private account information', {
      errorCode: 'ACCOUNT_MISSING',
      expose: false,
      cause: new Error('Private cause'),
      details: { private: true },
    })

    await request(appFor(error, handler))
      .get('/')
      .set('Accept-Language', 'es')
      .expect(403, { message: 'Forbidden' })
    assert.equal(error.message, 'Private account information')
    assert.equal(error.errorCode, 'ACCOUNT_MISSING')
  })
}
