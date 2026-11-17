import { validateHeaderName, validateHeaderValue } from 'node:http'
import { inherits } from 'node:util'
import { STATUS_MESSAGES } from './status-messages'
import type { ErrorInput, JsonValue } from './types'

export interface HttpErrorOptions<Details = JsonValue> {
  cause?: ErrorInput
  headers?: Readonly<Record<string, string>>
  errorCode?: string
  details?: Details
  /** Whether the message and public details may be returned to clients. */
  expose?: boolean
}

export interface HttpError<Details = JsonValue> extends Error {
  code: number
  readonly statusCode: number
  cause?: ErrorInput
  headers?: Readonly<Record<string, string>>
  errorCode?: string
  details?: Details
  expose?: boolean
}

export interface HttpErrorConstructor {
  <Details = JsonValue>(
    this: HttpError<Details>,
    code: number,
    message?: string,
    options?: HttpErrorOptions<Details>
  ): void
  new <Details = JsonValue>(
    code: number,
    message?: string,
    options?: HttpErrorOptions<Details>
  ): HttpError<Details>
  readonly prototype: HttpError
  readonly super_: ErrorConstructor
}

/** Function constructors retain compatibility with util.inherits and .call(). */
export const HttpError: HttpErrorConstructor = Object.assign(
  function HttpError<Details = JsonValue>(
    this: HttpError<Details>,
    code: number,
    message = '',
    options: HttpErrorOptions<Details> = {}
  ): void {
    if (!Number.isInteger(code) || code < 400 || code > 511) {
      throw new RangeError('Invalid HTTP status error code.')
    }

    this.code = code
    this.message = message || STATUS_MESSAGES[code] || 'HTTP Error'

    if ('cause' in options) {
      Object.defineProperty(this, 'cause', {
        value: options.cause,
        writable: true,
        configurable: true,
      })
    }

    if (options.headers !== undefined) {
      const headers = { ...options.headers }

      for (const [name, value] of Object.entries(headers)) {
        if (typeof value !== 'string') {
          throw new TypeError('HTTP error header values must be strings.')
        }

        validateHeaderName(name)
        validateHeaderValue(name, value)
      }
      this.headers = Object.freeze(headers)
    }

    if (options.errorCode !== undefined) {
      this.errorCode = options.errorCode
    }

    if (options.details !== undefined) {
      this.details = options.details
    }

    if (options.expose !== undefined) {
      this.expose = options.expose
    }

    Error.captureStackTrace(this, HttpError)
  },
  { super_: Error }
) as HttpErrorConstructor

inherits(HttpError, Error)
HttpError.prototype.name = 'HttpError'
Object.defineProperty(HttpError.prototype, 'statusCode', {
  get(this: HttpError): number {
    return this.code
  },
  configurable: true,
})
