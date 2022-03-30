module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["jest-extended/all", "./src/setupTests.js"],
  transform: {
    "\\.js$": ["babel-jest", { cwd: __dirname }],
  },
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/src/__mocks__/styleMock.js",
  },
};
