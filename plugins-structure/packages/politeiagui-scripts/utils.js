const fs = require("fs");
const path = require("path");
const readPkgUp = require("read-pkg-up");
const has = require("lodash").has;
const which = require("which");
const webpack = require("webpack");
const chalk = require("chalk");
const bfj = require("bfj");
const WebpackDevServer = require("webpack-dev-server");
const createDevServerConfig = require("./config/webpack/webpackDevServer.config");
const { cosmiconfigSync } = require("cosmiconfig");

const { packageJson: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd())
});

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "json",
  "web.jsx",
  "jsx"
];

const appDirectory = path.dirname(pkgPath);
const resolveOwn = (relativePath) =>
  path.resolve(__dirname, "..", relativePath);
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const fromRoot = (...p) => path.join(appDirectory, ...p);
const hasFile = (...p) => fs.existsSync(fromRoot(...p));
const hasPkgProp = (props) => [...props].some((prop) => has(pkg, prop));
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

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
  const result = explorerSync.search(pkgPath);
  return result !== null;
}

function start(config) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red("Failed to compile."));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  const serverConfig = {
    ...createDevServerConfig
  };

  const devServer = new WebpackDevServer(serverConfig, compiler);
  devServer.startCallback(() => {
    console.log(chalk.cyan("Starting the development server...\n"));
  });

  ["SIGINT", "SIGTERM"].forEach(function (sig) {
    process.on(sig, function () {
      devServer.close();
      process.exit();
    });
  });

  process.stdin.on("end", function () {
    devServer.close();
    process.exit();
  });
}

function build(config, writeStatsJson) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red("Failed to compile."));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(chalk.red("Failed!"));
        console.log(chalk.red(err.message || err));
        return reject(err);
      } else {
        console.log(chalk.green("Success!"));
        const { errors, warnings } = stats.toJson({
          all: false,
          warnings: true,
          errors: true
        });
        let msg = "";
        if (errors.length !== 0) {
          for (const error of errors) {
            msg += error.message + "\n\n";
          }
          console.log(chalk.red(msg));
        }
        msg = "";
        if (warnings.length !== 0) {
          for (const warning of warnings) {
            msg += warning.message + "\n\n";
          }
          console.log(chalk.yellow(msg));
        }
      }

      const resolveArgs = {
        stats
      };

      if (writeStatsJson) {
        return bfj
          .write(resolveApp("./dist") + "/bundle-stats.json", stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch((error) => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

module.exports = {
  hasFile,
  hasPkgProp,
  resolveBin,
  hasLocalConfig,
  fromRoot,
  start,
  build,
  resolveApp,
  resolveModule,
  resolveOwn,
  moduleFileExtensions
};
