import { inherits } from 'node:util'
import { HttpError } from './http-error'
import type { HttpErrorConstructor, HttpErrorOptions } from './http-error'
import type { JsonValue } from './types'

export interface NamedHttpErrorConstructor {
  <Details = JsonValue>(
    this: HttpError<Details>,
    message?: string,
    options?: HttpErrorOptions<Details>
  ): void
  new <Details = JsonValue>(
    message?: string,
    options?: HttpErrorOptions<Details>
  ): HttpError<Details>
  readonly prototype: HttpError
  readonly super_: HttpErrorConstructor
}

function namedError(name: string, code: number): NamedHttpErrorConstructor {
  const Constructor = Object.assign(
    function <Details = JsonValue>(
      this: HttpError<Details>,
      message = '',
      options: HttpErrorOptions<Details> = {}
    ): void {
      // Keep the same base constructor for root and legacy imports.
      Reflect.apply(HttpError, this, [code, message, options])
    },
    { super_: HttpError }
  ) as NamedHttpErrorConstructor

  inherits(Constructor, HttpError)
  Constructor.prototype.name = name

  return Constructor
}

export const BadGatewayError = namedError('BadGatewayError', 502)
export type BadGatewayError<Details = JsonValue> = HttpError<Details>

export const BadRequestError = namedError('BadRequestError', 400)
export type BadRequestError<Details = JsonValue> = HttpError<Details>

export const BandwidthLimitExceededError = namedError('BandwidthLimitExceededError', 509)
export type BandwidthLimitExceededError<Details = JsonValue> = HttpError<Details>

export const ConflictError = namedError('ConflictError', 409)
export type ConflictError<Details = JsonValue> = HttpError<Details>

export const ExpectationFailedError = namedError('ExpectationFailedError', 417)
export type ExpectationFailedError<Details = JsonValue> = HttpError<Details>

export const FailedDependencyError = namedError('FailedDependencyError', 424)
export type FailedDependencyError<Details = JsonValue> = HttpError<Details>

export const ForbiddenError = namedError('ForbiddenError', 403)
export type ForbiddenError<Details = JsonValue> = HttpError<Details>

export const GatewayTimeoutError = namedError('GatewayTimeoutError', 504)
export type GatewayTimeoutError<Details = JsonValue> = HttpError<Details>

export const GoneError = namedError('GoneError', 410)
export type GoneError<Details = JsonValue> = HttpError<Details>

export const HttpVersionNotSupportedError = namedError('HttpVersionNotSupportedError', 505)
export type HttpVersionNotSupportedError<Details = JsonValue> = HttpError<Details>

export const ImATeapotError = namedError('ImATeapotError', 418)
export type ImATeapotError<Details = JsonValue> = HttpError<Details>

export const InsufficientStorageError = namedError('InsufficientStorageError', 507)
export type InsufficientStorageError<Details = JsonValue> = HttpError<Details>

export const InternalServerError = namedError('InternalServerError', 500)
export type InternalServerError<Details = JsonValue> = HttpError<Details>

export const LengthRequiredError = namedError('LengthRequiredError', 411)
export type LengthRequiredError<Details = JsonValue> = HttpError<Details>

export const LockedError = namedError('LockedError', 423)
export type LockedError<Details = JsonValue> = HttpError<Details>

export const LoopDetectedError = namedError('LoopDetectedError', 508)
export type LoopDetectedError<Details = JsonValue> = HttpError<Details>

export const MethodNotAllowedError = namedError('MethodNotAllowedError', 405)
export type MethodNotAllowedError<Details = JsonValue> = HttpError<Details>

export const MisdirectedRequestError = namedError('MisdirectedRequestError', 421)
export type MisdirectedRequestError<Details = JsonValue> = HttpError<Details>

export const NetworkAuthenticationRequiredError = namedError(
  'NetworkAuthenticationRequiredError',
  511
)
export type NetworkAuthenticationRequiredError<Details = JsonValue> = HttpError<Details>

