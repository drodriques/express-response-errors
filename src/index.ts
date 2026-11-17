export { HttpError } from './http-error'
export type { HttpErrorConstructor, HttpErrorOptions } from './http-error'

export {
  BadGatewayError,
  BadRequestError,
  BandwidthLimitExceededError,
  ConflictError,
  ExpectationFailedError,
  FailedDependencyError,
  ForbiddenError,
  GatewayTimeoutError,
  GoneError,
  HttpVersionNotSupportedError,
  ImATeapotError,
  InsufficientStorageError,
  InternalServerError,
  LengthRequiredError,
  LockedError,
  LoopDetectedError,
  MethodNotAllowedError,
  MisdirectedRequestError,
  NetworkAuthenticationRequiredError,
  NotAcceptableError,
  NotExtendedError,
  NotFoundError,
  NotImplementedError,
  PayloadTooLargeError,
  PaymentRequiredError,
  PreconditionFailedError,
  PreconditionRequiredError,
  ProxyAuthenticationRequiredError,
  RangeNotSatisfiableError,
  RequestHeaderFieldsTooLargeError,
  RequestTimeoutError,
  ServiceUnavailableError,
  TooEarlyError,
  TooManyRequestsError,
  UnauthorizedError,
  UnavailableForLegalReasonsError,
  UnorderedCollectionError,
  UnprocessableEntityError,
  UnsupportedMediaTypeError,
  UpgradeRequiredError,
  UriTooLongError,
  VariantAlsoNegotiatesError,
} from './named-errors'
export type { NamedHttpErrorConstructor } from './named-errors'

export { createResponseErrorHandler, responseErrorHandler } from './middleware'
export type {
  ErrorNext,
  ErrorRequest,
  ErrorResponse,
  ResponseErrorHandler,
  ResponseErrorHandlerOptions,
} from './middleware'

export { problemDetailsSerializer } from './problem-details'
export type { ProblemDetails } from './problem-details'

export type { ErrorInput, JsonValue, ValidationIssue } from './types'

/** @deprecated Use responseErrorHandler. */
export { responseErrorHandler as httpErrorsMiddleware } from './middleware'
