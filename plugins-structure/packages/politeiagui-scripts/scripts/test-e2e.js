process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const configFactory = require("../config/webpack/webpack.config");
const cypress = require("cypress");

const config = configFactory("development", "app");

cypress.run({
  browser: "chrome",
  config: {
    video: false,
    baseUrl: "https://localhost:8080",
    e2e: {
      setupNodeEvents(on) {
        on(
          "file:preprocessor",
          webpackPreprocessor({
            webpackOptions: config,
            watchOptions: {},
          })
        );
      },
    },
  },
});
