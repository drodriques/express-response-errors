# Changelog

Versions follow Semantic Versioning. New changes go under Unreleased until they
are assigned to a release.

## Unreleased

## 2.0.0-beta.1 — 2026-11-17

First beta of v2. See the
[migration guide](docs/migration_v2.md) before upgrading from v1.

### Breaking changes

- Require Node.js 22.14.0 or later; v1 declared support for Node.js 10.
- Require integer HTTP error statuses from 400 through 511. `NaN` and fractions
  now throw `RangeError`. Unassigned codes in that range default to `HTTP Error`
  instead of an undefined message.
- Use fixed default messages instead of Node's status table. Both status-425
  constructors now default to `Too Early`. Pass a custom message if your clients
  require different wording.

### Added

- TypeScript implementation with generated declarations, typed error details,
  and support for application-defined subclasses.
- Optional error causes, validated response headers, application identifiers
  (`errorCode`), public details, and message exposure controls. Add `statusCode`
  as a read-only alias of the existing numeric `code`.
- `createResponseErrorHandler` for custom JSON responses, logging hooks, and
  optional generic 500 responses for non-HTTP errors.
- `normalizeError` to map application failures to HTTP errors in one place.
- `problemDetailsSerializer` for optional RFC 9457 JSON error responses, including
  public application identifiers and details.
- `ValidationIssue`, a TypeScript type for field names, messages, and optional
  validation codes. Applications still perform their own validation.
- User-guide examples for request IDs and application-owned translation
  dictionaries. English remains the default; neither example requires a service
  or a new runtime dependency.

### Compatibility

- Keep existing constructor arguments, error names, inheritance, and enumerable
  `code`/`message` properties. Support both class-based and `util.inherits`
  subclasses.
- Keep CommonJS imports and legacy `lib/` and `types/` entry points. CommonJS and
  native ESM imports share the same constructors.
- Keep `httpErrorsMiddleware` as a deprecated alias of `responseErrorHandler`.
- Keep the default response body as `{ message }`. Forward non-HTTP errors unless
  the application explicitly configures handling for them. Always forward errors
  received after response headers have been sent.
- Export both `TooEarlyError` and the historical `UnorderedCollectionError` for
  status 425. The historical constructor remains deprecated.
- Keep zero runtime dependencies.

### Maintenance

- Separate base errors, named constructors, status messages, and response formats
  into focused modules with explicit public exports.
- Replace Mocha and Chai with Node's built-in test runner. Cover Express 4 and 5,
  legacy imports, and JavaScript/TypeScript consumers of the packed package.
- Update development dependencies. Add Biome formatting and lint rules, including
  checks against explicit `any` and `unknown` types.
- Add a user guide, migration guide, and manual release-preparation commands.
  Keep CI, Git hooks, and automatic publishing disabled.

## 1.x

Earlier releases did not maintain this changelog. See repository history and npm
for historical releases.
