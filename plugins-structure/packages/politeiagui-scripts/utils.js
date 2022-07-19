const fs = require("fs");
const path = require("path");
const readPkgUp = require("read-pkg-up");
const has = require("lodash").has;

const { packageJson: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

const appDirectory = path.dirname(pkgPath);
const fromRoot = (...p) => path.join(appDirectory, ...p);
const hasFile = (...p) => fs.existsSync(fromRoot(...p));
const hasPkgProp = (props) => [...props].some((prop) => has(pkg, prop));

module.exports = {
  hasFile,
  hasPkgProp,
};
