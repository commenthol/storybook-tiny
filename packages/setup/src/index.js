import sh from 'shelljs'
import * as path from 'path'

const { exec, cp, cat, test, mkdir, which, pwd } = sh

const PCK_MANAGERS = ['pnpm', 'yarn', 'bun', 'cnpm', 'npm']

const help = `
  Usage:
    storybook-tiny [options] [args]

  Options:
    -h, --help        this help
    -f, --force       force overwrite
    -p, --pckman <${PCK_MANAGERS.join('|')}>
                      select package-manager
`

const cli = (args) => {
  const argv = args || process.argv.slice(2)
  const c = { pckman: detectPckManager() }

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
        if (PCK_MANAGERS.includes(pckMan)) {
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

const packageJson = () => {
  const data = cat('./package.json')
  if (!data) {
    return {}
  }
  return JSON.parse(data)
}

const detectPckManager = () => {
  sh.config.silent = true
  const { packageManager = '' } = packageJson()
  
  let pckMan
  for (pckMan of PCK_MANAGERS) {
    // check corePack package.json.packageManager
    if (packageManager.startsWith(pckMan)) {
      break
    }
    // check features
    if (pckMan === 'pnpm') {
      if (test('-f', `./pnpm-lock.yaml`)) {
        break
      }
      const cwds = pwd().split('/')
      let found
      while (cwds.length) {
        cwds.pop()
        const current = cwds.join('/')
        if (test('-f', `${current}/pnpm-workspace.yaml`)) {
          found = true
          break
        }
      }
      if (found) {
        break
      }
    }
    if (pckMan === 'yarn') {
      if (test('-f', './yarn.lock')) {
        break
      }
    }
    // check global install
    if (which(pckMan)) {
      break
    }
  }
  sh.config.silent = false
  return pckMan
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
