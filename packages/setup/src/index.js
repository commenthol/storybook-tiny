import sh from 'shelljs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import {
  detectPackageManager,
  PACKAGE_MANAGERS
} from './detect-package-manager.js'

const { exec, cat, cp, test, mkdir } = sh

const help = `
  Usage:
    storybook-tiny [options] [args]

  Options:
    -h, --help        this help
    -v, --version     displays version
    -f, --force       force overwrite
    -p, --pckman <${PACKAGE_MANAGERS.join('|')}>
                      select package-manager
`

const cli = (args) => {
  const argv = args || process.argv.slice(2)
  const c = { pckman: detectPackageManager() }

  while (argv.length) {
    const arg = argv.shift()

    switch (arg) {
      case '-h':
      case '--help':
        c.help = true
        break
      case '-v':
      case '--version':
        c.version = true
        break
      case '-f':
      case '--force':
        c.force = true
        break
      case '-p':
      case '--pckman': {
        const pckMan = argv.shift()
        if (PACKAGE_MANAGERS.includes(pckMan)) {
          c.pckman = pckMan
        } else {
          console.error(`unsupported package manager "${pckMan}"`)
          process.exit(1)
        }
        break
      }
      default:
      // noop
    }
  }
  return c
}

const devDeps = (pckMan, devDependencies) => {
  const packages = devDependencies.join(' ')
  const cmd =
    pckMan === 'yarn'
      ? `yarn add --dev ${packages}`
      : pckMan === 'bun'
        ? `bun add -d ${packages}`
        : `${pckMan} install --save-dev ${packages}`
  exec(cmd)
}

const copyFiles = (rootDir, files, force = false) => {
  let ok = true
  for (const file of files) {
    const dir = path.dirname(file)
    const base = path.basename(file)
    if (!force && base === '*' && test('-d', dir)) {
      console.warn(`WARN: ${dir} exists, won't overwrite `)
      ok = false
      continue
    }
    if (!force && test('-f', file)) {
      console.warn(`WARN: ${file} exists, won't overwrite `)
      ok = false
      continue
    }
    if (!test('-d', dir)) {
      mkdir('-p', dir)
    }
    cp('-r', path.resolve(rootDir, file), dir)
  }
  return ok
}

const postProc = (commands = []) => {
  for (const command of commands) {
    for (const [cmd, args] of Object.entries(command)) {
      sh[cmd](...args)
    }
  }
}

const packageJson = () => {
  const filename = fileURLToPath(new URL('../package.json', import.meta.url))
  const data = cat(filename)
  if (!data || data.stderr) {
    return {}
  }
  return JSON.parse(data)
}

/**
 * @param {{
 *  devDependencies: string[],
 *  rootDir: string,
 *  files: string[],
 *  post: object[]
 * }} config
 */
export const install = (config) => {
  const { devDependencies, rootDir, files, post } = config
  const args = cli()
  if (args.help) {
    console.log(help)
    return
  }
  if (args.version) {
    const { version } = packageJson()
    console.log(version)
    return
  }
  devDeps(args.pckman, devDependencies)
  if (copyFiles(rootDir, files, args.force)) {
    postProc(post)
  }
}
