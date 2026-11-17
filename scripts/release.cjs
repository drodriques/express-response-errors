const fs = require('node:fs')
const path = require('node:path')

// Local metadata preparation only: never commits, tags, pushes or publishes.
const root = process.cwd()
function read(name) {
  return fs.readFileSync(path.join(root, name), 'utf8')
}
const pkg = JSON.parse(read('package.json'))
const lock = JSON.parse(read('package-lock.json'))
const changelog = read('CHANGELOG.md')
const argument = process.argv[2]
const versionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$/

function fail(message) {
  throw new Error(message)
}
function compareVersions(left, right) {
  const a = left.match(versionPattern)
  const b = right.match(versionPattern)
  for (let i = 1; i <= 3; i++) {
    if (BigInt(a[i]) !== BigInt(b[i])) {
      return BigInt(a[i]) > BigInt(b[i]) ? 1 : -1
    }
  }
  if (a[4] === b[4]) {
    return 0
  }
  if (!a[4]) {
    return 1
  }
  if (!b[4]) {
    return -1
  }
  const ap = a[4].split('.')
  const bp = b[4].split('.')
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    if (ap[i] === undefined) {
      return -1
    }
    if (bp[i] === undefined) {
      return 1
    }
    if (ap[i] === bp[i]) {
      continue
    }
    const an = /^\d+$/.test(ap[i])
    const bn = /^\d+$/.test(bp[i])
    if (an && bn) {
      return BigInt(ap[i]) > BigInt(bp[i]) ? 1 : -1
    }
    if (an !== bn) {
      return an ? -1 : 1
    }
    return ap[i] > bp[i] ? 1 : -1
  }
  return 0
}
try {
  if (argument === '--check') {
    if (!versionPattern.test(pkg.version)) {
      fail('Invalid package version')
    }
    if (lock.version !== pkg.version || lock.packages[''].version !== pkg.version) {
      fail('package.json and package-lock.json versions disagree')
    }
    if (!changelog.includes(`## ${pkg.version} — `)) {
      fail('Missing versioned changelog entry')
    }
    console.log(`${pkg.name}@${pkg.version}: metadata verified. Nothing was published.`)
  } else {
    if (process.argv.length !== 3 || !versionPattern.test(argument ?? '')) {
      fail('Usage: npm run release:prepare -- <version> (or npm run release:check)')
    }
    if (argument === pkg.version || changelog.includes(`## ${argument} — `)) {
      fail('Version already prepared')
    }
    if (!versionPattern.test(pkg.version) || compareVersions(argument, pkg.version) <= 0) {
      fail('The release version must be newer than the current package version')
    }
    const match = changelog.match(/^## Unreleased[ \t]*\r?\n([\s\S]*?)(?=^## |(?![\s\S]))/m)
    if (!match?.[1].trim()) {
      fail('Add release notes under Unreleased first')
    }
    const entry = `## Unreleased\n\n## ${argument} — ${new Date().toISOString().slice(0, 10)}\n\n${match[1].trim()}\n\n`
    pkg.version = argument
    lock.version = argument
    lock.packages[''].version = argument
    fs.writeFileSync(path.join(root, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)
    fs.writeFileSync(path.join(root, 'package-lock.json'), `${JSON.stringify(lock, null, 2)}\n`)
    fs.writeFileSync(path.join(root, 'CHANGELOG.md'), changelog.replace(match[0], entry))
    console.log(`Prepared ${argument} locally. Review the diff before committing or publishing.`)
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
