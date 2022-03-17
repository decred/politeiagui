module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["jest-extended/all"],
  transform: {
    "\\.js$": ["babel-jest", { cwd: __dirname }],
  },
  testpathIgnorePatterns: ["/node_modules/(?!react-markdown)(.*)"],
  moduleNameMapper: {
    "\\.(css|less|svg)$": "<rootDir>/src/__mocks__/styleMock.js",
  },
};
