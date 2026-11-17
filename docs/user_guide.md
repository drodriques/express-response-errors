# express-response-errors user guide

This guide covers the `2.0.0-beta.1` prerelease. It requires
Node.js 22.14.0 or later and supports Express 4 and 5. For changes from v1, see the
[migration guide](migration_v2.md). For an overview, see the [README](../README.md).

- [Install and configure](#install-and-configure)
- [Create HTTP errors](#create-http-errors)
- [Choose a named error](#choose-a-named-error)
- [Attach error context](#attach-error-context)
- [Configure responses](#configure-responses)
- [Normalize application errors](#normalize-application-errors)
- [Use Problem Details](#use-problem-details)
- [Report validation errors](#report-validation-errors)
- [Include request IDs](#include-request-ids)
- [Localize responses](#localize-responses)
- [Handle other errors](#handle-other-errors)
- [Use TypeScript](#use-typescript)
- [Troubleshooting](#troubleshooting)

## Install and configure

Install the beta explicitly from npm:

```sh
npm install express-response-errors@2.0.0-beta.1
```

An unversioned `npm install express-response-errors` follows the `latest` tag;
it does not explicitly select this beta. Your application supplies Express.
Install it separately with `npm install express` if needed.

Register the error middleware **after your routes**:

```js
const express = require('express')
const { NotFoundError, responseErrorHandler } = require('express-response-errors')
const app = express()

app.get('/example', (req, res, next) => {
  next(new NotFoundError('Item not found'))
})

app.use(responseErrorHandler)
app.listen(3000)
```

A request to `/example` returns HTTP **404**:

```json
{ "message": "Item not found" }
```

To return JSON for unmatched routes, add this after your routes and before the
error handler:

```js
app.use((req, res, next) => {
  next(new NotFoundError('Route not found'))
})
```

## Create HTTP errors

Use `HttpError(code, message?, options?)` when you want to supply the status:

```js
const { HttpError } = require('express-response-errors')

next(new HttpError(403))
next(new HttpError(403, 'You do not have access to this resource'))
```

The code must be an integer from 400 through 511. Invalid values throw
`RangeError`. Unassigned codes in that range are accepted and default to
`HTTP Error`; prefer recognized HTTP statuses.

An omitted or empty message uses the built-in status text, which stays the same
across Node versions. Each error has `code`, `message`, `name`, a stack trace,
and a read-only `statusCode` alias. If you change `code` after construction,
keep it a valid HTTP error status.

## Choose a named error

Named errors accept `(message?, options?)` and supply their status:

```js
const { BadRequestError, NotFoundError } = require('express-response-errors')

next(new BadRequestError('An email address is required'))
next(new NotFoundError())
```

All 42 supported constructors are listed below, ordered by HTTP status.

| Constructor | Status |
| --- | --- |
| `BadRequestError` | 400 |
| `UnauthorizedError` | 401 |
| `PaymentRequiredError` | 402 |
| `ForbiddenError` | 403 |
| `NotFoundError` | 404 |
| `MethodNotAllowedError` | 405 |
| `NotAcceptableError` | 406 |
| `ProxyAuthenticationRequiredError` | 407 |
| `RequestTimeoutError` | 408 |
| `ConflictError` | 409 |
| `GoneError` | 410 |
| `LengthRequiredError` | 411 |
| `PreconditionFailedError` | 412 |
| `PayloadTooLargeError` | 413 |
| `UriTooLongError` | 414 |
| `UnsupportedMediaTypeError` | 415 |
| `RangeNotSatisfiableError` | 416 |
| `ExpectationFailedError` | 417 |
| `ImATeapotError` | 418 |
| `MisdirectedRequestError` | 421 |
| `UnprocessableEntityError` | 422 |
| `LockedError` | 423 |
| `FailedDependencyError` | 424 |
| `TooEarlyError` | 425 |
| `UnorderedCollectionError` (deprecated) | 425 |
| `UpgradeRequiredError` | 426 |
| `PreconditionRequiredError` | 428 |
| `TooManyRequestsError` | 429 |
| `RequestHeaderFieldsTooLargeError` | 431 |
| `UnavailableForLegalReasonsError` | 451 |
| `InternalServerError` | 500 |
| `NotImplementedError` | 501 |
| `BadGatewayError` | 502 |
| `ServiceUnavailableError` | 503 |
| `GatewayTimeoutError` | 504 |
| `HttpVersionNotSupportedError` | 505 |
| `VariantAlsoNegotiatesError` | 506 |
| `InsufficientStorageError` | 507 |
| `LoopDetectedError` | 508 |
| `BandwidthLimitExceededError` | 509 |
| `NotExtendedError` | 510 |
| `NetworkAuthenticationRequiredError` | 511 |

Named errors inherit from `HttpError` and `Error`. All historical named exports
remain available. Both `TooEarlyError` and the deprecated
`UnorderedCollectionError` use status 425 and the default message `Too Early`.

## Attach error context

```js
const { TooManyRequestsError } = require('express-response-errors')

next(new TooManyRequestsError('Please try again later', {
  headers: { 'Retry-After': '60' },
  errorCode: 'RATE_LIMIT_EXCEEDED',
  details: { retryAfterSeconds: 60 },
}))
```

| Option | Purpose |
| --- | --- |
| `headers` | Response headers with string values; validated, copied, and frozen. |
| `errorCode` | An application identifier, separate from the numeric HTTP `code`. |
| `details` | Public data such as field validation failures. |
| `cause` | The original failure for debugging. |
| `expose` | Set to `false` to hide the custom message and metadata. |

For `HttpError`, pass options as the third argument:

```js
const { HttpError } = require('express-response-errors')
const originalError = new Error('Database unavailable')
const error = new HttpError(503, 'Service temporarily unavailable', {
  cause: originalError,
})
```

The default handler applies headers and returns only `{ message }`. It does not
include identifiers, details, causes, or stacks. Custom messages, including 500
messages, are public by default. Use client-appropriate messages or disable
exposure. Headers are still applied when exposure is disabled.

## Configure responses

Use `createResponseErrorHandler` **in place of** `responseErrorHandler` to
customize logging, formatting, or message exposure:

```js
const { createResponseErrorHandler } = require('express-response-errors')

app.use(createResponseErrorHandler({
  expose: error => error.code < 500,
  onError: (error, req) => {
    console.error(req.method, req.url, error)
  },
  serialize: (error, req) => ({
    message: error.message,
    errorCode: error.errorCode,
    details: error.details,
    path: req.path,
  }),
}))
```

| Option | Default | Purpose |
| --- | --- | --- |
| `normalizeError` | None | Map a non-HTTP error to `HttpError`, or return `undefined` to delegate. |
| `expose` | `true` | A boolean or `(error, req) => boolean` exposure policy. |
| `onError` | None | Log the original handled error with `(error, req, res)`. |
| `serialize` | `{ message }` | Return a JSON-compatible body from `(error, req, res)`. |
| `handleUnknownErrors` | `false` | Return a generic 500 response for other errors. |

An error's `expose: false` always hides its custom message and metadata. Setting
it to `true` cannot override a handler policy that hides them. When hidden,
the serializer receives a new base error with the same status and its default
message, without the original cause, details, or application identifier. The
logging hook receives the original error. Neither path changes the original.

Hooks must be synchronous. Thrown `Error` instances pass to the next error
handler; other thrown values are wrapped in an `Error` with the original cause.
The logging hook runs only for handled errors. If it sends a response itself,
the middleware forwards the error without sending another response.

Per-error headers are applied before serialization. A serializer may override
them, for example to select its response content type. Combine the optional
features below in one configured handler rather than installing multiple handlers
that each send a response.

## Normalize application errors

Use `normalizeError(error, req)` to map application failures in one place. For
example, an application-owned duplicate-account error can become HTTP 409:

```js
const { ConflictError, createResponseErrorHandler } = require('express-response-errors')

class DuplicateAccountError extends Error {}

app.use(createResponseErrorHandler({
  normalizeError: error => {
    if (error instanceof DuplicateAccountError) {
      return new ConflictError('Account already exists', {
        cause: error,
        errorCode: 'ACCOUNT_EXISTS',
      })
    }

    return undefined
  },
}))
```

The hook runs only for errors that are not already this package's `HttpError`.
It must synchronously return an `HttpError` or `undefined`. Unmapped errors pass
to the next handler unless `handleUnknownErrors` enables generic 500 responses.
Invalid return values and thrown hook failures pass to the next error handler.

Normalization happens before exposure and serialization. `onError` still receives
the original failure, while the response uses the mapped error's status, headers,
and public fields. No normalization hook runs after headers have been sent.

## Use Problem Details

For the standard [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) error
format, select the optional `problemDetailsSerializer`:

```js
const {
  createResponseErrorHandler,
  problemDetailsSerializer,
} = require('express-response-errors')

app.use(createResponseErrorHandler({ serialize: problemDetailsSerializer }))
```

`new NotFoundError('Account not found')` then returns HTTP 404 with
`Content-Type: application/problem+json` and this body:

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Account not found"
}
```

The title is the default status phrase; `detail` is the public error message.
Public `errorCode` and `details` are included as extension fields when present.
Causes and stacks are not copied. The middleware applies exposure settings first,
so hidden messages and metadata stay hidden in this format too.

You can wrap the serializer and add an `instance` URI, or supply an application
problem `type` URI and matching `title`. It does not fetch these URIs or contact
an external service. The default handler still returns only `{ message }`.

## Report validation errors

Use the exported `ValidationIssue` type for a consistent list of field failures:

```ts
import { UnprocessableEntityError } from 'express-response-errors'
import type { ValidationIssue } from 'express-response-errors'

const issues: ValidationIssue[] = [
  { field: 'email', message: 'Enter a valid email address', code: 'format' },
  { field: 'name', message: 'Name is required', code: 'required' },
]

const error = new UnprocessableEntityError('Validation failed', {
  errorCode: 'VALIDATION_FAILED',
  details: issues,
})
```

Pass the error to `next(error)` in a route. Each issue requires a string `field`
and `message`; `code` is an optional application-defined string. Use field names
such as `email` or `address.postcode` consistently in your application.

Your application performs validation and builds the list. The library does not
install a validator or inspect submitted values. Problem Details includes the
list under `details`; the default response omits it unless your serializer adds
it. Exposure settings also apply to validation details.

## Include request IDs

Generate an ID before routes and reuse it in response headers, error bodies, and
logs. Node's built-in `randomUUID()` requires no extra package or logging service:

```js
const { randomUUID } = require('node:crypto')
const { createResponseErrorHandler } = require('express-response-errors')

app.use((req, res, next) => {
  req.requestId = randomUUID()
  res.set('X-Request-Id', req.requestId)
  next()
})

// Register your routes here, before the error handler.

app.use(createResponseErrorHandler({
  onError: (error, req) => {
    console.error(req.requestId, error)
  },
  serialize: (error, req) => ({
    message: error.message,
    requestId: req.requestId,
  }),
}))
```

Clients can report the returned ID to help locate the corresponding log entry.
The library does not generate IDs, store logs, or call an external service. In
TypeScript, extend your request type with `requestId?: string` and pass it to
`createResponseErrorHandler`.

To include the same ID in a Problem Details response, use this serializer in that
handler's options:

```js
serialize: (error, req, res) => ({
  ...problemDetailsSerializer(error, req, res),
  requestId: req.requestId,
})
```

## Localize responses

Localization is optional. Use the existing serializer with dictionaries owned by
your application. The package ships English defaults only; no translation service,
extra dependency, or fee is needed.

### 1. Configure English messages

Give translatable errors a stable `errorCode`. Register this handler after routes,
in place of the default handler:

```js
const { createResponseErrorHandler } = require('express-response-errors')

const messages = {
  en: {
    ACCOUNT_MISSING: 'Account not found',
  },
}

function getMessage(language, key) {
  if (!key) {
    return undefined
  }

  const dictionary = messages[language]

  if (!dictionary || !Object.hasOwn(dictionary, key)) {
    return undefined
  }

  return dictionary[key]
}

const localizedErrorHandler = createResponseErrorHandler({
  serialize: (error, req) => {
    const language = req.acceptsLanguages(Object.keys(messages)) || 'en'
    const key = error.errorCode
    const message =
      getMessage(language, key) ?? getMessage('en', key) ?? error.message

    return { message }
  },
})

app.use(localizedErrorHandler)
```

In a route, supply the matching key and an English fallback message:

```js
next(new NotFoundError('Account not found', {
  errorCode: 'ACCOUNT_MISSING',
}))
```

Messages without an `errorCode` stay unchanged, including custom messages and
default HTTP status text. To translate a default status message, give that error
an application key and add it to the dictionaries too.

### 2. Add another language

Add a dictionary with the same keys during application startup. For example,
an application could add Spanish:

```js
messages.es = {
  ACCOUNT_MISSING: 'Cuenta no encontrada',
}
```

Keep English as the complete fallback dictionary. Developers maintain their own
translations; adding a language does not require changing or rebuilding this
library. Set up dictionaries once rather than changing them during requests.

### 3. Select a language per request

Express's `req.acceptsLanguages()` selects a supported language from the
`Accept-Language` header, including regional variants and preference weights.
With the Spanish dictionary above, `Accept-Language: es` returns:

```json
{ "message": "Cuenta no encontrada" }
```

If only English is configured, or no supported language matches, English is used.
A missing translation falls back to its English entry, then the error's original
message. Each request selects its language independently; the original error is
not changed. Applications with saved user preferences can use a validated,
supported preference before checking the header.

When responses are cached, add this middleware **before routes** so caches keep
language variants separate and preserve other `Vary` fields:

```js
app.use((req, res, next) => {
  res.vary('Accept-Language')
  next()
})
```

The serializer receives sanitized errors when exposure is disabled. Their
`errorCode` is removed, so this example returns the safe default English message
instead of translating a private message. Causes, details, and identifiers are
not added to the JSON response. If configured, `onError` still receives the
original error.

For TypeScript, type the catalogs as
`Record<string, Record<string, string>>`, type `getMessage` parameters as
`language: string` and `key?: string`, and call
`createResponseErrorHandler<Request>` using Express's `Request` type.

## Handle other errors

By default, ordinary errors and objects with only `code` and `message` pass to
`next(err)`. To return generic JSON for those failures:

```js
app.use(createResponseErrorHandler({
  handleUnknownErrors: true,
  onError: error => { console.error(error) },
}))
```

These errors receive HTTP 500 with `Internal Server Error`. Their original
message stays hidden, including from a custom serializer. Alternatively, leave
this option disabled and register your own error handler after this package's.

When headers have already been sent, the middleware immediately calls
`next(err)` without invoking hooks or writing a response. Application fallback
handlers should also check `res.headersSent` before responding.

Pass asynchronous failures to Express using the pattern supported by your
Express version. This package does not wrap routes or catch background work.

## Use TypeScript

Declarations are included; no separate `@types/express-response-errors` package
is needed. JavaScript consumers do not need TypeScript installed.

```ts
import type { Request } from 'express'
import { NotFoundError, createResponseErrorHandler } from 'express-response-errors'

class AccountMissingError extends NotFoundError {}

const handler = createResponseErrorHandler<Request>({
  serialize: (error, req) => ({ message: error.message, path: req.path }),
})
```

Pass your application's request type to access its properties in hooks.
Without a type parameter, `ErrorRequest` provides optional `method` and `url`.

`JsonValue` is the default details type and describes serializer return values.
Constructor options infer their details type; you can also specify it explicitly.
`ErrorInput` describes an `Error`, JSON value, or `undefined` for causes and
middleware error inputs. CommonJS and native ESM imports share constructors.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Default Express error response | Register the handler after routes and pass this package's `HttpError`. |
| Default 404 for an unmatched URL | Add a catch-all before the error handler. |
| Plain errors skip the handler | Enable `handleUnknownErrors` or add a fallback. |
| An HTTP error skips the handler | Check for separately installed copies with different constructor identities. |
| Custom formatting is ignored | Replace the default handler with the configured handler. |
| A private message reaches clients | Set `expose: false` or configure an exposure policy. |
| Headers have already been sent | Forward the error; the response cannot be replaced. |
| Older code uses `httpErrorsMiddleware` | It remains an alias of `responseErrorHandler`. |
