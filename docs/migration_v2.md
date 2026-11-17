# Migrating from v1 to v2

This guide covers `2.0.0-beta.1`, the first v2 prerelease.
See the [user guide](user_guide.md#install-and-configure) for installation steps.

## Requirements and breaking changes

- Upgrade to Node.js **22.14.0 or later**. The old package declared Node 10 support.
- Status codes must be integers from 400 through 511. `NaN` and fractions now
  throw `RangeError` instead of reaching Express with invalid values.
- Default messages are fixed in the package rather than supplied by Node's
  `http.STATUS_CODES`. In particular, status 425 defaults to `Too Early` for both
  `TooEarlyError` and the historical `UnorderedCollectionError`. Pass an explicit
  message if your clients require different wording.
- Unassigned integer codes in the accepted range now default to `HTTP Error`
  instead of producing an undefined message. Explicit messages still work.

## Existing application code

These calls keep their signatures and response behavior:

```js
const {
  HttpError, NotFoundError, responseErrorHandler, httpErrorsMiddleware
} = require('express-response-errors')

new HttpError(404)
new HttpError(404, 'Item not found')
new NotFoundError('Item not found')
```

`httpErrorsMiddleware` remains an alias of `responseErrorHandler`. Prefer the
current name in new code. Default responses remain `{ message }`, with the
error's status. Unknown errors remain delegated; already-started responses are
always delegated. Register middleware after routes as before.

All previously declared named errors remain exported, including the historical
425 constructor. Names and inheritance remain stable. Both ES class subclassing
and `util.inherits`/constructor `.call()` patterns remain supported. The legacy
`super_` links and enumerable `code`/`message` properties are retained.

The root CommonJS entry, `lib/http-error`, `lib/middleware`, and `types/index.d.ts`
paths remain available through compatibility wrappers. There is no restrictive
package `exports` map. CommonJS and native ESM named imports share constructors.
Multiple separately installed copies can still have different identities.

## New optional behavior

Constructors accept an additional options argument. Existing argument order does
not change: `(code, message?, options?)` for `HttpError` and `(message?, options?)`
for named errors. Options include `cause`, headers, `errorCode`, `details`, and
`expose`. `statusCode` is a read-only alias of `code`.

Use `createResponseErrorHandler` to configure serialization, logging, exposure,
or handling of unknown errors. Install it in place of `responseErrorHandler`.
No extra metadata is added to the default JSON body. An explicit `expose: false`
replaces custom messages with their status default and removes application
metadata before serialization. See the [user guide](user_guide.md).

The optional `normalizeError` hook maps application failures to `HttpError`
before exposure and serialization. Existing HTTP errors bypass the hook.
`problemDetailsSerializer` selects RFC 9457 responses when explicitly configured;
the default body stays `{ message }`. Per-error headers are applied before the
serializer, which can override the content type. `ValidationIssue` is an optional
type for public field details. Request ID integration remains application-owned.

All middleware hooks are synchronous. If a hook throws an `Error`, it is passed
to the next error handler. Other thrown values are wrapped in an `Error` with
the original value as its cause.

## TypeScript consumers

Declarations are now generated from the implementation. Error names can be used
as both constructor values and instance types. Details can be inferred from
options or specified with a generic parameter. Middleware is structurally
compatible with Express 4 and 5 without adding Express as a production dependency.

The deprecated middleware alias now has a declaration. The old `types/` path
re-exports generated types, so applications do not need to change that import.

Public types use `JsonValue` for JSON bodies and default details, `ErrorInput`
for errors/causes, and `ErrorRequest` for the default request shape. Serializers
must return JSON-compatible values. Supply your own details or request generic
parameter for application-specific structures. The source policy prohibits
explicit `any` and `unknown` annotations.

## Verify your upgrade

1. Check your deployed Node version against the new minimum.
2. Run your application's tests using the packed or published v2 candidate.
3. Check assertions that depend on exact default status wording.
4. Exercise custom subclasses and error middleware ordering.
5. Confirm that public error messages and any opted-in details are appropriate
   for clients. Causes remain diagnostic information, not default response data.
