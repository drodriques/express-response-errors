# express-response-errors [![NPM Version][npm-image]][npm-url]

> Collection of custom response errors and middleware for [Express](https://expressjs.com).

## Install

```bash
npm i express-response-errors -S
````

## Configure

Add middleware to your application bootstrap file:

```js
const { responseErrorHandler } = require('express-response-errors');

app.use(responseErrorHandler);
```

## Usage 1

Pass HttpError exception with required code and optional message to Express from route handler.

```js
const { HttpError } = require('express-response-errors');

// Ex. with default status text
next(new HttpError(418));

// Ex. with custom message
next(new HttpError(418, 'I only brew tea'));

```

## Usage 2

Pass a specific http exception with optional message to Express from route handler.

```js
const { ImATeapotError } = require('express-response-errors');

// Ex. with default status text
next(new ImATeapotError());

// Ex. with custom status text
next(new ImATeapotError('I only brew tea'));
```

Errors passed to Express without a message defaults to HTTP standard status text.

Errors are handled by middleware which sends related error message and status as a HTTP response.

## Base error

- HttpError

## Named HTTP Errors

  - 400 BadRequestError
  - 401 UnauthorizedError
  - 402 PaymentRequiredError
  - 403 ForbiddenError
  - 404 NotFoundError
  - 405 MethodNotAllowedError
  - 406 NotAcceptableError
  - 407 ProxyAuthenticationRequiredError
  - 408 RequestTimeoutError
  - 409 ConflictError
  - 410 GoneError
  - 411 LengthRequiredError
  - 412 PreconditionFailedError
  - 413 PayloadTooLargeError
  - 414 UriTooLongError
  - 415 UnsupportedMediaTypeError
  - 416 RangeNotSatisfiableError
  - 417 ExpectationFailedError
  - 418 ImATeapotError
  - 421 MisdirectedRequestError
  - 422 UnprocessableEntityError
  - 423 LockedError
  - 424 FailedDependencyError
  - 425 UnorderedCollectionError
  - 426 UpgradeRequiredError
  - 428 PreconditionRequiredError
  - 429 TooManyRequestsError
  - 431 RequestHeaderFieldsTooLargeError
  - 451 UnavailableForLegalReasonsError
  - 500 InternalServerError
  - 501 NotImplementedError
  - 502 BadGatewayError
  - 503 ServiceUnavailableError
  - 504 GatewayTimeoutError
  - 505 HttpVersionNotSupportedError
  - 506 VariantAlsoNegotiatesError
  - 507 InsufficientStorageError
  - 508 LoopDetectedError
  - 509 BandwidthLimitExceededError
  - 510 NotExtendedError
  - 511 NetworkAuthenticationRequiredError


## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-response-errors.svg
[npm-url]: https://www.npmjs.com/package/express-response-errors
