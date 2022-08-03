process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const path = require("path");
const { resolveApp } = require("../utils");

const createJestConfig = require("./utils/createJestConfig");

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
    ? [
        "--config",
        JSON.stringify(
          createJestConfig(
            (relativePath) => path.resolve(__dirname, "..", relativePath),
            path.resolve(resolveApp("src"), "..")
          )
        )
      ]
    : [];

const testEnvironment = ["--env", "jsdom"];

jest.run([...config, ...watch, ...args, ...testEnvironment]);
