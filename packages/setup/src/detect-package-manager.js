import sh from 'shelljs'
import * as path from 'path'

const { cat, test, which } = sh

export const PACKAGE_MANAGERS = ['pnpm', 'yarn', 'bun', 'cnpm', 'npm']

const packageJson = (dirname = '.') => {
  const data = cat(path.join(dirname, 'package.json'))
  if (!data || data.stderr) {
    return {}
  }
  return JSON.parse(data)
}

const checkCorePack = (dirname = '.') => {
  const { packageManager = '' } = packageJson(dirname)
  if (!packageManager) {
    return
  }

  for (let pckMan of PACKAGE_MANAGERS) {
    // check corePack package.json.packageManager
    if (packageManager.startsWith(pckMan)) {
      return pckMan
    }
  }
}

const checkFeatures = (dirname = '.') => {
  for (let pckMan of PACKAGE_MANAGERS) {
    if (pckMan === 'pnpm') {
      if (test('-f', path.join(dirname, 'pnpm-lock.yaml'))) {
        return pckMan
      }
      // search for workspace setup
      if (test('-f', path.join(dirname, 'pnpm-workspace.yaml'))) {
        return pckMan
      }
    }
    if (pckMan === 'yarn') {
      if (test('-f', path.join(dirname, 'yarn.lock'))) {
        return pckMan
      }
    }
    if (['cnpm', 'npm'].includes(pckMan)) {
      if (test('-f', path.join(dirname, 'package-lock.json'))) {
        return pckMan
      }
    }
  }
}

const checkDirTree = () => {
  const tree = process.cwd().split(path.sep)
  while (tree.length) {
    let dirname = tree.join(path.sep)
    let found = checkCorePack(dirname) || checkFeatures(dirname)
    if (found) {
      return found
    }
    tree.pop()
  }
}

const checkGlobalInstall = () => {
  for (let pckMan of PACKAGE_MANAGERS) {
    // check global install
    if (which(pckMan)) {
      return pckMan
    }
  }
}

export const detectPackageManager = () => {
  sh.config.silent = true
  const pckMan = checkDirTree() || checkGlobalInstall() || 'npm'
  sh.config.silent = false
  return pckMan
}

// console.log(detectPackageManager())