export const NotAcceptableError = namedError('NotAcceptableError', 406)
export type NotAcceptableError<Details = JsonValue> = HttpError<Details>

export const NotExtendedError = namedError('NotExtendedError', 510)
export type NotExtendedError<Details = JsonValue> = HttpError<Details>

export const NotFoundError = namedError('NotFoundError', 404)
export type NotFoundError<Details = JsonValue> = HttpError<Details>

export const NotImplementedError = namedError('NotImplementedError', 501)
export type NotImplementedError<Details = JsonValue> = HttpError<Details>

export const PayloadTooLargeError = namedError('PayloadTooLargeError', 413)
export type PayloadTooLargeError<Details = JsonValue> = HttpError<Details>

export const PaymentRequiredError = namedError('PaymentRequiredError', 402)
export type PaymentRequiredError<Details = JsonValue> = HttpError<Details>

export const PreconditionFailedError = namedError('PreconditionFailedError', 412)
export type PreconditionFailedError<Details = JsonValue> = HttpError<Details>

export const PreconditionRequiredError = namedError('PreconditionRequiredError', 428)
export type PreconditionRequiredError<Details = JsonValue> = HttpError<Details>

export const ProxyAuthenticationRequiredError = namedError('ProxyAuthenticationRequiredError', 407)
export type ProxyAuthenticationRequiredError<Details = JsonValue> = HttpError<Details>

export const RangeNotSatisfiableError = namedError('RangeNotSatisfiableError', 416)
export type RangeNotSatisfiableError<Details = JsonValue> = HttpError<Details>

export const RequestHeaderFieldsTooLargeError = namedError('RequestHeaderFieldsTooLargeError', 431)
export type RequestHeaderFieldsTooLargeError<Details = JsonValue> = HttpError<Details>

export const RequestTimeoutError = namedError('RequestTimeoutError', 408)
export type RequestTimeoutError<Details = JsonValue> = HttpError<Details>

export const ServiceUnavailableError = namedError('ServiceUnavailableError', 503)
export type ServiceUnavailableError<Details = JsonValue> = HttpError<Details>

export const TooEarlyError = namedError('TooEarlyError', 425)
export type TooEarlyError<Details = JsonValue> = HttpError<Details>

export const TooManyRequestsError = namedError('TooManyRequestsError', 429)
export type TooManyRequestsError<Details = JsonValue> = HttpError<Details>

export const UnauthorizedError = namedError('UnauthorizedError', 401)
export type UnauthorizedError<Details = JsonValue> = HttpError<Details>

export const UnavailableForLegalReasonsError = namedError('UnavailableForLegalReasonsError', 451)
export type UnavailableForLegalReasonsError<Details = JsonValue> = HttpError<Details>

/** @deprecated Historical name for status 425; prefer TooEarlyError. */
export const UnorderedCollectionError = namedError('UnorderedCollectionError', 425)
export type UnorderedCollectionError<Details = JsonValue> = HttpError<Details>

export const UnprocessableEntityError = namedError('UnprocessableEntityError', 422)
export type UnprocessableEntityError<Details = JsonValue> = HttpError<Details>

export const UnsupportedMediaTypeError = namedError('UnsupportedMediaTypeError', 415)
export type UnsupportedMediaTypeError<Details = JsonValue> = HttpError<Details>

export const UpgradeRequiredError = namedError('UpgradeRequiredError', 426)
export type UpgradeRequiredError<Details = JsonValue> = HttpError<Details>

export const UriTooLongError = namedError('UriTooLongError', 414)
export type UriTooLongError<Details = JsonValue> = HttpError<Details>

export const VariantAlsoNegotiatesError = namedError('VariantAlsoNegotiatesError', 506)
export type VariantAlsoNegotiatesError<Details = JsonValue> = HttpError<Details>
