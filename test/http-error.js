const assert = require('chai').assert

const { HttpError, ImATeapotError } = require('..')

describe('HttpError', () => {
  let httpErrorInstance

  before(() => {
    httpErrorInstance = new ImATeapotError()
  })

  it('should be instance of Error', () => {
    assert.instanceOf(httpErrorInstance, Error)
  })

  it('should be instance of HttpError', () => {
    assert.instanceOf(httpErrorInstance, HttpError)
  })

  it('should be instance of ImATeapotError', () => {
    assert.instanceOf(httpErrorInstance, ImATeapotError)
  })

  it('should have name of custom class', () => {
    assert.strictEqual(httpErrorInstance.name, 'ImATeapotError')
  })

  it('should have message set to default value', () => {
    assert.strictEqual(httpErrorInstance.message, 'I\'m a Teapot')
  })

  it('should have message set to custom value', () => {
    const { message } = new ImATeapotError('I only brew tea')
    assert.strictEqual(message, 'I only brew tea')
  })

  it('should have code set to default value', () => {
    assert.strictEqual(httpErrorInstance.code, 418)
  })

  it('should set a value for stack', () => {
    assert(httpErrorInstance.stack)
  })

  it('should have method toString', () => {
    assert.typeOf(httpErrorInstance.toString, 'function')
  })
})
