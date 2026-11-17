import express = require('express')
import errors = require('../..')
import { HttpError, NotFoundError, createResponseErrorHandler, httpErrorsMiddleware } from '../..'
import type { HttpError as ErrorInstance } from '../../types'
import type { JsonValue, ErrorInput, NamedHttpErrorConstructor } from '../..'
import { ConflictError, problemDetailsSerializer, UnprocessableEntityError } from '../..'
import type { ErrorResponse, ProblemDetails, ValidationIssue } from '../..'

const app = express()
const error: ErrorInstance = new HttpError(404)
const named: NotFoundError = new NotFoundError('Missing')
const NamedConstructor: NamedHttpErrorConstructor = NotFoundError
const namedFromConstructor: NotFoundError = new NamedConstructor('Missing')
const typed = new errors.BadRequestError('Invalid', { details: [{ field: 'email' }] })
if (!typed.details) {
  throw new Error('Missing details')
}
const field: string = typed.details[0].field
class AccountMissingError extends NotFoundError {}
const custom: HttpError = new AccountMissingError('Missing')
const handler: express.ErrorRequestHandler = errors.responseErrorHandler
app.use(handler)
app.use(httpErrorsMiddleware)

const messages: Record<string, Record<string, string>> = {
  en: { ACCOUNT_MISSING: 'Account not found' },
}

function getMessage(language: string, key?: string): string | undefined {
  if (!key) {
    return undefined
  }

  const dictionary = messages[language]

  if (!dictionary || !Object.hasOwn(dictionary, key)) {
    return undefined
  }

  return dictionary[key]
}

app.use(
  createResponseErrorHandler<express.Request>({
    serialize: (error, req) => {
      const language = req.acceptsLanguages(Object.keys(messages)) || 'en'
      const key = error.errorCode
      const message = getMessage(language, key) ?? getMessage('en', key) ?? error.message

      return { message }
    },
  })
)

app.use(
  createResponseErrorHandler<express.Request>({
    expose: err => err.code < 500,
    onError: (err, req) => {
      console.log(err, req.path)
    },
    serialize: (err, req) => ({ message: err.message, path: req.path }),
  })
)
console.log(error, named, namedFromConstructor, field, custom)

const body: JsonValue = { fields: [{ name: 'email', valid: false }] }
const failure: ErrorInput = new Error('Failure')
const customCause = new HttpError(500, '', { cause: { service: 'database' } })
console.log(body, failure, customCause)

const issues: ValidationIssue[] = [{ field: 'email', message: 'Required', code: 'required' }]
const invalid: HttpError = new UnprocessableEntityError('Validation failed', { details: issues })
const problemSerializer: (
  error: HttpError,
  req: express.Request,
  res: ErrorResponse
) => ProblemDetails = problemDetailsSerializer

app.use(
  createResponseErrorHandler<express.Request>({
    normalizeError: (error, req) => {
      if (error instanceof Error && req.path === '/accounts') {
        return new ConflictError('Account exists', { cause: error })
      }

      return undefined
    },
    serialize: problemSerializer,
  })
)

type CorrelatedRequest = express.Request & { requestId?: string }

app.use(
  createResponseErrorHandler<CorrelatedRequest>({
    onError: (error, req) => {
      console.log(req.requestId, error)
    },
    serialize: (error, req, res) => ({
      ...problemDetailsSerializer(error, req, res),
      requestId: req.requestId,
    }),
  })
)
console.log(invalid)

// @ts-expect-error Normalization must return an HttpError instance
createResponseErrorHandler({ normalizeError: () => ({ code: 409 }) })
// @ts-expect-error Normalization hooks are synchronous
createResponseErrorHandler({ normalizeError: async () => new ConflictError() })
// @ts-expect-error Validation fields must be strings
const invalidIssue: ValidationIssue = { field: 1, message: 'Required' }
console.log(invalidIssue)

// @ts-expect-error Serializers must return JSON-compatible bodies
createResponseErrorHandler({ serialize: () => () => 'not JSON' })
// @ts-expect-error Calling the constructor without new requires an initialized instance
HttpError(404)
// @ts-expect-error HTTP codes must be numeric
new HttpError('404')
// @ts-expect-error Messages must be strings
new NotFoundError(404)
// @ts-expect-error Header values must be strings
new HttpError(429, '', { headers: { 'Retry-After': 60 } })
