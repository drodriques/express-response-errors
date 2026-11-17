const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const biome = path.join(root, 'node_modules/@biomejs/biome/bin/biome')

test('lint rejects forbidden types but permits their names in strings and comments', () => {
  const temp = fs.mkdtempSync(path.join(root, '.lint-policy-'))

  const lint = file =>
    spawnSync(process.execPath, [biome, 'lint', file], {
      cwd: root,
      encoding: 'utf8',
    })

  try {
    const valid = path.join(temp, 'valid.ts')
    fs.writeFileSync(
      valid,
      `
      // The words any and unknown are not type annotations here.
      export const label = 'unknown'
      export interface Result { message: string }
    `
    )
    const accepted = lint(valid)
    assert.equal(accepted.status, 0, accepted.stdout + accepted.stderr)

    const invalid = path.join(temp, 'invalid.ts')
    fs.writeFileSync(
      invalid,
      `
      export type Unsafe = any
      export type Unspecified = unknown
      export type Generic<Value = unknown> = Value[]
      export const asserted = 1 as unknown as string
    `
    )
    const rejected = lint(invalid)
    const diagnostics = rejected.stdout + rejected.stderr
    assert.notEqual(rejected.status, 0)
    assert.match(diagnostics, /noExplicitAny/)
    assert.equal((diagnostics.match(/Use a concrete type or a generic parameter/g) || []).length, 3)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})
