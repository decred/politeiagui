const { defineConfig } = require("cypress");
const configFactory = require("../politeiagui-scripts/config/webpack/webpack.config");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig: configFactory("development", "plugin"),
    },
  },
  screenshotOnRunFailure: false,
  video: false,
});
