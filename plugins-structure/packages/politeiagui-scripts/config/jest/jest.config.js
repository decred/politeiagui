module.exports = {
  transform: {
    "\\.js$": ["babel-jest", { cwd: __dirname }]
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["jest-extended/all"]
};
