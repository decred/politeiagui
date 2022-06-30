const { defineConfig } = require("cypress");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.baseUrl = "https://localhost:3000";
      // Configure cypress for webpack
      on(
        "file:preprocessor",
        webpackPreprocessor({
          webpackOptions: require("./webpack.dev.js"),
          watchOptions: {},
        })
      );
      return config;
    },
  },
  video: false,
});
