const fs = require("fs");
const path = require("path");
const readPkgUp = require("read-pkg-up");
const has = require("lodash").has;
const which = require("which");
const { cosmiconfigSync } = require("cosmiconfig");

const { packageJson: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
});

const appDirectory = path.dirname(pkgPath);
const fromRoot = (...p) => path.join(appDirectory, ...p);
const hasFile = (...p) => fs.existsSync(fromRoot(...p));
const hasPkgProp = (props) => [...props].some((prop) => has(pkg, prop));

function resolveBin(
  modName,
  { executable = modName, cwd = process.cwd() } = {}
) {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
    if (pathFromWhich && pathFromWhich.includes(".CMD")) return pathFromWhich;
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath);
    const binPath = typeof bin === "string" ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, ".");
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
}

function hasLocalConfig(moduleName, searchOptions = {}) {
  const explorerSync = cosmiconfigSync(moduleName, searchOptions);
  console.log("opa", searchOptions.stopDir);
  console.log(pkgPath);
  const result = explorerSync.search(pkgPath);
  console.log(result);
  return result !== null;
}

module.exports = {
  hasFile,
  hasPkgProp,
  resolveBin,
  hasLocalConfig,
  fromRoot
};
