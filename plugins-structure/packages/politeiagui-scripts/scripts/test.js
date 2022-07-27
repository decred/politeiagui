process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const { hasPkgProp, hasFile } = require("../utils");
const isCI = require("is-ci");
const jest = require("jest");
const args = process.argv.slice(2);

const watch =
  !isCI &&
  !args.includes("--no-watch") &&
  !args.includes("--coverage") &&
  !args.includes("--updateSnapshot")
    ? ["--watch"]
    : [];

const config =
  !args.includes("--config") &&
  !hasFile("jest.config.js") &&
  !hasPkgProp("jest")
    ? ["--config", JSON.stringify(require("../config/jest/jest.config"))]
    : [];

jest.run([...config, ...watch, ...args]);
