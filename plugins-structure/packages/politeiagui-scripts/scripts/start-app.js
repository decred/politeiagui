process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const configFactory = require("../config/webpack/webpack.config");
const { start } = require("../utils");

const config = configFactory("development", "app");
start(config);
