// App specific config. Global e2e configs are located on politeiagui-scripts
// package.
const { defineConfig } = require("cypress");
const configFactory = require("../../packages/politeiagui-scripts/config/webpack/webpack.config");

module.exports = defineConfig({
  e2e: {},

  downloads: {
    trashAssetsBeforeRuns: true,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig: configFactory("development", "app"),
    },
  },
  screenshotOnRunFailure: false,
  video: false,
});
