const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const script = path.resolve(__dirname, '../scripts/release.cjs')

test('release preparation preserves multiline notes and synchronizes metadata locally', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'express-response-errors-release-'))
  function run(arg) {
    return spawnSync(process.execPath, [script, arg], { cwd: temp, encoding: 'utf8' })
  }
  try {
    fs.writeFileSync(
      path.join(temp, 'package.json'),
      JSON.stringify({ name: 'fixture', version: '1.0.5' })
    )
    fs.writeFileSync(
      path.join(temp, 'package-lock.json'),
      JSON.stringify({ version: '1.0.5', packages: { '': { version: '1.0.5' } } })
    )
    fs.writeFileSync(
      path.join(temp, 'CHANGELOG.md'),
      '# Changelog\n\n## Unreleased\n\n### Added\n\n- First change.\n- Second change.\n\n## 1.0.5 — 2020-01-01\n\n- Old change.\n'
    )
    assert.equal(run('2.0.0-beta.1').status, 0)
    const notes = fs.readFileSync(path.join(temp, 'CHANGELOG.md'), 'utf8')
    assert.match(notes, /## Unreleased\n\n## 2\.0\.0-beta\.1 — \d{4}-\d{2}-\d{2}/)
    assert.match(notes, /### Added\n\n- First change\.\n- Second change\./)
    assert.match(notes, /## 1\.0\.5 — 2020-01-01\n\n- Old change\./)
    assert.equal(run('--check').status, 0)
    for (const version of ['2.0.0-beta.1', '1.0.4', '2.0.0-beta.01', 'invalid']) {
      assert.notEqual(run(version).status, 0)
    }
    // No release is prepared when Unreleased has no notes.
    assert.notEqual(run('2.0.0-beta.2').status, 0)
    const pkg = JSON.parse(fs.readFileSync(path.join(temp, 'package.json')))
    assert.equal(pkg.version, '2.0.0-beta.1')
    pkg.version = '2.0.0-beta.2'
    fs.writeFileSync(path.join(temp, 'package.json'), JSON.stringify(pkg))
    assert.notEqual(run('--check').status, 0)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
})
