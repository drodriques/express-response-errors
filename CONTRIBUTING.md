# Contributing

## Development

Use Node.js 22.14.0 or later and npm. From a clean checkout:

```sh
npm ci
npm run validate
```

Checks are run manually. CI and Git hooks are disabled; run `npm run validate`
before committing changes and `npm run release:check` before preparing a release
artifact.

TypeScript source lives in `src/`; `npm run build` generates JavaScript and
declarations in ignored `dist/`. Root, `lib/`, and `types/` files preserve legacy
entry points. Do not hand-edit generated declarations. There are no runtime
dependencies; Express, TypeScript, and test tools are development dependencies.

## Repository layout

```text
src/
  http-error.ts       Base error and its options/constructor types
  status-messages.ts  Internal default status messages
  named-errors.ts     Named errors, legacy aliases, and their private factory
  middleware.ts       Response handlers and their types
  problem-details.ts  Optional RFC 9457 serializer and response type
  types.ts            Shared JSON and error-input types
  index.ts            Explicit public exports
tests/                Tests named after the modules they cover
scripts/              Local lint rule, package checks, and release preparation
docs/                 User and migration guides
```

Keep implementation-specific types beside their code. Export supported API from
`src/index.ts`; the status table and named-error factory are internal. Legacy
entry points in the root, `lib/`, and `types/` only forward exports.

## Manual checks

| Command | Purpose |
| --- | --- |
| `npm run build` | Compile JavaScript and declarations. |
| `npm run lint` | Check lint rules and formatting; warnings fail the check. |
| `npm run format` | Apply formatting to code and configuration files. |
| `npm run format:check` | Check formatting without editing files. |
| `npm run typecheck` | Check implementation and a representative Express consumer. |
| `npm test` | Build and run Node tests, including Express 4 and 5 integration. |
| `npm run test:package` | Pack, install offline into a temporary consumer, and check archive contents, imports, and declarations. |
| `npm run validate` | Run lint/format, types, tests, and package checks. |
| `npm audit` | Audit the entire dependency tree. |
| `npm audit --omit=dev` | Audit the production dependency tree. |

Tests use ephemeral server ports through Supertest; no fixed port 3000 is needed.
The archive check invokes `npm pack`, whose `prepack` script builds the package.
It does not publish or install registry dependencies into the temporary consumer.
Localization tests execute the configuration example from `docs/user_guide.md`
against Express 4 and 5; keep that example runnable when editing it.
Request ID tests also execute the guide's example to verify response/log
correlation without adding a logging service.

## Code style

Use Biome's recommended lint rules and the formatting settings in `biome.json`:
two spaces, single quotes, semicolons only when needed, 100-column wrapping,
ES5 trailing commas, and LF line endings. Run `npm run format` after edits, then
`npm run lint` to check both formatting and lint rules without changing files.

Explicit `any` and `unknown` types are errors. Prefer concrete types, domain
unions, or meaningful generic parameters. TypeScript's strict mode also rejects
implicit `any` in checked TypeScript files. The small local
`scripts/no-unknown.grit` Biome rule checks syntax nodes, so words in comments
and strings are unaffected. No additional lint dependency is needed.

Always use braces for control statements and avoid nested ternaries. Leave one
blank line between functions and between logical steps; this spacing is a manual
readability convention. Biome does not insert those blank lines automatically.
Generated `dist/`, dependencies, and the npm lockfile are excluded from formatting.
The style tools and local rule are excluded from the published npm package.

## Branches

Use `main` as the permanent development branch, with short-lived `feature/` and
`fix/` branches when needed.

`main` is also the GitHub default branch, and local `main` tracks `origin/main`.
The former `master` and `develop` histories are preserved in `main`; those branch
names have been retired locally and on GitHub. Existing branch protection was
retained when `master` was renamed.

Create a `1.x` maintenance branch only if there is an explicit need to release
v1 fixes while v2 development continues. Historical releases are identified by
their tags, not by keeping a permanent branch for every version.

## Release notes and local preparation

`package.json` is the version source of truth. `package-lock.json` and the
versioned entry in `CHANGELOG.md` must agree. Add user-facing notes under
`Unreleased`, grouped into Breaking changes, Added, Fixed, or Maintenance as
appropriate. Explain observable behavior and link migration guidance for major
changes. Keep one canonical entry rather than rewriting notes in multiple places.

The current candidate is `2.0.0-beta.1`. Its notes are consolidated under
`2.0.0-beta.1 — In preparation`; the empty Unreleased section is reserved for
future changes. Set the release date when publication is ready. A prepared entry
does not mean that a package has been published.

When the next candidate is ready, for example:

```sh
npm run release:prepare -- 2.0.0-beta.2
npm run release:check
```

The preparation script updates package/lock versions and moves Unreleased notes
into a dated version entry. It does not commit, tag, push, or publish. Review
the resulting diff before committing. Checks fail for empty release notes,
invalid versions, reused versions, or inconsistent metadata.

To create a local release archive after checks pass, run `npm pack`. Review the
archive and the version's changelog entry before any publication. These commands
do not push to GitHub or publish to npm.

The files under `.github/workflows/` end in `.disabled` and are kept only as
optional references. GitHub Actions will not run them. Validation uses the Node
version installed locally; verify other supported versions manually as needed.

## Future publication

Publication is a separate authorized action. When authorized, manually publish the verified
release commit under the existing `express-response-errors` npm package name,
create a matching `v<version>` tag, and reuse that version's changelog entry for
the GitHub Release. Use npm's `next` tag for prereleases so `latest` remains stable.
Only promote a stable release to `latest` after reviewing the migration notes.

No automated publishing workflow or publishing credentials are included here.
Existing npm releases remain available; never replace or unpublish them as part
of this migration.
