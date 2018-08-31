const express = require('express')
const http = require('http')
const request = require('supertest')

const { HttpError, httpErrorsMiddleware, UriTooLongError } = require('..')

const HTTP_URI_TOO_LONG_CODE = 414
const SERVER_PORT = 3000

function testResponse (server, code, message, done) {
  request(server)
    .get('/')
    .expect(code, { message }, done)
}

describe('Middleware', () => {
  let app
  let router
  let server

  beforeEach(() => {
    app = express()
    router = new express.Router()
    server = http.createServer(app)
    server.listen(SERVER_PORT)
  })

  afterEach(() => {
    server.close()
  })

  describe('Base Exception', () => {
    it('should set code and default message', (done) => {
      const handler = () => {
        throw new HttpError(HTTP_URI_TOO_LONG_CODE)
      }

      app.get('/', router, handler, httpErrorsMiddleware)

      testResponse(server, HTTP_URI_TOO_LONG_CODE, 'URI Too Long', done)
    })

    it('should set code and custom message', (done) => {
      const handler = () => {
        throw new HttpError(HTTP_URI_TOO_LONG_CODE, 'TL;DR')
      }

      app.get('/', router, handler, httpErrorsMiddleware)

      testResponse(server, HTTP_URI_TOO_LONG_CODE, 'TL;DR', done)
    })
  })

  describe('Custom Exceptions', () => {
    it('should set code and default message', (done) => {
      const handler = () => {
        throw new UriTooLongError()
      }

      app.get('/', router, handler, httpErrorsMiddleware)

      testResponse(server, HTTP_URI_TOO_LONG_CODE, 'URI Too Long', done)
    })

    it('should set code and custom message', (done) => {
      const handler = () => {
        throw new UriTooLongError('TL;DR')
      }

      app.get('/', router, handler, httpErrorsMiddleware)

      testResponse(server, HTTP_URI_TOO_LONG_CODE, 'TL;DR', done)
    })
  })
})
