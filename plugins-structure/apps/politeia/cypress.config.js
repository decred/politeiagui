// App specific config. Global e2e configs are located on politeiagui-scripts
// package.
const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {},
  trashAssetsBeforeRuns: true,
});
