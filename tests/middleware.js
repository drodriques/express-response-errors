const express = require('express')
const http = require('http')
const request = require('supertest')

const {
  HttpError,
  responseErrorHandler,
  UriTooLongError
} = require('..')

const HTTP_URI_TOO_LONG = 414
const SERVER_PORT = 3000

function testResponse (server, code, message, done) {
  request(server)
    .get('/')
    .expect(code, { message }, done)
}

describe('Middleware', () => {
  let app
  let server

  beforeEach(() => {
    app = express()
    server = http.createServer(app)
    server.listen(SERVER_PORT)
  })

  afterEach(done => {
    server.close(done)
  })

  describe('Base Exception', () => {
    it('should set code and default message', done => {
      const handler = (req, res, next) => {
        next(new HttpError(HTTP_URI_TOO_LONG))
      }

      app.get('/', handler, responseErrorHandler)

      testResponse(server, HTTP_URI_TOO_LONG, 'URI Too Long', done)
    })

    it('should set code and custom message', done => {
      const handler = (req, res, next) => {
        next(new HttpError(HTTP_URI_TOO_LONG, 'TL;DR'))
      }

      app.get('/', handler, responseErrorHandler)

      testResponse(server, HTTP_URI_TOO_LONG, 'TL;DR', done)
    })
  })

  describe('Http specific exceptions', () => {
    it('should set code and default message', done => {
      const handler = (req, res, next) => {
        next(new UriTooLongError())
      }

      app.get('/', handler, responseErrorHandler)

      testResponse(server, HTTP_URI_TOO_LONG, 'URI Too Long', done)
    })

    it('should set code and custom message', done => {
      const handler = (req, res, next) => {
        next(new UriTooLongError('TL;DR'))
      }

      app.get('/', handler, responseErrorHandler)

      testResponse(server, HTTP_URI_TOO_LONG, 'TL;DR', done)
    })
  })
})
