// Type definitions for express-response-errors 1.0.3
// Project: https://github.com/drodriques/express-response-errors.git
// Definitions by: Dwight Rodriques <drodriques@gmail.com>

// Base Error

interface HttpError extends Error {
  new (code: number, message?: string): HttpError;
  code: number;
  readonly prototype: HttpError;
}

export const HttpError: HttpError;

// Named Errors

interface NamedHttpErrorConstructor<T> {
  new (message?: string): T;
  readonly prototype: T;
}

interface BadGatewayError extends HttpError {}
interface BadRequestError extends HttpError {}
interface BandwidthLimitExceededError extends HttpError {}
interface ConflictError extends HttpError {}
interface ExpectationFailedError extends HttpError {}
interface FailedDependencyError extends HttpError {}
interface ForbiddenError extends HttpError {}
interface GatewayTimeoutError extends HttpError {}
interface GoneError extends HttpError {}
interface HttpVersionNotSupportedError extends HttpError {}
interface ImATeapotError extends HttpError {}
interface InsufficientStorageError extends HttpError {}
interface InternalServerError extends HttpError {}
interface LengthRequiredError extends HttpError {}
interface LockedError extends HttpError {}
interface LoopDetectedError extends HttpError {}
interface MethodNotAllowedError extends HttpError {}
interface MisdirectedRequestError extends HttpError {}
interface NetworkAuthenticationRequiredError extends HttpError {}
interface NotAcceptableError extends HttpError {}
interface NotExtendedError extends HttpError {}
interface NotFoundError extends HttpError {}
interface NotImplementedError extends HttpError {}
interface PayloadTooLargeError extends HttpError {}
interface PaymentRequiredError extends HttpError {}
interface PreconditionFailedError extends HttpError {}
interface PreconditionRequiredError extends HttpError {}
interface ProxyAuthenticationRequiredError extends HttpError {}
interface RangeNotSatisfiableError extends HttpError {}
interface RequestHeaderFieldsTooLargeError extends HttpError {}
interface RequestTimeoutError extends HttpError {}
interface ServiceUnavailableError extends HttpError {}
interface TooManyRequestsError extends HttpError {}
interface UnauthorizedError extends HttpError {}
interface UnavailableForLegalReasonsError extends HttpError {}
interface UnorderedCollectionError extends HttpError {}
interface UnprocessableEntityError extends HttpError {}
interface UnsupportedMediaTypeError extends HttpError {}
interface UpgradeRequiredError extends HttpError {}
interface UriTooLongError extends HttpError {}
interface VariantAlsoNegotiatesError extends HttpError {}

export const BadGatewayError: NamedHttpErrorConstructor<BadGatewayError>;
export const BadRequestError: NamedHttpErrorConstructor<BadRequestError>;
export const BandwidthLimitExceededError: NamedHttpErrorConstructor<BandwidthLimitExceededError>;
export const ConflictError: NamedHttpErrorConstructor<ConflictError>;
export const ExpectationFailedError: NamedHttpErrorConstructor<ExpectationFailedError>;
export const FailedDependencyError: NamedHttpErrorConstructor<FailedDependencyError>;
export const ForbiddenError: NamedHttpErrorConstructor<ForbiddenError>;
export const GatewayTimeoutError: NamedHttpErrorConstructor<GatewayTimeoutError>;
export const GoneError: NamedHttpErrorConstructor<GoneError>;
export const HttpVersionNotSupportedError: NamedHttpErrorConstructor<HttpVersionNotSupportedError>;
export const ImATeapotError: NamedHttpErrorConstructor<ImATeapotError>;
export const InsufficientStorageError: NamedHttpErrorConstructor<InsufficientStorageError>;
export const InternalServerError: NamedHttpErrorConstructor<InternalServerError>;
export const LengthRequiredError: NamedHttpErrorConstructor<LengthRequiredError>;
export const LockedError: NamedHttpErrorConstructor<LockedError>;
export const LoopDetectedError: NamedHttpErrorConstructor<LoopDetectedError>;
export const MethodNotAllowedError: NamedHttpErrorConstructor<MethodNotAllowedError>;
export const MisdirectedRequestError: NamedHttpErrorConstructor<MisdirectedRequestError>;
export const NetworkAuthenticationRequiredError: NamedHttpErrorConstructor<NetworkAuthenticationRequiredError>;
export const NotAcceptableError: NamedHttpErrorConstructor<NotAcceptableError>;
export const NotExtendedError: NamedHttpErrorConstructor<NotExtendedError>;
export const NotFoundError: NamedHttpErrorConstructor<NotFoundError>;
export const NotImplementedError: NamedHttpErrorConstructor<NotImplementedError>;
export const PayloadTooLargeError: NamedHttpErrorConstructor<PayloadTooLargeError>;
export const PaymentRequiredError: NamedHttpErrorConstructor<PaymentRequiredError>;
export const PreconditionFailedError: NamedHttpErrorConstructor<PreconditionFailedError>;
export const PreconditionRequiredError: NamedHttpErrorConstructor<PreconditionRequiredError>;
export const ProxyAuthenticationRequiredError: NamedHttpErrorConstructor<ProxyAuthenticationRequiredError>;
export const RangeNotSatisfiableError: NamedHttpErrorConstructor<RangeNotSatisfiableError>;
export const RequestHeaderFieldsTooLargeError: NamedHttpErrorConstructor<RequestHeaderFieldsTooLargeError>;
export const RequestTimeoutError: NamedHttpErrorConstructor<RequestTimeoutError>;
export const ServiceUnavailableError: NamedHttpErrorConstructor<ServiceUnavailableError>;
export const TooManyRequestsError: NamedHttpErrorConstructor<TooManyRequestsError>;
export const UnauthorizedError: NamedHttpErrorConstructor<UnauthorizedError>;
export const UnavailableForLegalReasonsError: NamedHttpErrorConstructor<UnavailableForLegalReasonsError>;
export const UnorderedCollectionError: NamedHttpErrorConstructor<UnorderedCollectionError>;
export const UnprocessableEntityError: NamedHttpErrorConstructor<UnprocessableEntityError>;
export const UnsupportedMediaTypeError: NamedHttpErrorConstructor<UnsupportedMediaTypeError>;
export const UpgradeRequiredError: NamedHttpErrorConstructor<UpgradeRequiredError>;
export const UriTooLongError: NamedHttpErrorConstructor<UriTooLongError>;
export const VariantAlsoNegotiatesError: NamedHttpErrorConstructor<VariantAlsoNegotiatesError>;
