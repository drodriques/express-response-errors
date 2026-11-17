# express-response-errors

HTTP error constructors and JSON error middleware for Express. Written in
TypeScript, with built-in type declarations and no runtime dependencies.

**v2 prerelease:** `2.0.0-beta.1`.
See the [release notes](CHANGELOG.md) and [migration guide](docs/migration_v2.md)
for changes from v1.

## Features

- Base `HttpError` and named errors such as `NotFoundError`.
- Consistent HTTP statuses and JSON error responses.
- Optional headers, causes, application error identifiers, and public details.
- Configurable response formatting, logging, and message exposure.
- Optional error normalization and standard Problem Details responses.

## Requirements

Node.js 22.14.0 or later and an Express application. Tested with Express 4 and 5.

## Documentation

Start with the **[user guide](docs/user_guide.md)** for installation, setup, usage
examples, TypeScript, and troubleshooting.

- [Migration guide](docs/migration_v2.md): upgrading from v1.
- [Changelog](CHANGELOG.md): release notes.
- [Contributing](CONTRIBUTING.md): repository layout, development, and manual checks.

## License

[MIT](LICENSE)
