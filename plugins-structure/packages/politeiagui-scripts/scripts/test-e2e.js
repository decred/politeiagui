process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const configFactory = require("../config/webpack/webpack.config");
const cypress = require("cypress");
const yargsParser = require("yargs-parser");
const isString = require("lodash/isString");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");
const config = configFactory("development", "app");

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);

const e2eConfig = {
  browser: "chrome",
  testingType: "e2e",
  config: {
    video: false,
    screenshotOnRunFailure: false,
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
};

const { browser } = parsedArgs;

if (browser) {
  // Defaults to chrome.
  cypress.open({
    ...e2eConfig,
    browser: isString(browser) ? browser : "chrome",
  });
} else {
  cypress.run(e2eConfig);
}
