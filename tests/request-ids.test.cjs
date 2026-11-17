const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const request = require('supertest')
const errors = require('..')

const guide = fs.readFileSync(path.join(__dirname, '../docs/user_guide.md'), 'utf8')
const section = guide.split('## Include request IDs\n')[1].split('\n## ')[0]
const example = section.match(/```js\n([\s\S]*?)\n```/)[1]

for (const version of ['express4', 'express']) {
  const express = require(version)

  test(`${version}: the guide correlates response headers, body and logs per request`, async () => {
    const middleware = []
    const logs = []
    vm.runInNewContext(example, {
      require: name => {
        if (name === 'express-response-errors') {
          return errors
        }

        assert.equal(name, 'node:crypto')
        return require('node:crypto')
      },
      app: { use: handler => middleware.push(handler) },
      console: { error: (...args) => logs.push(args) },
    })
    assert.equal(middleware.length, 2)
    const original = new errors.NotFoundError('Missing')
    const app = express()
    app.use(middleware[0])
    app.get('/', (_req, _res, next) => next(original))
    app.use(middleware[1])

    const ids = []

    for (let i = 0; i < 2; i++) {
      const response = await request(app).get('/').expect(404)
      const id = response.headers['x-request-id']
      assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      assert.deepEqual(response.body, { message: 'Missing', requestId: id })
      assert.equal(logs[i][0], id)
      assert.equal(logs[i][1], original)
      ids.push(id)
    }

    assert.notEqual(ids[0], ids[1])
    assert.equal(original.message, 'Missing')
  })
}
