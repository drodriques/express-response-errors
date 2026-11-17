const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'express-response-errors-package-'))

function run(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

try {
  const output = run('npm', [
    'pack',
    '--json',
    '--silent',
    '--pack-destination',
    temp,
    '--cache',
    path.join(temp, 'cache'),
  ])
  const [packed] = JSON.parse(output)
  const paths = packed.files.map(file => file.path)
  for (const required of [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/http-error.js',
    'dist/http-error.d.ts',
    'dist/named-errors.js',
    'dist/named-errors.d.ts',
    'dist/status-messages.js',
    'dist/problem-details.js',
    'dist/problem-details.d.ts',
    'index.js',
    'lib/http-error.js',
    'lib/middleware.js',
    'types/index.d.ts',
    'docs/user_guide.md',
    'docs/migration_v2.md',
    'README.md',
    'LICENSE',
    'CHANGELOG.md',
  ]) {
    assert(paths.includes(required), `Missing published file: ${required}`)
  }
  assert(paths.every(file => !/^(src|tests|scripts|node_modules|\.github)\//.test(file)))

  fs.writeFileSync(path.join(temp, 'package.json'), '{"private":true}')
  run(
    'npm',
    [
      'install',
      path.join(temp, packed.filename),
      '--offline',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--cache',
      path.join(temp, 'cache'),
    ],
    temp
  )
  fs.writeFileSync(
    path.join(temp, 'consumer.cjs'),
    `
    const assert = require('node:assert/strict')
    const errors = require('express-response-errors')
    assert.equal(new errors.NotFoundError().code, 404)
    assert.equal(require('express-response-errors/lib/http-error').HttpError, errors.HttpError)
    assert.equal(require('express-response-errors/lib/http-error').NotFoundError, errors.NotFoundError)
    assert.equal('STATUS_MESSAGES' in errors, false)
    assert.equal('namedError' in errors, false)
    assert.equal(require('express-response-errors/lib/middleware').responseErrorHandler, errors.responseErrorHandler)
    assert.equal(require('express-response-errors/package.json').version, ${JSON.stringify(packed.version)})
    assert.equal(errors.httpErrorsMiddleware, errors.responseErrorHandler)
    const headers = {}
    const problem = errors.problemDetailsSerializer(new errors.NotFoundError('Missing'), {}, {
      set: (name, value) => { headers[name] = value }
    })
    assert.equal(headers['Content-Type'], 'application/problem+json')
    assert.equal(problem.status, 404)
  `
  )
  run(process.execPath, ['consumer.cjs'], temp)
  fs.writeFileSync(
    path.join(temp, 'consumer.mjs'),
    `
    import assert from 'node:assert/strict'
    import { createRequire } from 'node:module'
    import { HttpError, NotFoundError, problemDetailsSerializer } from 'express-response-errors'
    const require = createRequire(import.meta.url)
    const cjs = require('express-response-errors')
    assert.equal(HttpError, cjs.HttpError)
    assert(new NotFoundError() instanceof cjs.HttpError)
    assert.equal(problemDetailsSerializer, cjs.problemDetailsSerializer)
  `
  )
  run(process.execPath, ['consumer.mjs'], temp)
  fs.writeFileSync(
    path.join(temp, 'consumer.ts'),
    `
    import { HttpError, NotFoundError, createResponseErrorHandler, problemDetailsSerializer } from 'express-response-errors'
    import type { ValidationIssue } from 'express-response-errors'
    import type { HttpError as LegacyError } from 'express-response-errors/types'
    const error: LegacyError = new NotFoundError('Missing')
    class AccountMissingError extends NotFoundError {}
    const custom: HttpError = new AccountMissingError()
    createResponseErrorHandler<{ path: string }>({ serialize: (err, req) => ({ message: err.message, path: req.path }) })
    createResponseErrorHandler<{ path: string }>({ serialize: problemDetailsSerializer })
    const issues: ValidationIssue[] = [{ field: 'email', message: 'Required', code: 'required' }]
    const invalid: HttpError = new HttpError(422, 'Validation failed', { details: issues })
    console.log(invalid)
    console.log(error, custom)
  `
  )
  run(
    process.execPath,
    [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '--strict',
      '--noEmit',
      '--target',
      'ES2022',
      '--module',
      'Node16',
      '--moduleResolution',
      'Node16',
      'consumer.ts',
    ],
    temp
  )
  console.log(
    `Packed ${packed.name}@${packed.version}: file contents, CommonJS, ESM interoperability and TypeScript consumers passed.`
  )
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}
