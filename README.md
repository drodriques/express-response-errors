# express-response-errors [![NPM Version][npm-image]][npm-url]

> Collection of custom response errors and middleware for [express](https://expressjs.com).

## Install

```bash
npm i express-response-errors -S
````

## Configure

Add middleware to your application bootstrap file:

```js
const { httpErrorsMiddleware } = require('express-response-errors');

app.use(httpErrorsMiddleware);
```

## Usage

Throw generic HTTP exception

```js
const { HttpError } = require('express-response-errors');

// Ex. with default status text
throw new HttpError(418);

// Ex. with custom message
throw new HttpError(418, 'I only brew tea');

```
Throw custom HTTP exception

```js
const { ImATeapotError } = require('express-response-errors');

// Ex. with default status text
throw new ImATeapotError();

// Ex. with custom status text
throw new ImATeapotError('I only brew tea');
```

Exceptions thrown without a message defaults to HTTP standard status text.
Exceptions are handled by middle which relays errors as a HTTP response.

## Base Exception

- HttpError

## Custom Exceptions

  - BadRequestError
  - UnauthorizedError
  - PaymentRequiredError
  - ForbiddenError
  - NotFoundError
  - MethodNotAllowedError
  - NotAcceptableError
  - ProxyAuthenticationRequiredError
  - RequestTimeoutError
  - ConflictError
  - GoneError
  - LengthRequiredError
  - PreconditionFailedError
  - PayloadTooLargeError
  - URITooLongError
  - UnsupportedMediaTypeError
  - RangeNotSatisfiableError
  - ExpectationFailedError
  - ImATeapotError
  - MisdirectedRequestError
  - UnprocessableEntityError
  - LockedError
  - FailedDependencyError
  - UnorderedCollectionError
  - UpgradeRequiredError
  - PreconditionRequiredError
  - TooManyRequestsError
  - RequestHeaderFieldsTooLargeError
  - UnavailableForLegalReasonsError
  - InternalServerError
  - NotImplementedError
  - BadGatewayError
  - ServiceUnavailableError
  - GatewayTimeoutError
  - HttpVersionNotSupportedError
  - VariantAlsoNegotiatesError
  - InsufficientStorageError
  - LoopDetectedError
  - BandwidthLimitExceededError
  - NotExtendedError
  - NetworkAuthenticationRequiredError


## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-response-errors.svg
[npm-url]: https://www.npmjs.com/package/express-response-errors
