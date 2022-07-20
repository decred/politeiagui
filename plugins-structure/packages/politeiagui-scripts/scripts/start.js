const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const chalk = require("chalk");
const configFactory = require("../config/webpack/webpack.config");
const createDevServerConfig = require("../config/webpack/webpackDevServer.config");

const config = configFactory("development");

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
