const spawn = require("cross-spawn");
const { resolveBin } = require("../utils");
const args = process.argv.slice(2);

const filesToApply = ["src/**/*.js"];
const result = spawn.sync(resolveBin("prettier"), [...filesToApply, ...args], {
  stdio: "inherit",
});

process.exit(result.status);
