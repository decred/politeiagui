const fs = require("fs");
const {
  resolveModule,
  resolveApp,
  resolveOwn,
  moduleFileExtensions
} = require("../../utils");
const testsSetup = resolveModule(resolveApp, "src/setupTests");

module.exports = (resolve, rootDir) => {
  console.log(resolve, rootDir);
  const setupTestsMatches = testsSetup.match(/src[/\\]setupTests\.(.+)/);
  const setupTestsFileExtension =
    (setupTestsMatches && setupTestsMatches[1]) || "js";
  const setupTestsFile = fs.existsSync(testsSetup)
    ? `<rootDir>/src/setupTests.${setupTestsFileExtension}`
    : undefined;
  console.log(setupTestsFile);

  const config = {
    roots: ["<rootDir>/src"],

    collectCoverageFrom: ["src/**/*.{js,jsx}"],

    setupFiles: [require.resolve("react-app-polyfill/jsdom")],

    setupFilesAfterEnv: setupTestsFile
      ? ["jest-extended/all", setupTestsFile]
      : ["jest-extended/all"],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx}"
    ],
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": resolve(
        "config/jest/babelTransform.js"
      ),
      "^.+\\.css$": resolve("config/jest/cssTransform.js"),
      "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": resolve(
        "config/jest/fileTransform.js"
      )
    },
    transformIgnorePatterns: [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    modulePaths: [],
    moduleNameMapper: {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    moduleFileExtensions: [...moduleFileExtensions, "node"].filter(
      (ext) => !ext.includes("mjs")
    ),
    watchPlugins: [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ],
    resetMocks: true
  };

  console.log(config);
  return config;
};
