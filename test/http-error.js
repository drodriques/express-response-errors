const assert = require('chai').assert

const { HttpError, ImATeapotError } = require('..')

describe('HttpError', () => {
  let httpErrorInstance

  before(() => {
    httpErrorInstance = new ImATeapotError()
  })

  it('should be instance of Error', done => {
    assert.instanceOf(httpErrorInstance, Error)
    done()
  })

  it('should be instance of HttpError', done => {
    assert.instanceOf(httpErrorInstance, HttpError)
    done()
  })

  it('should be instance of ImATeapotError', done => {
    assert.instanceOf(httpErrorInstance, ImATeapotError)
    done()
  })

  it('should have name of custom class', done => {
    assert.strictEqual(httpErrorInstance.name, 'ImATeapotError')
    done()
  })

  it('should have message set to default value', done => {
    const { message } = httpErrorInstance
    assert.strictEqual(message, 'I\'m a Teapot')
    done()
  })

  it('should have message set to custom value', done => {
    const err = new ImATeapotError('I only brew tea')
    assert.strictEqual(err.message, 'I only brew tea')
    done()
  })

  it('should have code set to default value', done => {
    const { code } = httpErrorInstance
    assert.strictEqual(code, 418)
    done()
  })

  it('should set a value for stack', done => {
    const { stack } = httpErrorInstance
    assert(stack)
    done()
  })

  it('should have method toString', done => {
    assert.typeOf(httpErrorInstance.toString, 'function')
    done()
  })
})
