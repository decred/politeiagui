process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
const configFactory = require("../config/webpack/webpack.config");
const { build } = require("../utils");

const config = configFactory("production", "plugin");
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf("--stats") !== -1;

build(config, writeStatsJson);
