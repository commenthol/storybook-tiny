import sh from 'shelljs'
import * as path from 'path'

const { exec, cp, test, mkdir } = sh

const help = `
  Usage:
    storybook-tiny [options] [args]

  Options:
    -h, --help                this help
    -f, --force               force overwrite
    -p, --pckman <pnpm|yarn>  select packagemanager other than npm
`

const cli = (args) => {
  const argv = args || process.argv.slice(2)
  const c = { pckman: 'npm' }

  while (argv.length) {
    const arg = argv.shift()

    switch (arg) {
      case '-h':
      case '--help':
        c.help = true
        break
      case '-f':
      case '--force':
        c.force = true
        break
      case '-p':
      case '--pckman': {
        const pckMan = argv.shift()
        if (['npm', 'pnpm', 'yarn'].includes(pckMan)) {
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
  devDeps(args.pckman, devDependencies)
  if (copyFiles(rootDir, files, args.force)) {
    postProc(post)
  }
}
