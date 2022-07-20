process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

const webpack = require("webpack");
const chalk = require("chalk");
const configFactory = require("../config/webpack/webpack.config");

const config = configFactory("production");
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf("--stats") !== -1;

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
      console.log(err.message || err);
      return reject(err);
    } else {
      console.log(stats.toJson({ all: false, warnings: true, errors: true }));
    }

    const resolveArgs = {
      stats
    };

    if (writeStatsJson) {
      return bfj
        .write(paths.appBuild + "/bundle-stats.json", stats.toJson())
        .then(() => resolve(resolveArgs))
        .catch((error) => reject(new Error(error)));
    }

    return resolve(resolveArgs);
  });
});
